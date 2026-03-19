import Image from "next/image";
import { profile } from "@/data/profile";

const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "CV", href: "#cv" },
  { label: "LinkedIn", href: profile.links.linkedin },
  { label: "GitHub", href: profile.links.github },
  { label: "Contact", href: "#contact" }
];

export default function Hero() {
  return (
    <section id="top" className="relative">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm font-mono text-zinc-400">
          <span className="inline-flex h-2 w-2 rounded-full bg-electric shadow-glow" />
          Available for consulting & product builds
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-zinc-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition hover:text-electric"
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-mono uppercase tracking-[0.4em] text-electric">
            Hi, I&apos;m Hisham
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-zinc-100 sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-4 text-sm text-zinc-400">{profile.greeting}</p>
          <p className="mt-6 text-xl text-zinc-200">{profile.title}</p>
          <p className="mt-3 max-w-2xl text-base text-zinc-400">
            {profile.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {profile.stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-zinc-800 bg-haze/60 px-4 py-1 text-xs font-mono text-zinc-200"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-full bg-electric px-6 py-3 text-sm font-semibold text-night shadow-glow transition hover:shadow-glowStrong"
            >
              View Projects
            </a>
            <a
              href={profile.links.cv}
              className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-electric hover:text-electric"
            >
              Download CV
            </a>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute -inset-8 rounded-full bg-electric/10 blur-3xl" />
          <div className="relative rounded-full border border-electric/40 bg-haze/40 p-2 shadow-glow">
            <Image
              src="/me.svg"
              alt="Portrait of Hisham Khashman"
              width={320}
              height={320}
              sizes="(max-width: 1024px) 240px, 320px"
              className="h-64 w-64 rounded-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
