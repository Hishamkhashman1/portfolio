"use client";

import { forwardRef, type ReactNode } from "react";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type AssistantTranscriptProps = {
  messages: ChatMessage[];
  isPending: boolean;
  isConversationStarted: boolean;
};

const URL_PATTERN = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

function renderContent(content: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = URL_PATTERN.exec(content)) !== null) {
    const [url] = match;

    if (match.index > lastIndex) {
      nodes.push(content.slice(lastIndex, match.index));
    }

    nodes.push(
      <a
        key={`${url}-${match.index}`}
        href={url.startsWith("http") ? url : `https://${url}`}
        target="_blank"
        rel="noreferrer noopener"
        className="break-all underline decoration-zinc-400 decoration-1 underline-offset-2 transition hover:decoration-zinc-900"
      >
        {url}
      </a>
    );

    lastIndex = match.index + url.length;
  }

  if (lastIndex < content.length) {
    nodes.push(content.slice(lastIndex));
  }

  URL_PATTERN.lastIndex = 0;
  return nodes;
}

const AssistantTranscript = forwardRef<HTMLDivElement, AssistantTranscriptProps>(
  function AssistantTranscript({ messages, isPending, isConversationStarted }, ref) {
    return (
      <div ref={ref} className="w-full">
        {!isConversationStarted ? (
          <div className="flex flex-col items-center gap-3 text-center sm:gap-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className="w-full">
                <div
                  className={`mx-auto max-w-[18ch] tracking-[-0.04em] ${
                    message.role === "assistant"
                      ? "text-[clamp(3.5rem,10vw,7rem)] font-medium leading-[0.9] sm:text-[clamp(4.5rem,9vw,8rem)]"
                      : "max-w-2xl text-base leading-7 text-zinc-700 sm:text-lg"
                  }`}
                >
                  {renderContent(message.content)}
                </div>
              </div>
            ))}
            {isPending ? <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400" /> : null}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                <div
                  className={`max-w-[85%] whitespace-pre-line break-words rounded-2xl px-4 py-3 text-sm leading-6 sm:text-base ${
                    message.role === "user"
                      ? "bg-zinc-950 text-white"
                      : "border border-zinc-200 bg-zinc-50 text-zinc-800"
                  }`}
                >
                  {renderContent(message.content)}
                </div>
              </div>
            ))}
            {isPending ? (
              <div className="flex justify-start px-2 py-1">
                <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-zinc-400" />
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

export default AssistantTranscript;
