from __future__ import annotations

import json
import math
from collections import Counter
from functools import lru_cache
from pathlib import Path
from typing import Any, Sequence

try:
    from model.tokenizer import normalize_text
except ModuleNotFoundError:  # pragma: no cover - repo-root execution
    from backend.model.tokenizer import normalize_text


ARTIFACT_PATH = Path(__file__).resolve().parent / "artifacts" / "portfolio_retriever.json"
FALLBACK_ANSWER = "I'm still learning that part of Hisham's portfolio."
MIN_MATCH_SCORE = 0.18


def latest_user_message(messages: Sequence[Any]) -> str:
    for message in reversed(messages):
        if getattr(message, "role", None) == "user":
            content = getattr(message, "content", "").strip()
            if content:
                return content

    return ""


@lru_cache(maxsize=1)
def load_artifact() -> dict[str, Any]:
    if not ARTIFACT_PATH.exists():
        return {}

    with ARTIFACT_PATH.open("r", encoding="utf-8") as file:
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
    artifact = load_artifact()
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


def answer_from_messages(messages: Sequence[Any]) -> str:
    query = latest_user_message(messages)
    if not query:
        return FALLBACK_ANSWER

    answer, _score = predict_answer(query)
    return answer


ARTIFACT_PATH = Path(__file__).resolve().parent / "artifacts" / "portfolio_retriever.json"
MIN_MATCH_SCORE = 0.18


@lru_cache(maxsize=1)
def load_artifact() -> dict[str, Any]:
    if not ARTIFACT_PATH.exists():
        return {}

    with ARTIFACT_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def predict_answer(query: str) -> tuple[str, float]:
    artifact = load_artifact()
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


def answer_from_messages(messages: Sequence[Any]) -> str:
    query = latest_user_message(messages)
    if not query:
        return FALLBACK_ANSWER

    answer, _score = predict_answer(query)
    return answer


ARTIFACT_PATH = Path(__file__).resolve().parent / "artifacts" / "portfolio_retriever.json"
MIN_MATCH_SCORE = 0.18


@lru_cache(maxsize=1)
def load_artifact() -> dict[str, Any]:
    if not ARTIFACT_PATH.exists():
        return {}

    with ARTIFACT_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def predict_answer(query: str) -> tuple[str, float]:
    artifact = load_artifact()
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


def answer_from_messages(messages: Sequence[Any]) -> str:
    query = latest_user_message(messages)
    if not query:
        return FALLBACK_ANSWER

    answer, _score = predict_answer(query)
    return answer


ARTIFACT_PATH = Path(__file__).resolve().parent / "artifacts" / "portfolio_classifier.json"
MIN_MATCH_SCORE = float("-inf")


@lru_cache(maxsize=1)
def load_artifact() -> dict[str, Any]:
    if not ARTIFACT_PATH.exists():
        return {}

    with ARTIFACT_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def predict_answer(query: str) -> tuple[str, float]:
    artifact = load_artifact()
    if not artifact:
        return FALLBACK_ANSWER, float("-inf")

    token_to_id = artifact.get("token_to_id", {})
    classes = artifact.get("classes", {})
    alpha = float(artifact.get("alpha", 1.0))
    vocab_size = max(int(artifact.get("vocab_size", len(token_to_id))), 1)
    total_documents = max(int(artifact.get("total_documents", 0)), 1)
    default_answer = artifact.get("default_answer", FALLBACK_ANSWER)

    tokens = [token for token in normalize_text(query) if token in token_to_id and token != "<unk>"]
    if not tokens:
        return default_answer, float("-inf")

    query_counts = Counter(tokens)
    best_answer = default_answer
    best_score = float("-inf")

    for answer, stats in classes.items():
        document_count = int(stats.get("document_count", 0))
        total_tokens = int(stats.get("total_tokens", 0))
        token_counts = stats.get("token_counts", {})

        if document_count <= 0:
            continue

        score = math.log(document_count / total_documents)
        denominator = total_tokens + alpha * vocab_size

        for token, count in query_counts.items():
            token_count = int(token_counts.get(token, 0))
            score += count * math.log((token_count + alpha) / denominator)

        if score > best_score:
            best_score = score
            best_answer = answer

    if best_score == float("-inf"):
        return default_answer, best_score

    return best_answer, best_score


def answer_from_messages(messages: Sequence[Any]) -> str:
    query = latest_user_message(messages)
    if not query:
        return FALLBACK_ANSWER

    answer, _score = predict_answer(query)
    return answer


ARTIFACT_PATH = Path(__file__).resolve().parent / "artifacts" / "portfolio_retriever.json"
MIN_MATCH_SCORE = 0.18


@lru_cache(maxsize=1)
def load_artifact() -> dict[str, Any]:
    if not ARTIFACT_PATH.exists():
        return {}

    with ARTIFACT_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def predict_answer(query: str) -> tuple[str, float]:
    artifact = load_artifact()
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


def answer_from_messages(messages: Sequence[Any]) -> str:
    query = latest_user_message(messages)
    if not query:
        return FALLBACK_ANSWER

    answer, _score = predict_answer(query)
    return answer
