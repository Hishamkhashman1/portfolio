"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import AssistantTranscript from "@/components/AssistantTranscript";
import AssistantComposer from "@/components/AssistantComposer";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

export default function AssistantScene() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi, I am Hisham" },
    { role: "assistant", content: "ask me anything" }
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const transcriptScrollRef = useRef<HTMLDivElement | null>(null);
  const isConversationStarted = messages.some((message) => message.role === "user");

  useEffect(() => {
    const currentViewport = window.visualViewport;
    if (!currentViewport) {
      return;
    }
    const visualViewport: VisualViewport = currentViewport;

    function updateKeyboardOffset() {
      const offset = Math.max(0, window.innerHeight - visualViewport.height - visualViewport.offsetTop);
      setKeyboardOffset(offset);
    }

    updateKeyboardOffset();
    visualViewport.addEventListener("resize", updateKeyboardOffset);
    visualViewport.addEventListener("scroll", updateKeyboardOffset);
    window.addEventListener("orientationchange", updateKeyboardOffset);

    return () => {
      visualViewport.removeEventListener("resize", updateKeyboardOffset);
      visualViewport.removeEventListener("scroll", updateKeyboardOffset);
      window.removeEventListener("orientationchange", updateKeyboardOffset);
    };
  }, []);

  useEffect(() => {
    if (!transcriptScrollRef.current) {
      return;
    }

    const scrollElement = transcriptScrollRef.current;
    requestAnimationFrame(() => {
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: "smooth"
      });
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
      });
    });
  }, [messages, isSending]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isSending) {
      return;
    }

    const nextMessages = [...messages, { role: "user", content: trimmed }] as ChatMessage[];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: nextMessages.slice(-12),
          request_time: new Date().toISOString()
        })
      });

      const data = (await response.json()) as { answer?: string };

      if (!response.ok) {
        throw new Error(data.answer || "Assistant request failed");
      }

      const answer = data.answer?.trim() || "I'm still learning that part of Hisham's portfolio.";
      setMessages((current) => [...current, { role: "assistant", content: answer }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I'm having trouble reaching my backend right now."
        }
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main
      className="relative h-[100dvh] overflow-y-auto bg-white px-4 pt-6 text-zinc-950 sm:px-6 sm:py-6"
      style={{ "--keyboard-offset": `${keyboardOffset}px` } as CSSProperties}
    >
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center gap-6 sm:gap-10">
        <div
          ref={transcriptScrollRef}
          className={`flex min-h-0 w-full flex-1 touch-pan-y overflow-y-auto overscroll-contain pb-40 pt-3 sm:pb-6 sm:pt-0 ${
            isConversationStarted ? "items-start justify-center" : "items-center justify-center"
          }`}
        >
          <AssistantTranscript
            messages={messages}
            isPending={isSending}
            isConversationStarted={isConversationStarted}
          />
        </div>
        <div className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+var(--keyboard-offset)+0.75rem)] z-10 mx-auto w-auto max-w-2xl bg-white/95 backdrop-blur-sm transition-[bottom] duration-150 sm:static sm:w-full sm:max-w-none sm:bg-transparent sm:pb-0 sm:pt-0 sm:backdrop-blur-0 sm:transition-none">
          <AssistantComposer
            value={input}
            onChange={setInput}
            onSubmit={sendMessage}
            isPending={isSending}
          />
        </div>
      </div>
    </main>
  );
}
