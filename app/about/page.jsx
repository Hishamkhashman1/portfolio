"use client";

import { getAboutPageContent } from "@/data/pageContent";
import { useLocale } from "@/components/LocaleProvider";

export default function AboutPage() {
  const { locale } = useLocale();
  const content = getAboutPageContent(locale);

  return (
    <main
      style={{
        padding: "4rem",
        color: "#0f1115",
        background: "#fff",
        minHeight: "100vh"
      }}
    >
      <h1>{content.title}</h1>
      <p>{content.summary}</p>
    </main>
  );
}
