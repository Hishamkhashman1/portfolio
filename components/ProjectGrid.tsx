"use client";

import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import { getSiteContent } from "@/data/siteContent";
import { useLocale } from "@/components/LocaleProvider";

export default function ProjectGrid() {
  const { locale } = useLocale();
  const content = getSiteContent(locale);
  const localizedProjects = projects.map((project, index) => ({
    ...project,
    title: content.projectsList[index]?.title || project.title,
    description: content.projectsList[index]?.description || project.description,
    badge: content.projectsList[index]?.badge ?? project.badge,
    liveLabel: content.projectsList[index]?.liveLabel,
    repoLabel: content.projectsList[index]?.repoLabel,
    privateLabel: content.projectsList[index]?.privateLabel
  }));
  const featuredProjects = localizedProjects.filter((project) => project.featured);
  const otherProjects = localizedProjects.filter((project) => !project.featured);

  return (
    <section id="projects" className="space-y-8 pt-4">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-mono uppercase tracking-[0.35em] text-zinc-500">
          {content.projects.eyebrow}
        </p>
        <h3 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          {content.projects.title}
        </h3>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">
          {content.projects.summary}
        </p>
      </div>

      <div className="space-y-10">
        <div className="grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        {otherProjects.length ? (
          <div className="space-y-4 border-t border-zinc-200 pt-10">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-xl font-semibold tracking-tight text-zinc-950">
                {content.projects.otherProjects}
              </h4>
              <span className="text-xs font-mono text-zinc-500">
                {otherProjects.length} {content.projects.countSuffix}
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {otherProjects.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
