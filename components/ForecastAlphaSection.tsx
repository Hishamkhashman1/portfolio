"use client";

import Image from "next/image";
import { getSiteContent } from "@/data/siteContent";
import { useLocale } from "@/components/LocaleProvider";

type ForecastAlphaSectionProps = {
  liveUrl: string;
  image: string;
};

export default function ForecastAlphaSection({
  liveUrl,
  image
}: ForecastAlphaSectionProps) {
  const { locale } = useLocale();
  const content = getSiteContent(locale);

  return (
    <section className="mt-0 space-y-4 border-t border-zinc-200 pt-8">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-mono uppercase tracking-[0.35em] text-zinc-500">
          {content.forecast.eyebrow}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
          {content.forecast.title}
        </h2>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
            <div className="max-w-2xl space-y-5">
              <div className="space-y-3">
                <p className="text-sm font-mono uppercase tracking-[0.22em] text-zinc-500">
                  {content.forecast.tagline}
                </p>
                <p className="max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
                  {content.forecast.summary}
                </p>
              </div>

              <a
                href={liveUrl}
                className="inline-flex rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                target="_blank"
                rel="noreferrer"
              >
                {content.forecast.cta}
              </a>
            </div>
          </div>

          <div className="relative min-h-[320px] border-t border-zinc-200 bg-zinc-50 lg:min-h-[560px] lg:border-l lg:border-t-0">
            <Image
              src={image}
              alt="Forecast Alpha platform preview"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover opacity-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
