from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path


DEFAULT_CORS_ORIGINS = (
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://hishamkhashman.dev",
)
DEFAULT_MODEL_ROOT = Path(__file__).resolve().parents[1] / "model"
DEFAULT_ARTIFACT_ROOT = DEFAULT_MODEL_ROOT / "artifacts"
DEFAULT_ONNX_MODEL_PATH = DEFAULT_MODEL_ROOT / "onnx" / "all-minilm" / "model.onnx"
DEFAULT_EMBEDDINGS_PATH = DEFAULT_ARTIFACT_ROOT / "portfolio_embeddings.npz"


def _split_csv(value: str | None) -> list[str]:
    if not value:
        return []

    return [item.strip() for item in value.split(",") if item.strip()]


def _bool_env(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default

    return value.strip().lower() in {"1", "true", "yes", "on"}


def _float_env(name: str, default: float) -> float:
    value = os.getenv(name)
    if value is None:
        return default

    try:
        return float(value)
    except ValueError:
        return default


def _int_env(name: str, default: int) -> int:
    value = os.getenv(name)
    if value is None:
        return default

    try:
        return int(value)
    except ValueError:
        return default


@lru_cache(maxsize=1)
def get_allowed_origins() -> list[str]:
    origins = _split_csv(os.getenv("ASSISTANT_CORS_ORIGINS"))
    return origins or list(DEFAULT_CORS_ORIGINS)


@lru_cache(maxsize=1)
def get_service_name() -> str:
    return os.getenv("ASSISTANT_SERVICE_NAME", "hisham-ai-backend")


@lru_cache(maxsize=1)
def get_semantic_enabled() -> bool:
    return _bool_env("ASSISTANT_SEMANTIC_ENABLED", default=True)


@lru_cache(maxsize=1)
def get_lexical_weight() -> float:
    return _float_env("ASSISTANT_LEXICAL_WEIGHT", 0.45)


@lru_cache(maxsize=1)
def get_semantic_weight() -> float:
    return _float_env("ASSISTANT_SEMANTIC_WEIGHT", 0.55)


@lru_cache(maxsize=1)
def get_confidence_threshold() -> float:
    return _float_env("ASSISTANT_CONFIDENCE_THRESHOLD", 0.18)


@lru_cache(maxsize=1)
def get_onnx_model_path() -> Path:
    return Path(os.getenv("ASSISTANT_ONNX_MODEL_PATH", str(DEFAULT_ONNX_MODEL_PATH)))


@lru_cache(maxsize=1)
def get_embeddings_path() -> Path:
    return Path(os.getenv("ASSISTANT_EMBEDDINGS_PATH", str(DEFAULT_EMBEDDINGS_PATH)))


@lru_cache(maxsize=1)
def get_max_query_length() -> int:
    return max(1, _int_env("ASSISTANT_MAX_QUERY_LENGTH", 128))
