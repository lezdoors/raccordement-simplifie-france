import Navigation from "@/components/Navigation";
import OptimizedHeroSection from "@/components/OptimizedHeroSection";
import SwipeableServiceCards from "@/components/SwipeableServiceCards";
import { LazyComponent } from "@/components/PerformanceOptimizer";
import { lazy } from "react";

// Lazy load non-critical sections
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const HowItWorksSection = lazy(() => import("@/components/HowItWorksSection"));
const AdvantagesSection = lazy(() => import("@/components/AdvantagesSection"));
const SpecializedServicesSection = lazy(() => import("@/components/SpecializedServicesSection"));
const TrustSection = lazy(() => import("@/components/TrustSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const SatisfactionSection = lazy(() => import("@/components/SatisfactionSection"));
const ConnectionTypesSection = lazy(() => import("@/components/ConnectionTypesSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const ContactFormSection = lazy(() => import("@/components/ContactFormSection"));
const FooterSection = lazy(() => import("@/components/FooterSection"));

const OptimizedHomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <OptimizedHeroSection />
      <SwipeableServiceCards />
      
      <LazyComponent threshold={0.1}>
        <ProcessSection />
      </LazyComponent>
      
      <LazyComponent threshold={0.1}>
        <HowItWorksSection />
      </LazyComponent>
      
      <LazyComponent threshold={0.1}>
        <TrustSection />
      </LazyComponent>
      
      <LazyComponent threshold={0.1}>
        <AdvantagesSection />
      </LazyComponent>
      
      <LazyComponent threshold={0.1}>
        <TestimonialsSection />
      </LazyComponent>
      
      <LazyComponent threshold={0.1}>
        <SpecializedServicesSection />
      </LazyComponent>
      
      <LazyComponent threshold={0.1}>
        <SatisfactionSection />
      </LazyComponent>
      
      <LazyComponent threshold={0.1}>
        <ConnectionTypesSection />
      </LazyComponent>
      
      <LazyComponent threshold={0.1}>
        <FAQSection />
      </LazyComponent>
      
      <LazyComponent threshold={0.1}>
        <ContactFormSection />
      </LazyComponent>
      
      <LazyComponent threshold={0.1}>
        <FooterSection />
      </LazyComponent>
    </div>
  );
};

export default OptimizedHomePage;