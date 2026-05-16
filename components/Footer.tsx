"use client";

import { profile } from "@/data/profile";
import { getSiteContent } from "@/data/siteContent";
import { useLocale } from "@/components/LocaleProvider";

export default function Footer() {
  const { locale } = useLocale();
  const content = getSiteContent(locale);

  return (
    <footer className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-zinc-200 pt-8 text-sm text-zinc-500 md:flex-row md:items-center">
      <div className="font-mono text-xs uppercase tracking-[0.2em]">
        {profile.name}
      </div>
      <div className="text-xs text-zinc-500">
        © {new Date().getFullYear()} {content.footer.rights}
      </div>
    </footer>
  );
}
