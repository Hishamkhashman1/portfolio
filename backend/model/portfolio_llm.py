from __future__ import annotations

import json
import math
import re
from collections import Counter
from functools import lru_cache
from pathlib import Path
from typing import Any, Sequence

from model.tokenizer import normalize_text

try:
    import torch
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
except ImportError:  # pragma: no cover - optional until the venv dependencies are present
    torch = None  # type: ignore[assignment]
    AutoModelForSeq2SeqLM = None  # type: ignore[assignment]
    AutoTokenizer = None  # type: ignore[assignment]


RETRIEVER_ARTIFACT_PATH = Path(__file__).resolve().parent / "artifacts" / "portfolio_retriever.json"
REWRITE_MODEL_NAME = "google/flan-t5-small"
FALLBACK_ANSWER = "I'm still learning that part of Hisham's portfolio."
MIN_MATCH_SCORE = 0.18

REWRITE_PROMPT_TEMPLATE = (
    "You rewrite portfolio answers without adding facts.\n"
    "Keep URLs, names, and numbers exactly unchanged.\n"
    "If the question is about Hisham in third person, rewrite the answer in third person.\n"
    "Question: {question}\n"
    "Reference answer: {answer}\n"
    "Rewritten answer:"
)


def latest_user_message(messages: Sequence[Any]) -> str:
    for message in reversed(messages):
        if getattr(message, "role", None) == "user":
            content = getattr(message, "content", "").strip()
            if content:
                return content

    return ""


def is_third_person_question(question: str) -> bool:
    normalized = " ".join(question.lower().split())
    if normalized.startswith(("hello", "hi", "hey")):
        return False

    markers = (
        "tell me about his",
        "tell me about hisham",
        "what does hisham",
        "what is hisham",
        "what is hisham's",
        "who is hisham",
        "who is hisham khashman",
        "does hisham",
        "is he",
        "can he",
        "what is his",
        "what are his",
        "what does he",
        "about his",
        "about him",
        "his work",
        "his cv",
        "his resume",
    )
    return any(marker in normalized for marker in markers)


def normalize_answer_person(answer: str) -> str:
    replacements = [
        (r"\bI'm\b", "Hisham is"),
        (r"\bI am\b", "Hisham is"),
        (r"\bI've\b", "Hisham has"),
        (r"\bI have\b", "Hisham has"),
        (r"\bI was\b", "Hisham was"),
        (r"\bI will\b", "Hisham will"),
        (r"\bI work\b", "Hisham works"),
        (r"\bI build\b", "Hisham builds"),
        (r"\bI founded\b", "Hisham founded"),
        (r"\bI focus\b", "Hisham focuses"),
        (r"\bMy\b", "Hisham's"),
        (r"\bmy\b", "his"),
        (r"\bme\b", "Hisham"),
        (r"\bI\b", "Hisham"),
    ]

    text = answer.strip()
    for pattern, replacement in replacements:
        text = re.sub(pattern, replacement, text)

    return text


@lru_cache(maxsize=1)
def load_retriever_artifact() -> dict[str, Any]:
    if not RETRIEVER_ARTIFACT_PATH.exists():
        return {}

    with RETRIEVER_ARTIFACT_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def vectorize_text(text: str, token_to_id: dict[str, int], idf: dict[str, float]) -> dict[str, float]:
    tokens = [token for token in normalize_text(text) if token in token_to_id and token != "<unk>"]
    if not tokens:
        return {}

    counts = Counter(tokens)
    token_count = len(tokens)
    vector: dict[str, float] = {}
    norm_sq = 0.0

    for token, count in counts.items():
        weight = (count / token_count) * idf.get(token, 0.0)
        if weight <= 0.0:
            continue

        vector[token] = weight
        norm_sq += weight * weight

    if norm_sq == 0.0:
        return {}

    norm = math.sqrt(norm_sq)
    return {token: weight / norm for token, weight in vector.items()}


def cosine_similarity(left: dict[str, float], right: dict[str, float]) -> float:
    if not left or not right:
        return 0.0

    if len(left) > len(right):
        left, right = right, left

    return sum(weight * right.get(token, 0.0) for token, weight in left.items())


def predict_answer(query: str) -> tuple[str, float]:
    artifact = load_retriever_artifact()
    if not artifact:
        return FALLBACK_ANSWER, 0.0

    token_to_id = artifact.get("token_to_id", {})
    idf = artifact.get("idf", {})
    documents = artifact.get("documents", [])

    query_vector = vectorize_text(query, token_to_id, idf)
    if not query_vector or not documents:
        return FALLBACK_ANSWER, 0.0

    best_answer = FALLBACK_ANSWER
    best_score = 0.0

    for document in documents:
        score = cosine_similarity(query_vector, document.get("vector", {}))
        if score > best_score:
            best_score = score
            best_answer = document.get("target_text", FALLBACK_ANSWER)

    if best_score < MIN_MATCH_SCORE:
        return FALLBACK_ANSWER, best_score

    return best_answer, best_score


@lru_cache(maxsize=1)
def load_rewrite_bundle() -> tuple[AutoTokenizer, AutoModelForSeq2SeqLM] | None:
    if torch is None or AutoTokenizer is None or AutoModelForSeq2SeqLM is None:
        return None

    tokenizer = AutoTokenizer.from_pretrained(REWRITE_MODEL_NAME)
    model = AutoModelForSeq2SeqLM.from_pretrained(REWRITE_MODEL_NAME)
    model.eval()
    return tokenizer, model


def contains_url(text: str) -> bool:
    return bool(re.search(r"https?://\S+", text))


def rewrite_third_person_answer(question: str, reference_answer: str) -> str:
    bundle = load_rewrite_bundle()
    if bundle is None:
        return reference_answer

    tokenizer, model = bundle
    prompt = REWRITE_PROMPT_TEMPLATE.format(question=question.strip(), answer=reference_answer.strip())
    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=256,
    )

    with torch.no_grad():
        output_ids = model.generate(
            **inputs,
            max_new_tokens=96,
            num_beams=4,
            do_sample=False,
            early_stopping=True,
            no_repeat_ngram_size=3,
        )

    rewritten = tokenizer.decode(output_ids[0], skip_special_tokens=True).strip()
    if not rewritten:
        return reference_answer

    if contains_url(reference_answer) and not contains_url(rewritten):
        return reference_answer

    if len(rewritten.split()) < 3:
        return reference_answer

    if "Hisham" in reference_answer and "Hisham" not in rewritten:
        return reference_answer

    return rewritten


def answer_from_messages(messages: Sequence[Any]) -> str:
    query = latest_user_message(messages)
    if not query:
        return FALLBACK_ANSWER

    answer, _score = predict_answer(query)
    if answer == FALLBACK_ANSWER:
        return FALLBACK_ANSWER

    if is_third_person_question(query):
        normalized_answer = normalize_answer_person(answer)
        rewritten_answer = rewrite_third_person_answer(query, normalized_answer)
        return rewritten_answer or normalized_answer

    return answer
