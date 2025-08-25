import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import FooterSection from "@/components/FooterSection";
import { SmartStickyButton } from "@/components/SmartStickyButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <FooterSection />
      <SmartStickyButton />
    </div>
  );
};

export default Index;
