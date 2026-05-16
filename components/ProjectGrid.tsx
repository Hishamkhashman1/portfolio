import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectGrid() {
  const featuredProjects = projects.filter((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  return (
    <section id="projects" className="space-y-8 pt-4">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-mono uppercase tracking-[0.35em] text-zinc-500">
          Projects
        </p>
        <h3 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Selected builds
        </h3>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">
          Product-oriented software, AI workflows, and data systems built to
          solve business problems.
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
                Other projects
              </h4>
              <span className="text-xs font-mono text-zinc-500">
                {otherProjects.length} projects
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
