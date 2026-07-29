from __future__ import annotations

import json
import math
import re
from collections import Counter
from functools import lru_cache
from pathlib import Path
from typing import Any, Sequence

try:
    from app.config import (
        get_confidence_threshold,
        get_embeddings_path,
        get_lexical_weight,
        get_max_query_length,
        get_onnx_model_path,
        get_semantic_enabled,
        get_semantic_weight,
    )
    from model.tokenizer import normalize_text
except ModuleNotFoundError:  # pragma: no cover - repo-root execution
    from backend.app.config import (
        get_confidence_threshold,
        get_embeddings_path,
        get_lexical_weight,
        get_max_query_length,
        get_onnx_model_path,
        get_semantic_enabled,
        get_semantic_weight,
    )
    from backend.model.tokenizer import normalize_text

try:
    import numpy as np
except ImportError:  # pragma: no cover - optional until installed
    np = None  # type: ignore[assignment]

try:
    import onnxruntime as ort
except ImportError:  # pragma: no cover - optional until installed
    ort = None  # type: ignore[assignment]

try:
    from tokenizers import Tokenizer
except ImportError:  # pragma: no cover - optional until installed
    Tokenizer = None  # type: ignore[assignment]

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
    "wtf": "bad language response",
    "what the fuck": "bad language response",
    "fuck": "bad language response",
    "fuck you": "bad language response",
    "stfu": "bad language response",
    "shit": "bad language response",
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
    "projects": "specific project examples",
    "your projects": "specific project examples",
    "my projects": "specific project examples",
    "his projects": "specific project examples",
    "hisham projects": "specific project examples",
    "tell me about your projects": "specific project examples",
    "tell me about hisham's projects": "specific project examples",
    "tell me about his projects": "specific project examples",
    "can you tell me about your projects": "specific project examples",
    "can you tell me about hisham's projects": "specific project examples",
    "can you tell me about his projects": "specific project examples",
    "list your projects": "specific project examples",
    "list hisham's projects": "specific project examples",
    "list his projects": "specific project examples",
    "list of your projects": "specific project examples",
    "list of hisham's projects": "specific project examples",
    "give me a list of your projects": "specific project examples",
    "give me a list of hisham's projects": "specific project examples",
    "give me a project list": "specific project examples",
    "give me examples": "specific project examples",
    "give me example": "specific project examples",
    "examples": "specific project examples",
    "project list": "specific project examples",
    "project examples": "specific project examples",
    "examples of projects": "specific project examples",
    "example projects": "specific project examples",
    "give me example of projects": "specific project examples",
    "give me examples of projects": "specific project examples",
    "full stack projects": "full stack project examples",
    "full-stack projects": "full stack project examples",
    "fullstack projects": "full stack project examples",
    "full stack examples": "full stack project examples",
    "full-stack examples": "full stack project examples",
    "fullstack examples": "full stack project examples",
    "forecast alpha": "forecast alpha",
    "hobbies": "what do you like outside work",
    "interests": "what do you like outside work",
    "personal interests": "what do you like outside work",
    "likes": "what do you like outside work",
    "what do you like": "what do you like outside work",
    "what does hisham like": "what does hisham like outside work",
    "what languages do you speak": "what languages do you speak",
    "what languages can you speak": "what languages do you speak",
    "which languages do you speak": "what languages do you speak",
    "what languages do you know": "what languages do you speak",
    "languages you speak": "what languages do you speak",
    "spoken languages": "what languages do you speak",
    "what languages does hisham speak": "what languages does hisham speak",
    "what languages does he speak": "what languages does hisham speak",
    "which languages does hisham speak": "what languages does hisham speak",
    "which languages does he speak": "what languages does hisham speak",
    "what languages can hisham speak": "what languages does hisham speak",
    "what languages can he speak": "what languages does hisham speak",
    "languages hisham speaks": "what languages does hisham speak",
    "languages he speaks": "what languages does hisham speak",
    "calendly": "calendly link",
    "calendar": "calendly link",
    "meeting": "schedule a meeting",
    "book meeting": "schedule a meeting",
    "book a meeting": "schedule a meeting",
    "schedule meeting": "schedule a meeting",
    "schedule a meeting": "schedule a meeting",
    "schedule a call": "schedule a call",
    "book a call": "schedule a call",
    "call": "schedule a call",
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
    "tell me about hisham": "tell me about hisham",
    "tell me about hisham khashman": "tell me about hisham",
    "about hisham": "tell me about hisham",
    "who is hisham": "tell me about hisham",
    "who is hisham khashman": "tell me about hisham",
    "tell me about him": "tell me about hisham",
    "about him": "tell me about hisham",
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

    if ("language" in normalized or "speak" in normalized) and "arabic" not in normalized:
        if any(marker in normalized for marker in ("hisham", " he ", " his ")):
            return "what languages does hisham speak"
        if any(marker in normalized for marker in ("what languages", "which languages", "languages do", "languages can", "languages you", "spoken languages")):
            return "what languages do you speak"

    topic_rules = [
        (("wtf", "what the fuck", "fuck you", "fuck off", "stfu", "shut up", "bullshit"), "bad language response"),
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
        (("tell me about hisham", "tell me about hisham khashman", "who is hisham", "who is hisham khashman", "about hisham", "tell me about him", "about him"), "tell me about hisham"),
        (("tell me about your projects", "tell me about his projects", "tell me about hisham's projects", "can you tell me about your projects", "can you tell me about his projects", "give me a list of your projects", "give me a list of his projects", "list of your projects", "list of his projects", "project list", "give me example of projects", "give me examples of projects", "example of projects", "examples of projects", "project examples", "example projects", "specific projects", "show me projects", "list projects", "what projects have you built"), "specific project examples"),
        (("full stack expertise", "full-stack expertise", "fullstack expertise", "full stack projects", "full-stack projects", "fullstack projects", "demonstrated your full stack", "demonstrated your full-stack", "demonstrated your fullstack", "full stack examples", "full-stack examples", "fullstack examples"), "full stack project examples"),
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
        (("calendly", "calendar", "book a meeting", "book meeting", "schedule a meeting", "schedule meeting", "book a call", "schedule a call", "set up a call", "set up a meeting", "meet with hisham", "talk to hisham", "30 minute", "30min"), "schedule a meeting"),
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

    current_topic_query = topic_query_from_text(normalized_query)
    if current_topic_query:
        return current_topic_query

    if not is_short_follow_up(normalized_query):
        return query

    previous_assistant = previous_assistant_message(messages).lower()
    previous_user = previous_user_message(messages).lower()
    combined_context = f"{previous_user} {previous_assistant}".strip()
    remembered_topic = infer_conversation_topic(messages)

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


def dense_cosine_similarity(left: Any | None, right: Any | None) -> float:
    if left is None or right is None or len(left) != len(right):
        return 0.0

    return float(sum(left_value * right_value for left_value, right_value in zip(left, right)))


@lru_cache(maxsize=1)
def load_embeddings() -> Any | None:
    if np is None:
        return None

    artifact = load_retriever_artifact()
    embeddings_path = Path(artifact.get("embeddings_path") or get_embeddings_path())
    if not embeddings_path.exists():
        return None

    try:
        loaded = np.load(embeddings_path)
        return loaded["embeddings"].astype(np.float32)
    except Exception:
        return None


def _tokenizer_path_for_model(model_path: Path) -> Path:
    return model_path.parent / "tokenizer.json"


@lru_cache(maxsize=1)
def load_embedding_components() -> tuple[Any, Any] | None:
    if not get_semantic_enabled() or np is None or ort is None or Tokenizer is None:
        return None

    model_path = get_onnx_model_path()
    tokenizer_path = _tokenizer_path_for_model(model_path)
    if not model_path.exists() or not tokenizer_path.exists():
        return None

    try:
        tokenizer = Tokenizer.from_file(str(tokenizer_path))
        tokenizer.enable_truncation(max_length=get_max_query_length())
        session = ort.InferenceSession(str(model_path), providers=["CPUExecutionProvider"])
        return tokenizer, session
    except Exception:
        return None


def _pad_batch(encoded_batch: list[Any]) -> dict[str, Any] | None:
    if np is None or not encoded_batch:
        return None

    max_length = max(len(encoded.ids) for encoded in encoded_batch)
    input_ids: list[list[int]] = []
    attention_mask: list[list[int]] = []
    token_type_ids: list[list[int]] = []

    for encoded in encoded_batch:
        pad_length = max_length - len(encoded.ids)
        input_ids.append(encoded.ids + [0] * pad_length)
        attention_mask.append(encoded.attention_mask + [0] * pad_length)
        token_type_ids.append(encoded.type_ids + [0] * pad_length)

    return {
        "input_ids": np.asarray(input_ids, dtype=np.int64),
        "attention_mask": np.asarray(attention_mask, dtype=np.int64),
        "token_type_ids": np.asarray(token_type_ids, dtype=np.int64),
    }


def _mean_pool(last_hidden_state: Any, attention_mask: Any) -> Any:
    mask = attention_mask[..., None].astype(np.float32)
    summed = (last_hidden_state * mask).sum(axis=1)
    counts = np.clip(mask.sum(axis=1), a_min=1e-9, a_max=None)
    pooled = summed / counts
    norms = np.linalg.norm(pooled, axis=1, keepdims=True)
    return pooled / np.clip(norms, a_min=1e-9, a_max=None)


def build_query_embedding(query: str) -> Any | None:
    components = load_embedding_components()
    if components is None or np is None:
        return None

    tokenizer, session = components
    try:
        encoded_batch = tokenizer.encode_batch([query])
        padded_batch = _pad_batch(encoded_batch)
        if padded_batch is None:
            return None

        input_names = {model_input.name for model_input in session.get_inputs()}
        feed = {name: value for name, value in padded_batch.items() if name in input_names}
        outputs = session.run(None, feed)
        return _mean_pool(outputs[0], padded_batch["attention_mask"])[0].astype(np.float32)
    except Exception:
        return None


def preload_semantic_runtime() -> None:
    load_retriever_artifact()
    if get_semantic_enabled():
        load_embeddings()
        load_embedding_components()


def predict_answer(query: str) -> tuple[str, float]:
    artifact = load_retriever_artifact()
    if not artifact:
        return FALLBACK_ANSWER, 0.0

    token_to_id = artifact.get("token_to_id", {})
    idf = artifact.get("idf", {})
    documents = artifact.get("documents", [])
    hybrid_weights = artifact.get("hybrid_weights", {})
    tfidf_weight = get_lexical_weight() if get_semantic_enabled() else float(hybrid_weights.get("tfidf", DEFAULT_TFIDF_WEIGHT))
    embedding_weight = get_semantic_weight() if get_semantic_enabled() else float(hybrid_weights.get("embedding", DEFAULT_EMBEDDING_WEIGHT))

    query_vector = vectorize_text(query, token_to_id, idf)
    document_embeddings = load_embeddings() if get_semantic_enabled() else None
    query_embedding = build_query_embedding(query) if document_embeddings is not None else None
    if not documents or (not query_vector and query_embedding is None):
        return FALLBACK_ANSWER, 0.0

    best_answer = FALLBACK_ANSWER
    best_score = 0.0

    for document in documents:
        tfidf_score = cosine_similarity(query_vector, document.get("vector", {})) if query_vector else 0.0
        embedding_index = document.get("embedding_index")
        document_embedding = document_embeddings[embedding_index] if document_embeddings is not None and embedding_index is not None else None
        embedding_score = dense_cosine_similarity(query_embedding, document_embedding)

        if query_embedding is None:
            score = tfidf_score
        elif query_vector:
            score = (tfidf_score * tfidf_weight) + (embedding_score * embedding_weight)
        else:
            score = embedding_score

        if score > best_score:
            best_score = score
            best_answer = document.get("target_text", FALLBACK_ANSWER)

    confidence_threshold = get_confidence_threshold() if get_semantic_enabled() else MIN_MATCH_SCORE
    if best_score < confidence_threshold:
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
