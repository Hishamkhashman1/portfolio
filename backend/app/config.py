from __future__ import annotations

import os
from functools import lru_cache


DEFAULT_CORS_ORIGINS = (
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://hishamkhashman.dev",
)


def _split_csv(value: str | None) -> list[str]:
    if not value:
        return []

    return [item.strip() for item in value.split(",") if item.strip()]


@lru_cache(maxsize=1)
def get_allowed_origins() -> list[str]:
    origins = _split_csv(os.getenv("ASSISTANT_CORS_ORIGINS"))
    return origins or list(DEFAULT_CORS_ORIGINS)


@lru_cache(maxsize=1)
def get_service_name() -> str:
    return os.getenv("ASSISTANT_SERVICE_NAME", "hisham-ai-backend")
