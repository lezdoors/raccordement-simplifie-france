import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Clock, Shield, Award } from "lucide-react";
import heroIllustration from "@/assets/hero-electrical-infrastructure.svg";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-accent/30 to-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium">
              <Zap className="w-4 h-4 mr-2" />
              Raccordement électrique simple et rapide
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              Votre raccordement
              <span className="block bg-gradient-hero bg-clip-text text-transparent">
                électrique en 3 clics
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Simplifiez vos démarches de raccordement électrique avec Enedis. 
              Service rapide, transparent et 100% digital.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                Commencer ma demande
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Simuler le coût
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">48h</span>
                <span className="text-xs text-muted-foreground">Traitement</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">100%</span>
                <span className="text-xs text-muted-foreground">Sécurisé</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Expert</span>
                <span className="text-xs text-muted-foreground">Enedis</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-hero rounded-2xl blur-3xl opacity-20"></div>
            <img 
              src={heroIllustration} 
              alt="Illustration raccordement électrique" 
              className="relative z-10 w-full max-w-lg mx-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default HeroSection;