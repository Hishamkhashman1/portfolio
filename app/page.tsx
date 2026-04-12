import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import CVSection from "@/components/CVSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ForecastAlphaSection from "@/components/ForecastAlphaSection";

export default function Home() {
  const forecastLiveUrl =
    "https://www.forecastalpha.it.com/";
  const forecastImage = "/projects/forecast.png";

  return (
    <div className="min-h-screen bg-tech">
      <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-24 pt-12">
        <Hero />
        <ForecastAlphaSection
          liveUrl={forecastLiveUrl}
          image={forecastImage}
        />
        <ProjectGrid />
        <CVSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
