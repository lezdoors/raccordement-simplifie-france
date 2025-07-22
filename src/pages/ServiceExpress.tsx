import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";

const ServiceExpress = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-8">Service Express</h1>
          <p className="text-lg text-muted-foreground">
            Page en cours de construction. Cette section sera bientôt disponible avec toutes les informations 
            sur notre service de raccordement express.
          </p>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default ServiceExpress;