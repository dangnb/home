import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ServicesPreview from "@/components/ServicesPreview";
import GalleryPreview from "@/components/GalleryPreview";

export default async function Home() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <ServicesPreview />
      <GalleryPreview />
    </main>
  );
}
