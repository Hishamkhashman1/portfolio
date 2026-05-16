"use client";

import { cloneElement, type CSSProperties, type ReactElement } from "react";
import { GitHubCalendar } from "react-github-calendar";

type GitHubActivitySectionProps = {
  username: string;
};

export default function GitHubActivitySection({
  username
}: GitHubActivitySectionProps) {
  const profileUrl = `https://github.com/${username}`;
  const calendarTheme = {
    light: ["#f4f4f5", "#e5e7eb", "#cbd5e1", "#94a3b8", "#64748b"]
  };
  const activityOrder = new Map<string, number>();

  const transformData = (data: any[]) => {
    activityOrder.clear();
    [...data]
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((activity, index) => {
        activityOrder.set(activity.date, index);
      });

    return data;
  };

  const renderBlock = (
    block: ReactElement<{ className?: string; style?: CSSProperties }>,
    activity: any
  ) => {
    const order = activityOrder.get(activity.date) ?? 0;
    const delay = Math.min(order * 8, 420);

    return cloneElement(block, {
      className:
        "gh-square-reveal gh-square-hover " + (block.props.className ?? ""),
      style: {
        ...(block.props.style as CSSProperties),
        animationDelay: `${delay}ms`
      }
    });
  };

  return (
    <section className="space-y-4 pt-8">
      <article className="overflow-hidden rounded-[24px] bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
              Building Activity
            </p>

            <a
              href={profileUrl}
              className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-950"
              target="_blank"
              rel="noreferrer"
              aria-label="View GitHub profile"
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

          <div className="overflow-x-auto rounded-[18px] bg-zinc-50/70 p-2 sm:p-3">
            <GitHubCalendar
              username={username}
              year="last"
              colorScheme="light"
              theme={calendarTheme}
              blockSize={11}
              blockMargin={4}
              blockRadius={3}
              fontSize={12}
              showColorLegend={false}
              showMonthLabels={false}
              showWeekdayLabels={false}
              showTotalCount={false}
              labels={{
                totalCount: ""
              }}
              tooltips={{
                activity: {
                  text: (activity) => `${activity.count} contribution${activity.count === 1 ? "" : "s"} on ${activity.date}`
                }
              }}
              transformData={transformData}
              renderBlock={renderBlock}
              errorMessage=""
            />
          </div>
        </div>
      </article>
    </section>
  );
}
