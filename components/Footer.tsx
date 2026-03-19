import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-zinc-800 pt-8 text-sm text-zinc-500 md:flex-row md:items-center">
      <div className="font-mono text-xs uppercase tracking-[0.2em]">
        {profile.name}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <a
          href={profile.links.github}
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-electric"
        >
          GitHub
        </a>
        <a
          href={profile.links.linkedin}
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-electric"
        >
          LinkedIn
        </a>
        <a
          href={`mailto:${profile.email}`}
          className="transition hover:text-electric"
        >
          Email
        </a>
      </div>
      <div className="text-xs text-zinc-600">
        © {new Date().getFullYear()} All rights reserved.
      </div>
    </footer>
  );
}
