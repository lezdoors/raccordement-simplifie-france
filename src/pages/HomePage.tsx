import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServiceTypesSection from "@/components/ServiceTypesSection";
import ProcessSection from "@/components/ProcessSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import SpecializedServicesSection from "@/components/SpecializedServicesSection";
import SatisfactionSection from "@/components/SatisfactionSection";
import ConnectionTypesSection from "@/components/ConnectionTypesSection";
import FAQSection from "@/components/FAQSection";
import ContactFormSection from "@/components/ContactFormSection";
import FooterSection from "@/components/FooterSection";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ServiceTypesSection />
      <ProcessSection />
      <HowItWorksSection />
      <AdvantagesSection />
      <SpecializedServicesSection />
      <SatisfactionSection />
      <ConnectionTypesSection />
      <FAQSection />
      <ContactFormSection />
      <FooterSection />
    </div>
  );
};

export default HomePage;