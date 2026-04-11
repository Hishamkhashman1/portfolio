import { profile } from "@/data/profile";

export default function CVSection() {
  return (
    <section id="cv" className="mt-10 space-y-6">
      <div>
        <p className="text-sm font-mono uppercase tracking-[0.3em] text-electric">
          CV
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-zinc-100 sm:text-4xl">
          Building real-world software & data systems
        </h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 text-sm text-zinc-400">
          <p>{profile.background}</p>
          <p>
            I build Fullstack web applications, APIs and data systems that solve real problems.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-haze/50 p-6">
          <div className="text-sm text-zinc-400">CV Highlights</div>
          <ul className="mt-4 space-y-3 text-sm text-zinc-200">
            <li>Full-stack builds with strong UX and business alignment for clients in Japan, Mexico and USA.</li>
	    <li>Designed and Built APIs and backend systems using Python and Ruby on Rails.</li>
	    <li>Developed data tools for forecasting, anomaly detection, and analytics.</li>
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
