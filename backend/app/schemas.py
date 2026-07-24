class ChatMessage:
    role: str
    content: str

class ChatRequest:
    message: list[ChatMessage]

class ChatResponse:
    answer: str

class HealthResponse:
    status: str
