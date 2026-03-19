import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

const categories = ["Current Projects", "Selected Work"] as const;

export default function ProjectGrid() {
  return (
    <section id="projects" className="space-y-12">
      <div>
        <p className="text-sm font-mono uppercase tracking-[0.3em] text-electric">
          Projects
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-zinc-100 sm:text-4xl">
          Builds, experiments, and real-world systems
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-zinc-400">
          A selection of current work and highlights. Each card opens the live
          build or repo directly.
        </p>
      </div>

      {categories.map((category) => {
        const list = projects.filter((project) => project.category === category);
        if (!list.length) {
          return null;
        }

        return (
          <div key={category} className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-zinc-100">{category}</h3>
              <span className="text-xs font-mono text-zinc-500">
                {list.length} projects
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {list.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
