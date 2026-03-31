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
    <section
      id="top"
      className="relative flex flex-col pt-16 pb-2"
    >
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-sm font-mono text-zinc-400">
          <span className="inline-flex h-2 w-2 rounded-full bg-electric shadow-glow" />
          Available for consulting & product builds
        </div>
        <nav className="flex flex-wrap items-center gap-6 text-base text-zinc-300">
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

      <div className="mt-5">
        <div className="grid items-center gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="max-w-2xl">
            {/* <p className="text-sm font-mono uppercase tracking-[0.4em] text-electric">
              Hi, I&apos;m Hisham
            </p> */}
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-zinc-100 sm:text-6xl">
              {profile.name}
            </h1>
            {/* <p className="mt-3 text-sm text-zinc-400">{profile.greeting}</p> */}
            <p className="mt-5 text-xl leading-relaxed text-zinc-200">
              {profile.title}
            </p>
            <p className="mt-3 text-base leading-relaxed text-zinc-400">
              {profile.summary}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {profile.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-zinc-800 bg-haze/60 px-4 py-1 text-xs font-mono text-zinc-200"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-4">
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
                src="/hisham-photo.png"
                alt="Portrait of Hisham Khashman"
                width={320}
                height={320}
                sizes="(max-width: 1024px) 240px, 320px"
                className="h-52 w-52 rounded-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
