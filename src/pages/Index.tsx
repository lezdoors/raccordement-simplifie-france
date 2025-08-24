import RefreshedNavigation from "@/components/RefreshedNavigation";
import RefreshedHeroSection from "@/components/RefreshedHeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import FooterSection from "@/components/FooterSection";
import { SmartStickyButton } from "@/components/SmartStickyButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <RefreshedNavigation />
      <RefreshedHeroSection />
      <ServicesSection />
      <ProcessSection />
      <FooterSection />
      <SmartStickyButton />
    </div>
  );
};

export default Index;
