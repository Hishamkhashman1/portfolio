import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ForecastAlphaSection from "@/components/ForecastAlphaSection";
import GitHubActivitySection from "@/components/GitHubActivitySection";

export const metadata: Metadata = {
  title: "Hisham Khashman | Technical Founder & Full-Stack Engineer",
  description:
    "Technical founder and full-stack engineer building AI-powered software, operational intelligence systems, and scalable SaaS products."
};

export default function PortfolioHome() {
  const forecastLiveUrl =
    "https://www.forecastalpha.it.com/";
  const forecastImage = "/projects/forecast.png";

  return (
    <div className="min-h-screen bg-tech">
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-24 pt-12">
        <Hero />
        <ForecastAlphaSection liveUrl={forecastLiveUrl} image={forecastImage} />
        <GitHubActivitySection username="Hishamkhashman1" />
        <ProjectGrid />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
