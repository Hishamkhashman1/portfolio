"use client";

import { useEffect, useState } from "react";
import type { ContributionDay } from "@/types/github-activity";
import GitHubActivityField from "@/components/GitHubActivityField";
import { getSiteContent } from "@/data/siteContent";
import { useLocale } from "@/components/LocaleProvider";

type GitHubActivitySectionProps = {
  username: string;
};

export default function GitHubActivitySection({
  username
}: GitHubActivitySectionProps) {
  const { locale } = useLocale();
  const content = getSiteContent(locale);
  const [contributionDays, setContributionDays] = useState<ContributionDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadActivity() {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/github-activity?username=${encodeURIComponent(username)}`);
        const data = (await response.json()) as {
          contributions?: ContributionDay[];
        };

        if (!response.ok || !Array.isArray(data.contributions)) {
          throw new Error("Failed to load GitHub activity");
        }

        if (!cancelled) {
          setContributionDays(data.contributions);
        }
      } catch {
        if (!cancelled) {
          setContributionDays([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadActivity();

    return () => {
      cancelled = true;
    };
  }, [username]);

  const profileUrl = `https://github.com/${username}`;
  const activityStart = new Date("2025-10-01T00:00:00Z");
  const filteredDays = contributionDays.filter((day) => {
    const dayDate = new Date(`${day.date}T00:00:00Z`);
    return dayDate >= activityStart;
  });

  return (
    <section className="space-y-4 pt-8">
      <article className="overflow-hidden rounded-[24px] border border-zinc-200/80 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04),0_18px_45px_-28px_rgba(15,23,42,0.24)]">
        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
              {content.github.eyebrow}
            </p>

            <a
              href={profileUrl}
              className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-950"
              target="_blank"
              rel="noreferrer"
              aria-label={content.github.profileLabel}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.1c-3.22.7-3.9-1.37-3.9-1.37a3.06 3.06 0 0 0-1.28-1.69c-1.05-.72.08-.71.08-.71a2.43 2.43 0 0 1 1.77 1.19 2.47 2.47 0 0 0 3.37.96c.05-.75.38-1.4.84-1.72-2.55-.29-5.23-1.28-5.23-5.69a4.46 4.46 0 0 1 1.19-3.1 4.14 4.14 0 0 1 .11-3.06s.97-.31 3.18 1.18a10.96 10.96 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18a4.14 4.14 0 0 1 .11 3.06 4.46 4.46 0 0 1 1.19 3.1c0 4.42-2.69 5.39-5.25 5.68.39.34.74 1.02.74 2.06v3.05c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z" />
              </svg>
            </a>
          </div>

          <div
            className="activity-field-viewport rounded-[18px] border border-zinc-200/70 bg-[linear-gradient(180deg,rgba(250,250,250,1)_0%,rgba(244,244,245,0.96)_100%)] p-3 sm:p-4"
            role="img"
            aria-label={content.github.aria}
          >
            {isLoading ? (
              <div className="flex h-[132px] items-center justify-center rounded-[18px] border border-dashed border-zinc-200 text-sm text-zinc-500">
                {content.github.loading}
              </div>
            ) : (
              <GitHubActivityField days={filteredDays} />
            )}
          </div>
        </div>
      </article>
    </section>
  );
}
