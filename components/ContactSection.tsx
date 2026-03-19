import { profile } from "@/data/profile";

export default function ContactSection() {
  const mailto = `mailto:${profile.email}`;

  return (
    <section id="contact" className="mt-10 rounded-3xl border border-zinc-800 bg-haze/50 p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-mono uppercase tracking-[0.3em] text-electric">
            Contact
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-zinc-100 sm:text-4xl">
            Let&apos;s build something ambitious.
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-zinc-400">
            Email is the fastest way to reach me. Share a quick brief and I will
            respond with next steps.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <a
            href={mailto}
            className="rounded-full bg-electric px-6 py-3 text-sm font-semibold text-night shadow-glow transition hover:shadow-glowStrong"
          >
            Email Me
          </a>
          <a
            href={mailto}
            className="text-sm font-mono text-zinc-300 transition hover:text-electric"
          >
            {profile.email}
          </a>
        </div>
      </div>
    </section>
  );
}
