"use client";

import Image from "next/image";
import type { Project } from "@/data/projects";
import { getStackIcon } from "@/data/stackIcons";

const isExternal = (url: string) => url.startsWith("http");

const openLink = (url: string) => {
  if (!url) return;
  if (url.startsWith("#")) {
    window.location.hash = url;
    return;
  }

  if (url.startsWith("mailto:")) {
    window.location.href = url;
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
};

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const primaryUrl = project.liveUrl || project.repoUrl || "";
  const hasPrimaryUrl = Boolean(primaryUrl);
  const liveLabel = project.liveUrl
    ? isExternal(project.liveUrl)
      ? "Open Live"
      : "Open"
    : "Open Repo";

  return (
    <article
      role={hasPrimaryUrl ? "link" : undefined}
      tabIndex={hasPrimaryUrl ? 0 : undefined}
      aria-disabled={hasPrimaryUrl ? undefined : true}
      onClick={() => openLink(primaryUrl)}
      onKeyDown={(event) => {
        if (!hasPrimaryUrl) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLink(primaryUrl);
        }
      }}
      className="group relative overflow-hidden rounded-[24px] border border-zinc-200 bg-white transition hover:border-zinc-400 hover:shadow-sm"
    >
      <div className="relative h-52 overflow-hidden border-b border-zinc-200 sm:h-56">
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover opacity-90 transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-transparent" />
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-950 sm:text-xl">
            {project.title}
          </h3>
          {project.badge ? (
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-600">
              {project.badge}
            </span>
          ) : null}
        </div>

        <p className="text-sm leading-relaxed text-zinc-600 sm:text-[15px]">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-700"
            >
              {getStackIcon(item) ? (
                <i className={`${getStackIcon(item)} text-sm`} aria-hidden />
              ) : null}
              <span>{item}</span>
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1 text-xs text-zinc-500">
          <span className="font-mono">{liveLabel}</span>
          {project.repoUrl ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                if (project.repoUrl) openLink(project.repoUrl);
              }}
              className="rounded-full border border-zinc-300 px-3 py-1 font-mono text-zinc-900 transition hover:border-zinc-500 hover:text-zinc-950"
            >
              Repo
            </button>
          ) : (
            <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              {project.badge ? "Private" : "Live"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
