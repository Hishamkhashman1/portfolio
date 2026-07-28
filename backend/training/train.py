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


from backend.model.tokenizer import build_vocab, normalize_text
from backend.training.dataset import build_for_training, cleaning_data, conversations_data


ARTIFACT_PATH = Path(__file__).resolve().parents[1] / "model" / "artifacts" / "portfolio_retriever.json"
VALIDATION_RATIO = 0.2
RANDOM_SEED = 42


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
        tokens = set(normalize_text(sample["input_text"]))
        for token in tokens:
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


def cosine_similarity(left: dict[str, float], right: dict[str, float]) -> float:
    if not left or not right:
        return 0.0

    if len(left) > len(right):
        left, right = right, left

    return sum(weight * right.get(token, 0.0) for token, weight in left.items())


def build_training_documents(
    samples: list[dict[str, str]],
    token_to_id: dict[str, int],
    idf: dict[str, float],
) -> list[dict[str, Any]]:
    documents: list[dict[str, Any]] = []

    for index, sample in enumerate(samples):
        documents.append(
            {
                "id": index,
                "input_text": sample["input_text"],
                "target_text": sample["target_text"],
                "vector": vectorize_text(sample["input_text"], token_to_id, idf),
            }
        )

    return documents


def predict_answer(
    query: str,
    documents: list[dict[str, Any]],
    token_to_id: dict[str, int],
    idf: dict[str, float],
) -> tuple[str, float]:
    query_vector = vectorize_text(query, token_to_id, idf)
    if not query_vector or not documents:
        return "", 0.0

    best_answer = ""
    best_score = 0.0

    for document in documents:
        score = cosine_similarity(query_vector, document["vector"])
        if score > best_score:
            best_score = score
            best_answer = document["target_text"]

    return best_answer, best_score


def evaluate(
    validation_samples: list[dict[str, str]],
    documents: list[dict[str, Any]],
    token_to_id: dict[str, int],
    idf: dict[str, float],
) -> dict[str, float]:
    if not validation_samples:
        return {"accuracy": 0.0, "average_score": 0.0}

    correct = 0
    total_score = 0.0

    for sample in validation_samples:
        predicted_answer, score = predict_answer(sample["input_text"], documents, token_to_id, idf)
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
    train_documents: list[dict[str, Any]],
    validation_metrics: dict[str, float],
    train_size: int,
    validation_size: int,
) -> None:
    artifact_path.parent.mkdir(parents=True, exist_ok=True)

    payload = {
        "model_type": "tfidf_retriever",
        "created_at": "2026-07-28T00:00:00Z",
        "train_size": train_size,
        "validation_size": validation_size,
        "validation_metrics": validation_metrics,
        "token_to_id": token_to_id,
        "idf": idf,
        "documents": train_documents,
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
    train_documents = build_training_documents(train_samples, token_to_id, train_idf)
    validation_metrics = evaluate(validation_samples, train_documents, token_to_id, train_idf)

    full_document_frequency = build_document_frequency(samples)
    full_idf = build_idf(token_to_id, full_document_frequency, len(samples))
    full_documents = build_training_documents(samples, token_to_id, full_idf)

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
        "train_count": len(samples),
        "validation_count": len(validation_samples),
        "validation_metrics": validation_metrics,
        "model_type": "tfidf_retriever",
    }


ARTIFACT_PATH = Path(__file__).resolve().parents[1] / "model" / "artifacts" / "portfolio_classifier.json"
SMOOTHING = 1.0


def build_vocab_from_samples(samples: list[dict[str, str]]) -> dict[str, int]:
    token_to_id = {"<unk>": 0}

    for sample in samples:
        for token in normalize_text(sample["input_text"]):
            if token not in token_to_id:
                token_to_id[token] = len(token_to_id)

    return token_to_id


def train_classifier(
    samples: list[dict[str, str]],
    token_to_id: dict[str, int],
    smoothing: float = SMOOTHING,
) -> dict[str, Any]:
    class_document_counts: dict[str, int] = defaultdict(int)
    class_token_counts: dict[str, Counter[str]] = defaultdict(Counter)
    class_total_tokens: dict[str, int] = defaultdict(int)
    class_order: list[str] = []

    for sample in samples:
        answer = sample["target_text"]
        if answer not in class_document_counts:
            class_order.append(answer)

        class_document_counts[answer] += 1

        tokens = [token for token in normalize_text(sample["input_text"]) if token in token_to_id and token != "<unk>"]
        class_token_counts[answer].update(tokens)
        class_total_tokens[answer] += len(tokens)

    total_documents = len(samples)
    default_answer = max(class_document_counts.items(), key=lambda item: item[1])[0] if class_document_counts else ""

    classes: dict[str, dict[str, Any]] = {}
    for answer in class_order:
        classes[answer] = {
            "document_count": class_document_counts[answer],
            "total_tokens": class_total_tokens[answer],
            "token_counts": dict(class_token_counts[answer]),
        }

    return {
        "model_type": "multinomial_naive_bayes",
        "alpha": smoothing,
        "token_to_id": token_to_id,
        "vocab_size": len(token_to_id),
        "total_documents": total_documents,
        "default_answer": default_answer,
        "classes": classes,
    }


def predict_answer(query: str, model: dict[str, Any]) -> tuple[str, float]:
    token_to_id = model.get("token_to_id", {})
    classes = model.get("classes", {})
    alpha = float(model.get("alpha", SMOOTHING))
    vocab_size = max(int(model.get("vocab_size", len(token_to_id))), 1)
    total_documents = max(int(model.get("total_documents", 0)), 1)
    default_answer = model.get("default_answer", "")

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

    return best_answer, best_score


def evaluate_classifier(samples: list[dict[str, str]], model: dict[str, Any]) -> dict[str, float]:
    if not samples:
        return {"accuracy": 0.0, "average_score": 0.0}

    correct = 0
    total_score = 0.0

    for sample in samples:
        predicted_answer, score = predict_answer(sample["input_text"], model)
        total_score += score if score != float("-inf") else 0.0
        if predicted_answer == sample["target_text"]:
            correct += 1

    return {
        "accuracy": correct / len(samples),
        "average_score": total_score / len(samples),
    }


def save_classifier_artifact(
    artifact_path: Path,
    model: dict[str, Any],
    validation_metrics: dict[str, float],
    train_size: int,
    validation_size: int,
) -> None:
    artifact_path.parent.mkdir(parents=True, exist_ok=True)

    payload = {
        **model,
        "created_at": "2026-07-28T00:00:00Z",
        "train_size": train_size,
        "validation_size": validation_size,
        "validation_metrics": validation_metrics,
    }

    with artifact_path.open("w", encoding="utf-8") as file:
        json.dump(payload, file, indent=2, ensure_ascii=False)


def train() -> dict[str, Any]:
    samples = build_for_training(conversations_data)
    train_samples, validation_samples = split_samples(samples)
    token_to_id = build_vocab_from_samples(train_samples)
    model = train_classifier(train_samples, token_to_id)
    validation_metrics = evaluate_classifier(validation_samples, model)

    save_classifier_artifact(
        ARTIFACT_PATH,
        model,
        validation_metrics,
        len(train_samples),
        len(validation_samples),
    )

    return {
        "artifact_path": str(ARTIFACT_PATH),
        "sample_count": len(samples),
        "train_count": len(train_samples),
        "validation_count": len(validation_samples),
        "validation_metrics": validation_metrics,
        "model_type": model["model_type"],
    }


def main() -> None:
    summary = train()
    print(f"saved artifact: {summary['artifact_path']}")
    print(
        "samples: "
        f"{summary['sample_count']} | "
        f"train: {summary['train_count']} | "
        f"validation: {summary['validation_count']}"
    )
    print(
        "validation accuracy: "
        f"{summary['validation_metrics']['accuracy']:.3f} | "
        f"average similarity: {summary['validation_metrics']['average_score']:.3f}"
    )


if __name__ == "__main__":
    main()


def predict_answer(
    query: str,
    documents: list[dict[str, Any]],
    token_to_id: dict[str, int],
    idf: dict[str, float],
) -> tuple[str, float]:
    query_vector = vectorize_text(query, token_to_id, idf)
    if not query_vector or not documents:
        return "", 0.0

    best_answer = ""
    best_score = 0.0

    for document in documents:
        score = cosine_similarity(query_vector, document["vector"])
        if score > best_score:
            best_score = score
            best_answer = document["target_text"]

    return best_answer, best_score


ARTIFACT_PATH = Path(__file__).resolve().parents[1] / "model" / "artifacts" / "portfolio_retriever.json"


def train() -> dict[str, Any]:
    samples = build_for_training(conversations_data)
    train_samples, validation_samples = split_samples(samples)

    cleaned_lookup = cleaning_data(conversations_data)
    token_to_id = build_vocab(cleaned_lookup)

    train_document_frequency = build_document_frequency(train_samples)
    train_idf = build_idf(token_to_id, train_document_frequency, len(train_samples))
    train_documents = build_training_documents(train_samples, token_to_id, train_idf)
    validation_metrics = evaluate(validation_samples, train_documents, token_to_id, train_idf)

    full_document_frequency = build_document_frequency(samples)
    full_idf = build_idf(token_to_id, full_document_frequency, len(samples))
    full_documents = build_training_documents(samples, token_to_id, full_idf)

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
        "train_count": len(samples),
        "validation_count": len(validation_samples),
        "validation_metrics": validation_metrics,
        "model_type": "tfidf_retriever",
    }


def main() -> None:
    summary = train()
    print(f"saved artifact: {summary['artifact_path']}")
    print(
        "samples: "
        f"{summary['sample_count']} | "
        f"train: {summary['train_count']} | "
        f"validation: {summary['validation_count']}"
    )
    print(
        "validation accuracy: "
        f"{summary['validation_metrics']['accuracy']:.3f} | "
        f"average similarity: {summary['validation_metrics']['average_score']:.3f}"
    )


if __name__ == "__main__":
    main()
