import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AskHishamAssistant from "@/components/AskHishamAssistant";
import LocaleProvider from "@/components/LocaleProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["400", "500", "600", "700"]
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "Hisham Khashman | Technical Founder & Full-Stack Engineer",
  description:
    "Technical founder and full-stack engineer building AI-powered software, operational intelligence systems, and scalable SaaS products.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${plexMono.variable} font-sans bg-white text-zinc-950`}
      >
        <LocaleProvider>
          {children}
          <AskHishamAssistant />
        </LocaleProvider>
      </body>
    </html>
  );
}
