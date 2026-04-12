import Image from "next/image";
import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import CVSection from "@/components/CVSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  const forecastLiveUrl =
    "https://www.forecastalpha.it.com/";
  const forecastImage = "/projects/forecast.png";

  return (
    <div className="min-h-screen bg-tech">
      <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-24 pt-12">
        <div className="space-y-6">
          <Hero />
          <section className="space-y-3">
            <div className="space-y-3">
              <p className="text-sm font-mono uppercase tracking-[0.3em] text-electric">
                Venture
              </p>
              <h2 className="text-3xl font-semibold text-zinc-100 sm:text-4xl">
                Forecast Alpha
              </h2>
            </div>

            <div className="mt-6 max-w-3xl">
              <div className="rounded-2xl border border-zinc-800 bg-haze/40 p-5">
                <div className="relative h-64 overflow-hidden rounded-xl">
                  <Image
                    src={forecastImage}
                    alt="Forecast Alpha platform preview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-night/60 via-transparent to-transparent" />
                </div>
                <div className="mt-4 space-y-3">
                  <h3 className="text-xl font-semibold text-zinc-100">
                    Applied AI for revenue-critical operations
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Signal detection and forecast clarity for critical ops.
                  </p>

                  <a
                    href={forecastLiveUrl}
                    className="inline-flex w-fit rounded-full bg-electric px-5 py-2 text-sm font-semibold text-night shadow-glow transition hover:shadow-glowStrong"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get a Data Audit
                  </a>
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
