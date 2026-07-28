from fastapi import FastAPI

from backend.app.schemas import ChatRequest, ChatResponse, HealthResponse
from backend.model.portfolio_llm import answer_from_messages

app = FastAPI()

@app.get("/health")
def health_status():
    return HealthResponse(status="ok")

@app.post("/chat")
def chat_manage(payload: ChatRequest):
    answer = answer_from_messages(payload.messages)
    return ChatResponse(answer=answer)
