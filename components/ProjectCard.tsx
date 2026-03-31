"use client";

import Image from "next/image";
import type { Project } from "@/data/projects";

const isExternal = (url: string) => url.startsWith("http");

const openLink = (url: string) => {
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
  const isForecastAlpha = project.title.startsWith("Forecast Alpha");
  const liveLabel = isForecastAlpha
    ? "View Platform"
    : isExternal(project.liveUrl)
      ? "Open Live"
      : "Open";
  const repoLabel = isForecastAlpha ? "GitHub" : "Repo";

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={() => openLink(project.liveUrl)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLink(project.liveUrl);
        }
      }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-haze/40 p-5 transition hover:-translate-y-1 hover:border-electric/60 hover:shadow-glow"
    >
      <div className="relative h-40 overflow-hidden rounded-xl border border-zinc-800">
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover opacity-80 transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-night/60 via-transparent to-transparent" />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-zinc-100">{project.title}</h3>
        {project.badge ? (
          <span className="rounded-full border border-amber-300/40 bg-amber-200/10 px-3 py-1 text-xs font-mono text-amber-200">
            {project.badge}
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-sm text-zinc-400">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <span
            key={item}
            className="rounded-full bg-night/60 px-3 py-1 text-xs font-mono text-zinc-300"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-zinc-400">
        <span className="font-mono">{liveLabel}</span>
        {project.repoUrl ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (project.repoUrl) openLink(project.repoUrl);
            }}
            className="rounded-full border border-zinc-700 px-3 py-1 font-mono text-zinc-200 transition hover:border-electric hover:text-electric"
          >
            {repoLabel}
          </button>
        ) : (
          <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            {project.badge ? "NDA" : "Live"}
          </span>
        )}
      </div>
    </article>
  );
}
