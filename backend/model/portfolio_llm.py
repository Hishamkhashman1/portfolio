from __future__ import annotations

import json
import math
import re
from collections import Counter
from functools import lru_cache
from pathlib import Path
from typing import Any, Sequence

try:
    from model.tokenizer import normalize_text
except ModuleNotFoundError:  # pragma: no cover - repo-root execution
    from backend.model.tokenizer import normalize_text

try:
    from sentence_transformers import SentenceTransformer
except ImportError:  # pragma: no cover - optional until installed
    SentenceTransformer = None  # type: ignore[assignment]

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
DEFAULT_TFIDF_WEIGHT = 0.45
DEFAULT_EMBEDDING_WEIGHT = 0.55
SHORT_FOLLOW_UPS = {
    "yes",
    "yeah",
    "yep",
    "sure",
    "ok",
    "okay",
    "please",
    "go on",
    "continue",
    "more",
    "tell me more",
    "can you tell me more",
    "anything?",
    "really?",
    "like what?",
    "for example?",
    "what do you mean?",
}
TOPIC_PIVOT_PREFIXES = (
    "what about ",
    "how about ",
    "and ",
)

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


def previous_assistant_message(messages: Sequence[Any]) -> str:
    seen_latest_user = False

    for message in reversed(messages):
        role = getattr(message, "role", None)
        content = getattr(message, "content", "").strip()
        if not content:
            continue

        if role == "user" and not seen_latest_user:
            seen_latest_user = True
            continue

        if seen_latest_user and role == "assistant":
            return content

    return ""


def previous_user_message(messages: Sequence[Any]) -> str:
    seen_latest_user = False

    for message in reversed(messages):
        role = getattr(message, "role", None)
        content = getattr(message, "content", "").strip()
        if role != "user" or not content:
            continue

        if not seen_latest_user:
            seen_latest_user = True
            continue

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


def is_short_follow_up(query: str) -> bool:
    normalized = " ".join(query.lower().split())
    return (
        normalized in SHORT_FOLLOW_UPS
        or len(normalized.split()) <= 2
        or normalized.startswith(TOPIC_PIVOT_PREFIXES)
    )


def expand_follow_up_query(messages: Sequence[Any]) -> str:
    query = latest_user_message(messages)
    if not query:
        return ""

    normalized_query = " ".join(query.lower().split())
    if not is_short_follow_up(normalized_query):
        return query

    previous_assistant = previous_assistant_message(messages).lower()
    previous_user = previous_user_message(messages).lower()
    combined_context = f"{previous_user} {previous_assistant}".strip()

    topic_rules = [
        (("ask me anything", "ask me about", "background, experience, projects", "professional background"), "what can i ask you about"),
        ((" ai ", "artificial intelligence", "machine learning", "forecasting", "anomaly detection"), "tell me about your ai experience"),
        (("linkedin",), "what is your linkedin"),
        (("github",), "what is your github"),
        (("cv", "resume"), "do you have a cv"),
        (("contact", "email", "whatsapp", "reach", "get in touch"), "how can i contact hisham"),
        (("portfolio", "projects", "show me your work"), "show me your work"),
        (("his work", "your work", "experience", "background", "build"), "tell me more about his work"),
    ]

    padded_context = f" {combined_context} "

    for markers, expanded_query in topic_rules:
        if any(marker in padded_context for marker in markers):
            return expanded_query

    if normalized_query in {"anything?", "really?", "like what?", "for example?", "what do you mean?"}:
        return "what can i ask you about"

    if normalized_query.startswith(("what about ai", "how about ai")):
        return "tell me about your ai experience"

    if "ai" in normalized_query or "artificial intelligence" in normalized_query or "machine learning" in normalized_query:
        return "tell me about your ai experience"

    if previous_user:
        return previous_user

    return query


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


def dense_cosine_similarity(left: list[float] | None, right: list[float] | None) -> float:
    if not left or not right or len(left) != len(right):
        return 0.0

    return sum(left_value * right_value for left_value, right_value in zip(left, right))


@lru_cache(maxsize=1)
def load_embedding_model() -> Any | None:
    if SentenceTransformer is None:
        return None

    artifact = load_retriever_artifact()
    model_name = artifact.get("embedding_model")
    if not model_name:
        return None

    try:
        return SentenceTransformer(model_name)
    except Exception:
        return None


def build_query_embedding(query: str) -> list[float] | None:
    model = load_embedding_model()
    if model is None:
        return None

    encoded = model.encode(
        query,
        normalize_embeddings=True,
        show_progress_bar=False,
    )
    return encoded.tolist()


def predict_answer(query: str) -> tuple[str, float]:
    artifact = load_retriever_artifact()
    if not artifact:
        return FALLBACK_ANSWER, 0.0

    token_to_id = artifact.get("token_to_id", {})
    idf = artifact.get("idf", {})
    documents = artifact.get("documents", [])
    hybrid_weights = artifact.get("hybrid_weights", {})
    tfidf_weight = float(hybrid_weights.get("tfidf", DEFAULT_TFIDF_WEIGHT))
    embedding_weight = float(hybrid_weights.get("embedding", DEFAULT_EMBEDDING_WEIGHT))

    query_vector = vectorize_text(query, token_to_id, idf)
    query_embedding = build_query_embedding(query)
    if not documents or (not query_vector and query_embedding is None):
        return FALLBACK_ANSWER, 0.0

    best_answer = FALLBACK_ANSWER
    best_score = 0.0

    for document in documents:
        tfidf_score = cosine_similarity(query_vector, document.get("vector", {})) if query_vector else 0.0
        embedding_score = dense_cosine_similarity(query_embedding, document.get("embedding"))

        if query_embedding is None:
            score = tfidf_score
        elif query_vector:
            score = (tfidf_score * tfidf_weight) + (embedding_score * embedding_weight)
        else:
            score = embedding_score

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
    query = expand_follow_up_query(messages)
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
