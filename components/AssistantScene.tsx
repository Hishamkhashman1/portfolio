"use client";

import { useEffect, useRef, useState } from "react";
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
  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const isConversationStarted = messages.some((message) => message.role === "user");

  useEffect(() => {
    if (!transcriptRef.current) {
      return;
    }

    transcriptRef.current.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth"
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
    <main className="relative min-h-[100dvh] overflow-hidden bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-6 text-zinc-950 sm:min-h-screen sm:px-6 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100dvh-1.5rem-env(safe-area-inset-bottom))] w-full max-w-3xl flex-col justify-between gap-6 sm:min-h-[calc(100vh-3rem)] sm:justify-center sm:gap-10">
        <div className="flex w-full flex-1 items-center justify-center">
          <AssistantTranscript
            ref={transcriptRef}
            messages={messages}
            isPending={isSending}
            isConversationStarted={isConversationStarted}
          />
        </div>
        <div className="sticky bottom-0 w-full bg-white/95 pb-[env(safe-area-inset-bottom)] pt-3 backdrop-blur-sm sm:static sm:bg-transparent sm:pb-0 sm:pt-0 sm:backdrop-blur-0">
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
