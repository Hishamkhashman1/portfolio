import { profile } from "@/data/profile";

export default function CVSection() {
  return (
    <section id="cv" className="mt-10 space-y-6">
      <div>
        <p className="text-sm font-mono uppercase tracking-[0.3em] text-electric">
          CV
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-zinc-100 sm:text-4xl">
          Strategy, engineering, and execution
        </h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 text-sm text-zinc-400">
          <p>{profile.background}</p>
          <p>
            I translate business objectives into scalable backend systems,
            analytics pipelines, and ML-enabled products with measurable impact.
          </p>
          <p>
            Domains: finance, SaaS, analytics tooling, and decision support.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-haze/50 p-6">
          <div className="text-sm text-zinc-400">CV Highlights</div>
          <ul className="mt-4 space-y-3 text-sm text-zinc-200">
            <li>Consulting & delivery leadership across enterprise clients.</li>
            <li>Backend and data engineering for analytics-first products.</li>
            <li>Full-stack builds with strong UX and business alignment.</li>
          </ul>
          <a
            href={profile.links.cv}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-electric"
          >
            Download the full CV
            <span aria-hidden="true">-&gt;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
