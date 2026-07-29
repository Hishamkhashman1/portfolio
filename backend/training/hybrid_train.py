from __future__ import annotations

import json
import math
import random
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


if __package__ is None or __package__ == "":
    project_root = Path(__file__).resolve().parents[2]
    if str(project_root) not in sys.path:
        sys.path.insert(0, str(project_root))


try:
    from app.config import get_embeddings_path, get_max_query_length, get_onnx_model_path
    from model.tokenizer import build_vocab, normalize_text
    from training.dataset import build_for_training, cleaning_data, conversations_data
except ModuleNotFoundError:  # pragma: no cover - repo-root execution
    from backend.app.config import get_embeddings_path, get_max_query_length, get_onnx_model_path
    from backend.model.tokenizer import build_vocab, normalize_text
    from backend.training.dataset import build_for_training, cleaning_data, conversations_data

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


ARTIFACT_PATH = Path(__file__).resolve().parents[1] / "model" / "artifacts" / "portfolio_retriever.json"
VALIDATION_RATIO = 0.2
RANDOM_SEED = 42
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2-onnx"
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


def dense_cosine_similarity(left: Any | None, right: Any | None) -> float:
    if left is None or right is None or len(left) != len(right):
        return 0.0

    return float(sum(left_value * right_value for left_value, right_value in zip(left, right)))


def _tokenizer_path_for_model(model_path: Path) -> Path:
    return model_path.parent / "tokenizer.json"


def load_embedding_components() -> tuple[Any, Any] | None:
    if np is None or ort is None or Tokenizer is None:
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


def build_embeddings(texts: list[str]) -> Any | None:
    if not texts:
        return np.empty((0, 0), dtype=np.float32) if np is not None else []

    components = load_embedding_components()
    if components is None or np is None:
        return None

    tokenizer, session = components
    try:
        encoded_batch = tokenizer.encode_batch(texts)
        padded_batch = _pad_batch(encoded_batch)
        if padded_batch is None:
            return None

        input_names = {model_input.name for model_input in session.get_inputs()}
        feed = {name: value for name, value in padded_batch.items() if name in input_names}
        outputs = session.run(None, feed)
        return _mean_pool(outputs[0], padded_batch["attention_mask"]).astype(np.float32)
    except Exception:
        return None


def build_training_documents(
    samples: list[dict[str, str]],
    token_to_id: dict[str, int],
    idf: dict[str, float],
    embeddings: Any | None = None,
) -> list[dict[str, Any]]:
    documents: list[dict[str, Any]] = []

    for index, sample in enumerate(samples):
        documents.append(
            {
                "id": index,
                "input_text": sample["input_text"],
                "target_text": sample["target_text"],
                "vector": vectorize_text(sample["input_text"], token_to_id, idf),
                "embedding_index": index if embeddings is not None else None,
            }
        )

    return documents


def predict_answer(
    query: str,
    documents: list[dict[str, Any]],
    token_to_id: dict[str, int],
    idf: dict[str, float],
    query_embedding: Any | None = None,
    document_embeddings: Any | None = None,
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
            best_answer = document["target_text"]

    return best_answer, best_score


def evaluate(
    validation_samples: list[dict[str, str]],
    documents: list[dict[str, Any]],
    token_to_id: dict[str, int],
    idf: dict[str, float],
    validation_embeddings: Any | None = None,
    document_embeddings: Any | None = None,
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
            document_embeddings=document_embeddings,
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
    embeddings_path: Path | None = None,
    embedding_dimension: int | None = None,
) -> None:
    artifact_path.parent.mkdir(parents=True, exist_ok=True)

    payload = {
        "model_type": "hybrid_retriever",
        "created_at": "2026-07-28T00:00:00Z",
        "train_size": train_size,
        "validation_size": validation_size,
        "validation_metrics": validation_metrics,
        "embedding_model": EMBEDDING_MODEL_NAME if embeddings_path is not None else None,
        "embedding_dimension": embedding_dimension,
        "embeddings_path": str(embeddings_path) if embeddings_path is not None else None,
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


def save_embeddings(embeddings_path: Path, embeddings: Any | None) -> Path | None:
    if np is None or embeddings is None:
        return None

    embeddings_path.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(embeddings_path, embeddings=embeddings.astype(np.float32))
    return embeddings_path


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
        document_embeddings=train_embeddings,
    )

    full_document_frequency = build_document_frequency(samples)
    full_idf = build_idf(token_to_id, full_document_frequency, len(samples))
    full_embeddings = build_embeddings([sample["input_text"] for sample in samples])
    full_documents = build_training_documents(samples, token_to_id, full_idf, full_embeddings)
    saved_embeddings_path = save_embeddings(get_embeddings_path(), full_embeddings)
    embedding_dimension = int(full_embeddings.shape[1]) if full_embeddings is not None and getattr(full_embeddings, "ndim", 0) == 2 and full_embeddings.shape[0] else None

    save_artifact(
        ARTIFACT_PATH,
        token_to_id,
        full_idf,
        full_documents,
        validation_metrics,
        len(samples),
        len(validation_samples),
        embeddings_path=saved_embeddings_path,
        embedding_dimension=embedding_dimension,
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
