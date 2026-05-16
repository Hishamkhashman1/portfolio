"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X } from "lucide-react";
import { assistantKnowledge } from "@/src/data/assistantKnowledge";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

function normalizeText(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreIntent(query: string, intent: { keywords: string[]; answer: string }) {
  const normalizedQuery = normalizeText(query);
  let score = 0;

  for (const keyword of intent.keywords) {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) continue;

    if (normalizedQuery.includes(normalizedKeyword)) {
      score += normalizedKeyword.length >= 8 ? 4 : 3;
    } else {
      const queryTokens = normalizedQuery.split(" ");
      const keywordTokens = normalizedKeyword.split(" ");
      const overlap = keywordTokens.filter((token) => queryTokens.includes(token)).length;
      score += overlap;
    }
  }

  return score;
}

function matchAnswer(query: string) {
  const directIntent = assistantKnowledge.intents
    .map((intent) => ({ intent, score: scoreIntent(query, intent) }))
    .sort((a, b) => b.score - a.score)[0];

  if (!directIntent || directIntent.score < 2) {
    return assistantKnowledge.fallback;
  }

  return directIntent.intent.answer;
}

export default function AskHishamAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: `Ask me about Hisham's experience, projects, tech stack, languages, or contact options.`
    }
  ]);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function sendQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;

    const answer = matchAnswer(trimmed);

    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "assistant", text: answer }
    ]);
    setInput("");
  }

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      style={{
        position: "fixed",
        right: "16px",
        bottom: "16px",
        zIndex: 50
      }}
      className="relative sm:right-[24px] sm:bottom-[24px]"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 shadow-[0_10px_30px_-18px_rgba(15,17,21,0.35)] transition hover:border-zinc-300 hover:bg-zinc-50"
        aria-expanded={open}
        aria-controls="ask-hisham-panel"
      >
        <MessageCircle className="h-4 w-4 text-zinc-700" />
        Ask Hisham
      </button>

      <div
        id="ask-hisham-panel"
        className={`absolute bottom-[calc(100%+12px)] right-0 w-[min(92vw,380px)] overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-[0_20px_60px_-30px_rgba(15,17,21,0.35)] transition-all duration-300 ease-out ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 scale-[0.98] opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
            Ask Hisham
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-950"
            aria-label="Close assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          ref={listRef}
          className="max-h-72 space-y-3 overflow-y-auto px-4 py-4"
        >
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-zinc-950 text-white"
                    : "border border-zinc-200 bg-zinc-50 text-zinc-800"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-100 px-4 pb-4 pt-3">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendQuestion(input);
            }}
            className="space-y-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about experience, projects, or contact..."
              className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400"
            />
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
