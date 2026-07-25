from fastapi import FastAPI
from schemas import HealthResponse, ChatRequest, ChatResponse

app = FastAPI()

@app.get("/health")
def health_status():
    return HealthResponse(status="ok")

@app.post("/chat")
def chat_manage(payload: ChatRequest):
    return ChatResponse(answer="placeholder")








