import Link from "next/link";
import Image from "next/image";
import { profile } from "@/data/profile";
import { getStackIcon } from "@/data/stackIcons";

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
      className="relative flex flex-col pt-16 pb-24 sm:pb-28"
    >
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-sm font-mono text-zinc-600">
          <span className="inline-flex h-2 w-2 rounded-full bg-zinc-900 shadow-glow" />
          Available for consulting and product builds
        </div>
        <nav className="flex flex-wrap items-center gap-6 text-sm text-zinc-700 sm:text-base">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition hover:text-zinc-950"
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="mt-5">
        <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="max-w-3xl">
            {/* <p className="text-sm font-mono uppercase tracking-[0.4em] text-electric">
              Hi, I&apos;m Hisham
            </p> */}
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-6xl lg:text-[4.5rem]">
              {profile.name}
            </h1>
            {/* <p className="mt-3 text-sm text-zinc-400">{profile.greeting}</p> */}
            <p className="mt-5 max-w-2xl text-xl leading-relaxed text-zinc-950 sm:text-2xl">
              {profile.title}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              {profile.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {profile.stack.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-mono text-zinc-700 shadow-sm"
                >
                  {getStackIcon(item) ? (
                    <i className={`${getStackIcon(item)} text-sm`} aria-hidden />
                  ) : null}
                  <span>{item}</span>
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                View Projects
              </a>
              <a
                href={profile.links.cv}
                className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-500 hover:text-zinc-950"
              >
                Download CV
              </a>
              <Link
                href="/services"
                className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-500 hover:text-zinc-950"
              >
                Services
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute -inset-8 rounded-full bg-zinc-200/70 blur-3xl" />
            <div className="relative rounded-full border border-zinc-200 bg-white p-2 shadow-glow">
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
