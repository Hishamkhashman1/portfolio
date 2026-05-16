"use client";

import { useEffect, useState } from "react";

const statuses = [
  "Forecast Alpha",
  "SaaS billing system",
  "anomaly detection workflows",
  "collaborative analytics",
  "operational intelligence tooling",
  "AI-assisted KPI systems"
];

const TYPING_SPEED = 35;
const HOLD_MIN = 1500;
const HOLD_VARIANCE = 1200;
const START_DELAY = 180;

export default function NowBuildingStatus() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let typeTimeout: ReturnType<typeof setTimeout> | undefined;
    let holdTimeout: ReturnType<typeof setTimeout> | undefined;
    let charTimer: ReturnType<typeof setInterval> | undefined;

    const targetText = statuses[activeIndex];
    setDisplayText("");
    setIsTyping(true);

    typeTimeout = setTimeout(() => {
      let current = 0;

      charTimer = setInterval(() => {
        if (cancelled) {
          return;
        }

        current += 1;
        setDisplayText(targetText.slice(0, current));

        if (current >= targetText.length && charTimer) {
          clearInterval(charTimer);
          setIsTyping(false);
          holdTimeout = setTimeout(() => {
            if (!cancelled) {
              setActiveIndex((value) => (value + 1) % statuses.length);
            }
          }, HOLD_MIN + Math.random() * HOLD_VARIANCE);
        }
      }, TYPING_SPEED);
    }, START_DELAY);

    return () => {
      cancelled = true;

      if (typeTimeout) {
        clearTimeout(typeTimeout);
      }

      if (holdTimeout) {
        clearTimeout(holdTimeout);
      }

      if (charTimer) {
        clearInterval(charTimer);
      }
    };
  }, [activeIndex]);

  return (
    <section className="mt-8 max-w-2xl sm:mt-10">
      <p className="text-[11px] font-mono uppercase tracking-[0.4em] text-zinc-500">
        Now Building
      </p>

      <div className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/90 px-4 py-3 shadow-sm">
        <span className="relative mt-0.5 flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inset-0 rounded-full bg-zinc-400/25" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-zinc-500" />
        </span>

        <div className="min-w-0 flex-1 font-mono" aria-live="polite" aria-atomic="true">
          <div className="text-[11px] leading-5 text-zinc-500">
            currently_building:
          </div>
          <div className="mt-0.5 flex min-h-[1.5rem] items-center gap-2 text-[13px] leading-6 text-zinc-700">
            <span className="text-zinc-400">&gt;</span>
            <span className="min-w-0 truncate">
              {displayText}
              <span
                className={`ml-0.5 inline-block text-zinc-400 transition-opacity duration-150 ${
                  isTyping ? "opacity-100" : "opacity-60"
                }`}
                aria-hidden
              >
                ▍
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
