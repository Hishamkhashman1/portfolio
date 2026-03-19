import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import CVSection from "@/components/CVSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-tech">
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24 pt-16">
        <Hero />
        <ProjectGrid />
        <CVSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
