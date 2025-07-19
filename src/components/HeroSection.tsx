import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";

const HeroSection = () => {
  return (
    <section className="bg-gradient-hero min-h-[90vh] flex items-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Raccordement Électrique{" "}
              <span className="text-primary">Enedis Simplifié</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Demandez votre raccordement électrique en 3 minutes. 
              Service rapide et professionnel partout en France.
            </p>

            {/* CTA Button */}
            <div className="mb-8">
              <Button 
                variant="hero" 
                size="lg" 
                className="px-8 py-4 text-lg"
              >
                Démarrer ma demande de raccordement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">Partenaire N°1 en France</span>
              </div>
              <div className="text-muted-foreground">
                • 234 demandes en cours
              </div>
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img 
                src={heroIllustration} 
                alt="Raccordement électrique Enedis" 
                className="w-full max-w-lg h-auto"
              />
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-secondary rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;