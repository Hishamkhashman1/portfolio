from typing import Literal
from datetime import datetime
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: Literal["user", "assistant","system"]
    content: str = Field(min_length=1)

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    request_time: datetime

class ChatResponse(BaseModel):
    answer: str 

class HealthResponse(BaseModel):
    status: str
