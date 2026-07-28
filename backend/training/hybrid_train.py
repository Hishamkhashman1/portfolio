from __future__ import annotations

import json
import math
import random
import sys
from collections import Counter, defaultdict
from functools import lru_cache
from pathlib import Path
from typing import Any


if __package__ is None or __package__ == "":
    project_root = Path(__file__).resolve().parents[2]
    if str(project_root) not in sys.path:
        sys.path.insert(0, str(project_root))


try:
    from model.tokenizer import build_vocab, normalize_text
    from training.dataset import build_for_training, cleaning_data, conversations_data
except ModuleNotFoundError:  # pragma: no cover - repo-root execution
    from backend.model.tokenizer import build_vocab, normalize_text
    from backend.training.dataset import build_for_training, cleaning_data, conversations_data

try:
    from sentence_transformers import SentenceTransformer
except ImportError:  # pragma: no cover - optional until installed
    SentenceTransformer = None  # type: ignore[assignment]


ARTIFACT_PATH = Path(__file__).resolve().parents[1] / "model" / "artifacts" / "portfolio_retriever.json"
VALIDATION_RATIO = 0.2
RANDOM_SEED = 42
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
TFIDF_WEIGHT = 0.45
EMBEDDING_WEIGHT = 0.55


def split_samples(
    samples: list[dict[str, str]],
    validation_ratio: float = VALIDATION_RATIO,
) -> tuple[list[dict[str, str]], list[dict[str, str]]]:
    if not samples:
        return [], []

    shuffled = samples.copy()
    random.Random(RANDOM_SEED).shuffle(shuffled)

    if len(shuffled) == 1:
        return shuffled, []

    validation_size = max(1, int(len(shuffled) * validation_ratio))
    validation_size = min(validation_size, len(shuffled) - 1)
    return shuffled[:-validation_size], shuffled[-validation_size:]


def build_document_frequency(samples: list[dict[str, str]]) -> dict[str, int]:
    document_frequency: dict[str, int] = defaultdict(int)

    for sample in samples:
        for token in set(normalize_text(sample["input_text"])):
            document_frequency[token] += 1

    return dict(document_frequency)


def build_idf(
    token_to_id: dict[str, int],
    document_frequency: dict[str, int],
    document_count: int,
) -> dict[str, float]:
    idf: dict[str, float] = {}

    for token in token_to_id:
        if token == "<unk>":
            continue

        df = document_frequency.get(token, 0)
        idf[token] = math.log((1 + document_count) / (1 + df)) + 1.0

    return idf


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


def sparse_cosine_similarity(left: dict[str, float], right: dict[str, float]) -> float:
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

    try:
        return SentenceTransformer(EMBEDDING_MODEL_NAME)
    except Exception:
        return None


def build_embeddings(texts: list[str]) -> list[list[float]] | None:
    if not texts:
        return []

    model = load_embedding_model()
    if model is None:
        return None

    encoded = model.encode(
        texts,
        normalize_embeddings=True,
        show_progress_bar=False,
    )
    return encoded.tolist()


def build_training_documents(
    samples: list[dict[str, str]],
    token_to_id: dict[str, int],
    idf: dict[str, float],
    embeddings: list[list[float]] | None = None,
) -> list[dict[str, Any]]:
    documents: list[dict[str, Any]] = []

    for index, sample in enumerate(samples):
        documents.append(
            {
                "id": index,
                "input_text": sample["input_text"],
                "target_text": sample["target_text"],
                "vector": vectorize_text(sample["input_text"], token_to_id, idf),
                "embedding": embeddings[index] if embeddings is not None else None,
            }
        )

    return documents


def predict_answer(
    query: str,
    documents: list[dict[str, Any]],
    token_to_id: dict[str, int],
    idf: dict[str, float],
    query_embedding: list[float] | None = None,
    tfidf_weight: float = TFIDF_WEIGHT,
    embedding_weight: float = EMBEDDING_WEIGHT,
) -> tuple[str, float]:
    if not documents:
        return "", 0.0

    query_vector = vectorize_text(query, token_to_id, idf)
    best_answer = ""
    best_score = 0.0

    for document in documents:
        tfidf_score = sparse_cosine_similarity(query_vector, document.get("vector", {})) if query_vector else 0.0
        embedding_score = dense_cosine_similarity(query_embedding, document.get("embedding"))

        if query_embedding is None:
            score = tfidf_score
        elif query_vector:
            score = (tfidf_score * tfidf_weight) + (embedding_score * embedding_weight)
        else:
            score = embedding_score

        if score > best_score:
            best_score = score
            best_answer = document["target_text"]

    return best_answer, best_score


def evaluate(
    validation_samples: list[dict[str, str]],
    documents: list[dict[str, Any]],
    token_to_id: dict[str, int],
    idf: dict[str, float],
    validation_embeddings: list[list[float]] | None = None,
) -> dict[str, float]:
    if not validation_samples:
        return {"accuracy": 0.0, "average_score": 0.0}

    correct = 0
    total_score = 0.0

    for index, sample in enumerate(validation_samples):
        query_embedding = validation_embeddings[index] if validation_embeddings is not None else None
        predicted_answer, score = predict_answer(
            sample["input_text"],
            documents,
            token_to_id,
            idf,
            query_embedding=query_embedding,
        )
        total_score += score
        if predicted_answer == sample["target_text"]:
            correct += 1

    return {
        "accuracy": correct / len(validation_samples),
        "average_score": total_score / len(validation_samples),
    }


def save_artifact(
    artifact_path: Path,
    token_to_id: dict[str, int],
    idf: dict[str, float],
    documents: list[dict[str, Any]],
    validation_metrics: dict[str, float],
    train_size: int,
    validation_size: int,
) -> None:
    artifact_path.parent.mkdir(parents=True, exist_ok=True)

    payload = {
        "model_type": "hybrid_retriever",
        "created_at": "2026-07-28T00:00:00Z",
        "train_size": train_size,
        "validation_size": validation_size,
        "validation_metrics": validation_metrics,
        "embedding_model": EMBEDDING_MODEL_NAME if any(document.get("embedding") for document in documents) else None,
        "hybrid_weights": {
            "tfidf": TFIDF_WEIGHT,
            "embedding": EMBEDDING_WEIGHT,
        },
        "token_to_id": token_to_id,
        "idf": idf,
        "documents": documents,
    }

    with artifact_path.open("w", encoding="utf-8") as file:
        json.dump(payload, file, indent=2, ensure_ascii=False)


def train() -> dict[str, Any]:
    samples = build_for_training(conversations_data)
    train_samples, validation_samples = split_samples(samples)

    cleaned_lookup = cleaning_data(conversations_data)
    token_to_id = build_vocab(cleaned_lookup)

    train_document_frequency = build_document_frequency(train_samples)
    train_idf = build_idf(token_to_id, train_document_frequency, len(train_samples))
    train_embeddings = build_embeddings([sample["input_text"] for sample in train_samples])
    validation_embeddings = build_embeddings([sample["input_text"] for sample in validation_samples])
    train_documents = build_training_documents(train_samples, token_to_id, train_idf, train_embeddings)
    validation_metrics = evaluate(
        validation_samples,
        train_documents,
        token_to_id,
        train_idf,
        validation_embeddings=validation_embeddings,
    )

    full_document_frequency = build_document_frequency(samples)
    full_idf = build_idf(token_to_id, full_document_frequency, len(samples))
    full_embeddings = build_embeddings([sample["input_text"] for sample in samples])
    full_documents = build_training_documents(samples, token_to_id, full_idf, full_embeddings)

    save_artifact(
        ARTIFACT_PATH,
        token_to_id,
        full_idf,
        full_documents,
        validation_metrics,
        len(samples),
        len(validation_samples),
    )

    return {
        "artifact_path": str(ARTIFACT_PATH),
        "sample_count": len(samples),
        "train_count": len(train_samples),
        "validation_count": len(validation_samples),
        "validation_metrics": validation_metrics,
        "model_type": "hybrid_retriever",
        "embedding_model": EMBEDDING_MODEL_NAME if full_embeddings is not None else None,
    }
