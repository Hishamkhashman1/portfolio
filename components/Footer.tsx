import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-zinc-200 pt-8 text-sm text-zinc-500 md:flex-row md:items-center">
      <div className="font-mono text-xs uppercase tracking-[0.2em]">
        {profile.name}
      </div>
      <div className="text-xs text-zinc-500">
        © {new Date().getFullYear()} All rights reserved.
      </div>
    </footer>
  );
}
