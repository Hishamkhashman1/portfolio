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
    <section className="space-y-4 border-t border-zinc-200 pt-8">
      <article className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
              Building Activity
            </p>

            <a
              href={profileUrl}
              className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-950"
              target="_blank"
              rel="noreferrer"
              aria-label="View GitHub profile"
            >
              View GitHub
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
