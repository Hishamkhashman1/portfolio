import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Services | Hisham Khashman",
  description:
    "Technical systems, infrastructure, backend, DevOps, AI, data automation, and ERP support."
};

const services = [
  {
    title: "AI Systems & Automation",
    description:
      "AI-powered tools, workflow automation, and LLM integrations that improve efficiency and decision-making."
  },
  {
    title: "DevOps & Deployment",
    description:
      "CI/CD pipelines, cloud deployments, and production issue resolution to keep systems reliable."
  },
  {
    title: "Backend Systems Development",
    description:
      "API development, performance optimization, and integrations for scalable backend systems."
  },
  {
    title: "Data & Process Automation",
    description:
      "Data pipelines and automation that reduce manual work and streamline operations."
  },
  {
    title: "ERP Systems & Implementation",
    description:
      "Custom ERP workflows, system setup, and integrations aligned with your business processes."
  }
];

const supportPoints = [
  "Ongoing backend and infrastructure support",
  "Bug fixes and continuous improvements",
  "Fast response when issues arise"
];

const whatsappHref =
  "https://wa.me/525551065958?text=Hi%20I%20found%20your%20website%20and%20would%20like%20to%20discuss%20your%20services";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-tech">
      <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-24 pt-12">
        <section className="pt-16 pb-8">
          <div className="max-w-4xl">
            <p className="text-sm font-mono uppercase tracking-[0.4em] text-electric">
              Services
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-100 sm:text-6xl">
              Technical Systems & Infrastructure Support
            </h1>
            <p className="mt-5 max-w-3xl text-xl leading-relaxed text-zinc-200">
              I help companies keep their systems stable, scalable, and running
              smoothly - with practical backend, DevOps, and AI solutions.
            </p>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              Worked with teams across LATAM, Europe, the Middle East, and
              Japan.
            </p>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-400">
              Supporting growing businesses that need reliable systems without
              building a full internal tech team.
            </p>
          </div>
        </section>

        <section className="space-y-10">
          <div>
            <p className="text-sm font-mono uppercase tracking-[0.3em] text-electric">
              Services
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
              What I Do
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {services.map((service) => (
              <article
                key={service.title}
                className="group h-auto rounded-2xl border border-zinc-800 bg-white/[0.03] p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-electric/30 hover:bg-white/[0.05] hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold leading-snug text-zinc-100 transition group-hover:text-electric">
                  {service.title}
                </h3>
                <p className="mt-4 whitespace-normal break-words text-sm leading-6 text-zinc-400">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-electric/20 bg-haze/75 p-8 shadow-glow">
          <div className="max-w-4xl">
            <p className="text-sm font-mono uppercase tracking-[0.3em] text-electric">
              Ongoing Technical Support
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-zinc-100 sm:text-4xl">
              Ongoing Technical Support
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-300">
              I work with companies on a monthly retainer to ensure their
              systems remain stable, efficient, and well-maintained - without
              the need for a full-time hire.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-zinc-200">
              {supportPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-electric shadow-glow" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm font-mono uppercase tracking-[0.2em] text-ember">
              Plans start from $987/month
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-haze/50 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-mono uppercase tracking-[0.3em] text-electric">
                Let&apos;s Work Together
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-zinc-100 sm:text-4xl">
                Let&apos;s Work Together
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                If you&apos;re looking for reliable technical support and a
                long-term partner, let&apos;s talk.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-electric px-6 py-3 text-sm font-semibold text-night shadow-glow transition hover:shadow-glowStrong"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-night/10">
                  <svg
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                    className="h-4 w-4 fill-current"
                  >
                    <path d="M19.11 17.27c-.28-.14-1.65-.82-1.91-.91-.26-.1-.45-.14-.64.14-.19.28-.74.91-.91 1.1-.17.19-.34.21-.63.07-.28-.14-1.18-.43-2.25-1.36-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.54-.87-2.11-.23-.55-.46-.48-.64-.49-.17-.01-.36-.01-.55-.01s-.49.07-.74.35c-.26.28-.98.96-.98 2.35 0 1.39 1 2.73 1.14 2.92.14.19 1.99 3.04 4.82 4.26.67.29 1.2.46 1.61.59.68.22 1.3.19 1.79.12.55-.08 1.65-.68 1.88-1.34.23-.66.23-1.22.16-1.34-.07-.12-.26-.19-.55-.33z" />
                    <path d="M26.67 5.33A14.99 14.99 0 0 0 16.03 1C7.75 1 1 7.73 1 16c0 2.64.69 5.22 1.99 7.47L1 31l7.73-1.98A14.95 14.95 0 0 0 16 31c8.28 0 15-6.73 15-15 0-4.01-1.56-7.77-4.33-10.67zM16 28.25c-2.25 0-4.46-.6-6.39-1.73l-.46-.28-4.59 1.18 1.22-4.47-.3-.46A12.19 12.19 0 0 1 3.75 16C3.75 9.24 9.24 3.75 16 3.75S28.25 9.24 28.25 16 22.76 28.25 16 28.25z" />
                  </svg>
                </span>
                WhatsApp Me
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-electric hover:text-electric"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 fill-current"
                  >
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.39-1.85 3.63 0 4.3 2.39 4.3 5.5v6.24zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM3.56 20.45h3.56V9H3.56v11.45z" />
                  </svg>
                </span>
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </section>

        <div className="pt-4">
          <Footer />
        </div>
      </main>
    </div>
  );
}
