import Image from "next/image";
import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import CVSection from "@/components/CVSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  const forecastLiveUrl =
    "https://www.forecastalpha.it.com/";
  const forecastRepoUrl =
    "https://www.forecastalpha.it.com/";
  const forecastImage = "/projects/forecast.png";

  return (
    <div className="min-h-screen bg-tech">
      <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-24 pt-12">
        <div className="space-y-6">
          <Hero />
          <section className="space-y-10">
            <div>
              <p className="text-sm font-mono uppercase tracking-[0.3em] text-electric">
                Venture
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-zinc-100 sm:text-4xl">
                Building Forecast Alpha
              </h2>
              <p className="mt-4 max-w-2xl text-sm text-zinc-400">
                Forecast Alpha is the main product I&apos;m currently building.
                an AI-powered analytics platform focused on anomaly detection,
                forecasting, and decision intelligence. It is designed for
                real-world operational data, not just dashboards.
              </p>
              <p className="mt-3 max-w-2xl text-sm text-zinc-400">
                Built from hands-on experience across consulting, finance, and
                operations, it reflects both product thinking and engineering
                execution.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-5">
                <div className="rounded-2xl border border-zinc-800 bg-haze/50 p-6">
                  <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">
                    Flagship Product
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-zinc-100">
                    Applied AI for revenue-critical operations
                  </h3>
                  <p className="mt-3 text-sm text-zinc-400">
                    Built for messy, high-stakes data workflows with a focus on
                    signal detection, forecasting, and decision readiness.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      "Anomaly Detection",
                      "Forecasting",
                      "Decision Intelligence"
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-night/60 px-3 py-1 text-xs font-mono text-zinc-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={forecastLiveUrl}
                    className="rounded-full bg-electric px-6 py-3 text-sm font-semibold text-night shadow-glow transition hover:shadow-glowStrong"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get a Data Audit
                  </a>
                  {/* <a
                    href={forecastRepoUrl}
                    className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-electric hover:text-electric"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Code
                  </a> */}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-haze/40 p-5">
                <div className="relative h-56 overflow-hidden rounded-xl border border-zinc-800">
                  <Image
                    src={forecastImage}
                    alt="Forecast Alpha platform preview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-night/60 via-transparent to-transparent" />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-mono">Forecast Alpha Platform</span>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                    Founder Build
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
        <ProjectGrid />
        <CVSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
