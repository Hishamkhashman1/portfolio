from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from app.config import get_allowed_origins, get_service_name
    from app.schemas import ChatRequest, ChatResponse, HealthResponse
    from model.portfolio_llm import answer_from_messages, preload_semantic_runtime
except ModuleNotFoundError:  # pragma: no cover - repo-root execution
    from backend.app.config import get_allowed_origins, get_service_name
    from backend.app.schemas import ChatRequest, ChatResponse, HealthResponse
    from backend.model.portfolio_llm import answer_from_messages, preload_semantic_runtime

app = FastAPI(title="Hisham AI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def preload_assistant_runtime():
    preload_semantic_runtime()


@app.get("/")
def root_status():
    return {"status": "ok", "service": get_service_name()}

@app.get("/health")
def health_status():
    return HealthResponse(status="ok")

@app.post("/chat")
def chat_manage(payload: ChatRequest):
    answer = answer_from_messages(payload.messages)
    return ChatResponse(answer=answer)
