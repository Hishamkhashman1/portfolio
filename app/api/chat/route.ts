import { NextResponse } from "next/server";

const LOCAL_BACKEND_CHAT_URL = "http://127.0.0.1:8000/chat";
const BACKEND_CHAT_URL =
  process.env.ASSISTANT_BACKEND_URL ||
  (process.env.NODE_ENV === "development" ? LOCAL_BACKEND_CHAT_URL : "");

export async function POST(request: Request) {
  try {
    if (!BACKEND_CHAT_URL) {
      return NextResponse.json(
        { answer: "Assistant backend is not configured yet." },
        { status: 503 }
      );
    }

    const payload = await request.json();
    const response = await fetch(BACKEND_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    });

    const contentType = response.headers.get("content-type") || "application/json";
    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store"
      }
    });
  } catch {
    return NextResponse.json(
      { answer: "I'm having trouble reaching my backend right now." },
      { status: 502 }
    );
  }
}
