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

# FLAN-T5 rewrite support is intentionally disabled for the current deployed MVP.
# Loading torch/transformers during a live FastAPI request is too heavy for the
# current FastAPI Cloud runtime and causes /chat to time out. Keep this here as
# a marker for the future offline rewrite/training path.
# try:
#     import torch
#     from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
# except ImportError:  # pragma: no cover - optional until the venv dependencies are present
#     torch = None  # type: ignore[assignment]
#     AutoModelForSeq2SeqLM = None  # type: ignore[assignment]
#     AutoTokenizer = None  # type: ignore[assignment]


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
REFERENTIAL_FOLLOW_UPS = {
    "it",
    "that",
    "this",
    "that one",
    "this one",
    "the link",
    "link",
    "can i see it",
    "can i see that",
    "can i see this",
    "show it",
    "show me it",
    "show me that",
    "show me this",
    "send it",
    "send me it",
    "send me that",
    "share it",
    "share that",
    "share this",
    "open it",
    "open that",
    "where is it",
    "where is that",
    "download it",
    "can i download it",
}
GREETING_PREFIXES = (
    "hello",
    "hi",
    "hey",
    "yo",
    "sup",
    "good morning",
    "good afternoon",
    "good evening",
)
DIRECT_QUERY_ALIASES = {
    "thanks": "thanks",
    "thank you": "thank you",
    "thank you so much": "thank you",
    "thanks a lot": "thanks",
    "appreciate it": "thank you",
    "cool": "you are cool",
    "you are cool": "you are cool",
    "youre cool": "you are cool",
    "you are cool dude": "you are cool dude",
    "awesome": "thats awesome",
    "that's awesome": "thats awesome",
    "thats awesome": "thats awesome",
    "that is awesome": "that is awesome",
    "amazing": "amazing",
    "that rocks": "that rocks",
    "you rock": "you rock",
    "this rocks": "this rocks",
    "nice": "nice",
    "nice work": "nice work",
    "great job": "great job",
    "well done": "well done",
    "impressive": "this is impressive",
    "ok": "ok",
    "okay": "okay",
    "got it": "got it",
    "makes sense": "makes sense",
    "interesting": "interesting",
    "never mind": "never mind",
    "nevermind": "nevermind",
    "bye": "bye",
    "goodbye": "goodbye",
    "good bye": "goodbye",
    "see you": "see you later",
    "see you later": "see you later",
    "see ya": "see you later",
    "later": "see you later",
    "talk later": "see you later",
    "adios": "goodbye",
    "sayonara": "goodbye",
    "farewell": "goodbye",
    "take care": "take care",
    "portfolio": "portfolio",
    "your portfolio": "your portfolio",
    "my portfolio": "my portfolio",
    "portfolio link": "portfolio link",
    "cv": "cv",
    "resume": "resume",
    "your cv": "your cv",
    "your resume": "your resume",
    "cv link": "cv link",
    "resume link": "resume link",
    "linkedin": "linkedin",
    "your linkedin": "your linkedin",
    "linkedin link": "linkedin link",
    "github": "github",
    "your github": "your github",
    "github link": "github link",
    "hire": "why should i hire you",
    "available": "are you available for work",
    "availability": "are you available for work",
    "remote": "do you work remote",
    "where are you": "where are you based",
    "where are you based": "where are you based",
    "where are you located": "where are you based",
    "where do you live": "where are you based",
    "salary": "what is your salary expectation",
    "compensation": "what is your salary expectation",
    "location": "where are you based",
    "arabic": "arabic language yes",
    "speak arabic": "arabic language yes",
    "do you speak arabic": "arabic language yes",
    "can you speak arabic": "arabic language yes",
    "do you know arabic": "arabic language yes",
    "preferred work location": "where would you like to work",
    "work location": "where would you like to work",
    "stack": "what is your tech stack",
    "tech stack": "what is your tech stack",
    "projects": "projects",
    "forecast alpha": "forecast alpha",
    "hobbies": "what do you like outside work",
    "interests": "what do you like outside work",
    "personal interests": "what do you like outside work",
    "likes": "what do you like outside work",
    "what do you like": "what do you like outside work",
    "what does hisham like": "what does hisham like outside work",
    "contact": "contact",
    "contact details": "contact details",
    "email": "email",
    "whatsapp": "whatsapp",
    "frontend": "frontend",
    "front end": "front end",
    "backend": "backend",
    "html": "html",
    "css": "css",
    "javascript": "javascript",
    "ai": "ai",
    "philosophy": "philosophy",
    "physics": "physics",
    "schroedinger": "schroedinger cat",
    "schrodinger": "schroedinger cat",
    "schroedinger cat": "schroedinger cat",
    "schrodinger cat": "schroedinger cat",
    "many worlds": "many worlds interpretation",
    "many worlds interpretation": "many worlds interpretation",
    "everett": "many worlds interpretation",
    "wavefunction": "wavefunction",
    "decoherence": "decoherence",
    "stardust": "are we made of stardust",
    "aliens": "do you believe in aliens",
    "alien life": "alien life",
    "extraterrestrial life": "extraterrestrial life",
    "are we alone": "are we alone",
    "why exist": "why do we exist",
    "why do we exist": "why do we exist",
    "why are we here": "why are we here",
    "purpose": "what is our purpose",
    "our purpose": "what is our purpose",
    "energy": "energy",
    "nuclear energy": "what about nuclear energy",
    "renewable energy": "what about renewable energy",
    "electricity": "what about electricity",
    "power grid": "what is the power grid",
    "data centers": "data centers",
    "data center": "data centers",
    "education": "education",
    "background": "background",
    "experience": "experience",
    "strengths": "what are your strengths",
    "weaknesses": "what are your weaknesses",
    "strengths and weaknesses": "what are your strengths and weaknesses",
    "current role": "what is your current role",
    "job": "what is your current role",
}

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
    if normalized.startswith(GREETING_PREFIXES):
        return False

    canonical = canonicalize_query(normalized)
    return (
        normalized in SHORT_FOLLOW_UPS
        or canonical in REFERENTIAL_FOLLOW_UPS
        or len(normalized.split()) <= 2
        or normalized.startswith(TOPIC_PIVOT_PREFIXES)
    )


def canonicalize_query(query: str) -> str:
    normalized = " ".join(query.lower().split())
    return normalized.strip(" ?!.>,<;:")


def direct_query_alias(query: str) -> str | None:
    return DIRECT_QUERY_ALIASES.get(canonicalize_query(query))


def topic_query_from_text(text: str) -> str | None:
    normalized = canonicalize_query(text)
    padded = f" {normalized} "

    topic_rules = [
        (("bye", "goodbye", "good bye", "see you", "see ya", "later", "adios", "sayonara", "farewell", "take care"), "goodbye"),
        (("you are cool", "youre cool", "cool dude", "awesome", "amazing", "that rocks", "this rocks", "you rock", "nice work", "great job", "well done", "impressive", "love this", "this is cool"), "you are cool"),
        (("hire", "why should we hire", "why should i hire", "open to opportunities", "available for work", "available for freelance", "work together", "interview hisham"), "why should i hire you"),
        (("salary", "compensation", "pay expectation", "salary expectation"), "what is your salary expectation"),
        (("where are you", "where are you based", "where are you located", "where do you live", "current location", "based in", "your location"), "where are you based"),
        (("where would you like to work", "where do you want to work", "where would hisham like to work", "preferred work location", "work location", "work in japan", "work in usa", "work in europe", "work in latam", "work in south korea", "work in malaysia", "work in china"), "where would you like to work"),
        (("remote", "work remotely", "work remote", "relocate", "relocation"), "do you work remote"),
        (("arabic", "speak arabic", "do you know arabic", "can you speak arabic"), "arabic language yes"),
        (("ok", "okay", "got it", "makes sense", "i see", "never mind", "nevermind", "forget it"), "ok"),
        (("what should i ask", "where should we start", "what should we talk", "suggest a question", "i dont know what to ask", "i don't know what to ask"), "what should i ask first"),
        (("what do you like", "what does hisham like", "hobbies", "interests", "personal interests", "outside work", "free time", "spare time", "for fun", "model making", "learning languages"), "what do you like outside work"),
        (("ask me anything", "ask me about", "what can i ask", "what can you answer", "background, experience", "github, linkedin"), "what can i ask you about"),
        (("tell you more about his work", "tell me more about his work", "more about his work", "his work"), "tell me more about his work"),
        (("strengths and weaknesses", "strength and weaknesses", "strengths weaknesses"), "what are your strengths and weaknesses"),
        (("weakness", "weaknesses", "weak point", "weak points", "improving", "need to improve"), "what are your weaknesses"),
        (("strength", "strengths", "strongest", "best skills", "strong points"), "what are your strengths"),
        (("work for", "employed", "freelance", "freelancing", "work for yourself", "current role", "role now", "job now"), "what is your current role"),
        (("portfolio",), "portfolio"),
        ((" cv ", "resume"), "cv"),
        (("linkedin",), "linkedin"),
        (("github",), "github"),
        (("contact", "email", "whatsapp", "reach", "get in touch", "message"), "contact"),
        (("frontend", "front end", "html", "css", "javascript"), "frontend"),
        (("backend", "api", "fastapi", "rails", "postgresql", "sql"), "backend"),
        (("stardust", "made of stars", "made from stars", "made of stardust", "what are we made of", "what are humans made of"), "are we made of stardust"),
        (("why do we exist", "why are we here", "point of life", "our purpose", "purpose of life", "meaning of existence"), "why do we exist"),
        (("are we alone", "alone in the universe", "life outside earth", "life on other planets"), "are we alone"),
        (("alien", "aliens", "extraterrestrial", "ufo", "ufos"), "do you believe in aliens"),
        (("philosophy", "meaning of life", "consciousness", "free will", "existence", "truth", "ethics"), "philosophy"),
        (("many worlds", "everett", "branching universe", "branching worlds", "quantum branches"), "many worlds interpretation"),
        (("schroedinger", "schrodinger", "cat paradox", "schroedinger cat", "schrodinger cat"), "schroedinger cat"),
        (("wavefunction collapse", "collapse of the wavefunction", "measurement problem", "quantum measurement"), "quantum measurement problem"),
        (("decoherence",), "decoherence"),
        (("wavefunction", "universal wavefunction"), "wavefunction"),
        (("physics", "quantum", "relativity", "gravity", "thermodynamics", "entropy", "universe"), "physics"),
        (("data center", "data centers", "datacenter", "compute infrastructure", "gpu cluster", "server farm"), "data centers"),
        (("nuclear energy", "nuclear power"), "what about nuclear energy"),
        (("renewable energy", "renewables", "solar", "wind", "battery"), "what about renewable energy"),
        (("power grid", "electric grid"), "what is the power grid"),
        (("electricity",), "what about electricity"),
        (("energy", "electricity", "power grid", "renewable", "solar", "battery", "nuclear"), "energy"),
        ((" ai ", "artificial intelligence", "machine learning", "forecasting", "anomaly detection"), "ai"),
        (("education", "school", "university", "degree", "study", "studied"), "education"),
        (("experience", "career", "background"), "experience"),
        (("forecast alpha",), "forecast alpha"),
        (("die", "death", "after death"), "what happens when we die"),
        (("work", "build", "projects"), "tell me more about his work"),
    ]

    for markers, expanded_query in topic_rules:
        if any(marker in padded for marker in markers):
            return expanded_query

    return None


def infer_conversation_topic(messages: Sequence[Any]) -> str | None:
    seen_latest_user = False

    for message in reversed(messages):
        role = getattr(message, "role", None)
        content = getattr(message, "content", "").strip()
        if not content:
            continue

        if role == "user" and not seen_latest_user:
            seen_latest_user = True
            continue

        topic_query = topic_query_from_text(content)
        if topic_query:
            return topic_query

    return None


def expand_follow_up_query(messages: Sequence[Any]) -> str:
    query = latest_user_message(messages)
    if not query:
        return ""

    normalized_query = " ".join(query.lower().split())
    direct_query = direct_query_alias(normalized_query)
    if direct_query:
        return direct_query

    if not is_short_follow_up(normalized_query):
        return query

    previous_assistant = previous_assistant_message(messages).lower()
    previous_user = previous_user_message(messages).lower()
    combined_context = f"{previous_user} {previous_assistant}".strip()
    remembered_topic = infer_conversation_topic(messages)

    current_topic_query = topic_query_from_text(normalized_query)
    if current_topic_query:
        return current_topic_query

    if normalized_query in {"anything?", "really?", "like what?", "for example?", "what do you mean?"}:
        contextual_query = topic_query_from_text(combined_context)
        return contextual_query or remembered_topic or "what can i ask you about"

    if canonicalize_query(normalized_query) in REFERENTIAL_FOLLOW_UPS and remembered_topic:
        return remembered_topic

    contextual_query = topic_query_from_text(combined_context)
    if contextual_query:
        return contextual_query

    if remembered_topic:
        return remembered_topic

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


# @lru_cache(maxsize=1)
# def load_rewrite_bundle() -> tuple[AutoTokenizer, AutoModelForSeq2SeqLM] | None:
#     if torch is None or AutoTokenizer is None or AutoModelForSeq2SeqLM is None:
#         return None
#
#     tokenizer = AutoTokenizer.from_pretrained(REWRITE_MODEL_NAME)
#     model = AutoModelForSeq2SeqLM.from_pretrained(REWRITE_MODEL_NAME)
#     model.eval()
#     return tokenizer, model


def contains_url(text: str) -> bool:
    return bool(re.search(r"https?://\S+", text))


def rewrite_third_person_answer(question: str, reference_answer: str) -> str:
    return reference_answer

    # FLAN-T5 runtime rewrite kept for future offline use.
    # bundle = load_rewrite_bundle()
    # if bundle is None:
    #     return reference_answer
    #
    # tokenizer, model = bundle
    # prompt = REWRITE_PROMPT_TEMPLATE.format(question=question.strip(), answer=reference_answer.strip())
    # inputs = tokenizer(
    #     prompt,
    #     return_tensors="pt",
    #     truncation=True,
    #     max_length=256,
    # )
    #
    # with torch.no_grad():
    #     output_ids = model.generate(
    #         **inputs,
    #         max_new_tokens=96,
    #         num_beams=4,
    #         do_sample=False,
    #         early_stopping=True,
    #         no_repeat_ngram_size=3,
    #     )
    #
    # rewritten = tokenizer.decode(output_ids[0], skip_special_tokens=True).strip()
    # if not rewritten:
    #     return reference_answer
    #
    # if contains_url(reference_answer) and not contains_url(rewritten):
    #     return reference_answer
    #
    # if len(rewritten.split()) < 3:
    #     return reference_answer
    #
    # if "Hisham" in reference_answer and "Hisham" not in rewritten:
    #     return reference_answer
    #
    # return rewritten


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
