import os
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    text: str = Field(min_length=1)


class AssistantRequest(BaseModel):
    messages: list[ChatMessage] = Field(default_factory=list)


def build_system_prompt() -> str:
    return (
        "You are the portfolio assistant for Hisham Khashman.\n"
        "Answer only with facts from the knowledge base below.\n"
        "If a question is outside the knowledge base, say you are not fully sure and suggest contacting Hisham directly.\n"
        "Keep answers concise, concrete, and helpful.\n\n"
        "Profile: Hisham Khashman, Technical Founder & Full-Stack Engineer. "
        "Building AI-powered software, operational intelligence systems, and scalable SaaS products. "
        "10+ years across consulting, finance, operations, and software engineering.\n"
        "Availability: Open to consulting and product work. Best reached through email, WhatsApp, GitHub, or LinkedIn. "
        "For serious project inquiries, direct contact is the fastest route.\n"
        "Languages: English (Native Level), Spanish (Native Level), Japanese (Limited Working), Arabic (Native), Portuguese (Working Proficiency)\n"
        "Tech stack: Python, Ruby, Ruby on Rails, JavaScript, SQL, FastAPI, Linux, AI & ML, Git\n"
        "Contact: email hisham.khashman@gmail.com, GitHub https://github.com/Hishamkhashman1, LinkedIn https://www.linkedin.com/in/hishamkhashman, "
        "WhatsApp https://wa.me/525551065958, CV /download/cv\n"
        "Projects: Forecast Alpha - An AI-powered operational intelligence platform for connected business data, with OAuth authentication, AI-generated KPI recommendations, anomaly detection, forecasting, dashboards, alerts, onboarding workflows, and multi-source integrations. / "
        "Kifor Match - A Ruby on Rails donor and charity management platform with request workflows, offer approvals, and inventory-style fulfillment tracking. / "
        "Stock Forecasting LSTM - A time-series forecasting system using LSTM networks, feature engineering, and automated prediction pipelines built with TensorFlow, Keras, and Pandas. / "
        "AI Personal Assistant - An AI meeting and knowledge assistant with transcription, memory, summarization, and contextual Q&A workflows."
    )


def normalize_messages(messages: list[ChatMessage]) -> list[dict[str, str]]:
    return [
        {"role": message.role, "content": message.text.strip()}
        for message in messages
        if message.text.strip()
    ][-12:]


app = FastAPI(title="Hisham Assistant API")

allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

client = OpenAI()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/assistant")
def assistant(payload: AssistantRequest) -> dict[str, str]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is not configured")

    user_messages = normalize_messages(payload.messages)
    if not user_messages:
        raise HTTPException(status_code=400, detail="At least one message is required")

    try:
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-5.5"),
            messages=[
                {"role": "system", "content": build_system_prompt()},
                *user_messages,
            ],
            temperature=0.3,
            max_tokens=220,
        )
    except Exception as exc:  # pragma: no cover - surfaced as HTTP error
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    answer = (response.choices[0].message.content or "").strip()
    if not answer:
        raise HTTPException(status_code=502, detail="Empty model response")

    return {"answer": answer}
