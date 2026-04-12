"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type ForecastAlphaSectionProps = {
  liveUrl: string;
  image: string;
};

export default function ForecastAlphaSection({
  liveUrl,
  image
}: ForecastAlphaSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.7 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const transitionClasses = "transition-all duration-700 ease-out";
  const hiddenClasses = "opacity-60 blur-sm translate-y-6";
  const visibleClasses = "opacity-100 blur-0 translate-y-0";

  return (
    <section
      ref={sectionRef}
      className={`mt-4 space-y-3 border-t border-zinc-900 pt-16 ${transitionClasses} ${
        isVisible ? visibleClasses : hiddenClasses
      }`}
    >
      <h2 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">
        Forecast Alpha
      </h2>

      <div className="mt-6 max-w-3xl">
        <div className="rounded-2xl border border-zinc-800 bg-haze/40 p-5">
          <div className="relative h-64 overflow-hidden rounded-xl">
            <Image
              src={image}
              alt="Forecast Alpha platform preview"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-night/60 via-transparent to-transparent" />
          </div>
          <div className="mt-4 space-y-3">
            <h3 className="text-xl font-semibold text-zinc-100">
              Applied AI for revenue-critical operations
            </h3>
            <p className="text-sm text-zinc-400">
              Signal detection and forecast clarity for critical ops.
            </p>

            <a
              href={liveUrl}
              className="inline-flex w-fit rounded-full bg-electric px-5 py-2 text-sm font-semibold text-night shadow-glow transition hover:shadow-glowStrong"
              target="_blank"
              rel="noreferrer"
            >
              Get a Data Audit
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
