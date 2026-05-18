import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PricingSection from "@/components/sections/PricingSection";
import PaymentSection from "@/components/sections/PaymentSection";
import WhyChooseSection from "@/components/sections/WhyChooseSection";
import AboutSection from "@/components/sections/AboutSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <PricingSection />
      <PaymentSection />
      <WhyChooseSection />
      <AboutSection />
    </>
  );
}
