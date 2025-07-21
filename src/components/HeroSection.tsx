import { Button } from "@/components/ui/button";
import { Headphones, Phone, Mail, Star, Users, CheckCircle, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ clients: 0, satisfaction: 0, projects: 0 });

  // Animated counter effect
  useEffect(() => {
    const animateNumber = (target: number, key: keyof typeof stats, duration: number = 2000) => {
      const start = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        
        setStats(prev => ({ ...prev, [key]: current }));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    };

    setTimeout(() => animateNumber(15000, 'clients'), 500);
    setTimeout(() => animateNumber(98, 'satisfaction'), 800);
    setTimeout(() => animateNumber(25000, 'projects'), 1100);
  }, []);

  return (
    <section className="relative min-h-[60vh] md:min-h-[75vh] bg-gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[60vh] md:min-h-[75vh] py-12 md:py-16">
          
          {/* Left Column - Main Content */}
          <div className="space-y-6 md:space-y-8 animate-fade-up">
            <div className="space-y-4 md:space-y-6">
              <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs md:text-sm font-medium">
                <Award className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                Excellence professionnelle
              </div>
              
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                Raccordement <span className="text-white/90">électrique</span> Enedis
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-light leading-relaxed">
                Service administratif professionnel
              </p>
              
              <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-xl font-body">
                Expert en raccordement électrique Enedis. Démarches administratives simplifiées : maison neuve, photovoltaïque, modification de branchement.
              </p>
            </div>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
              <Button 
                size="lg" 
                className="btn-luxury bg-white text-primary hover:bg-white/95 font-semibold px-6 py-4 md:px-8 md:py-6 text-base md:text-lg h-auto touch-target transform hover:scale-105 transition-luxury shadow-luxury w-full md:w-auto"
                onClick={() => navigate("/raccordement-enedis")}
              >
                Déposer ma demande
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="btn-luxury border-white/30 text-white hover:bg-white/10 font-semibold px-6 py-4 md:px-8 md:py-6 text-base md:text-lg h-auto touch-target backdrop-blur-md w-full md:w-auto"
              >
                <Headphones className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden sm:inline">Assistance technique</span>
                <span className="sm:hidden">09 77 40 50 60</span>
              </Button>
            </div>

            {/* Animated Statistics */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 pt-6 md:pt-8">
              <div className="text-center animate-slide-in" style={{ animationDelay: '0.5s' }}>
                <div className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {stats.clients.toLocaleString()}+
                </div>
                <div className="text-white/70 text-xs md:text-sm font-medium">Clients</div>
              </div>
              <div className="text-center animate-slide-in" style={{ animationDelay: '0.7s' }}>
                <div className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {stats.satisfaction}%
                </div>
                <div className="text-white/70 text-xs md:text-sm font-medium">Satisfaction</div>
              </div>
              <div className="text-center animate-slide-in" style={{ animationDelay: '0.9s' }}>
                <div className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {stats.projects.toLocaleString()}+
                </div>
                <div className="text-white/70 text-xs md:text-sm font-medium">Projets</div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-6 pt-4">
              <div className="flex items-center text-white/80 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-white" />
                Traitement sous 48h
              </div>
              <div className="flex items-center text-white/80 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-white" />
                Conformité réglementaire
              </div>
              <div className="flex items-center text-white/80 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-white" />
                Accompagnement dédié
              </div>
            </div>
          </div>

          {/* Mobile Contact Overlay / Desktop Card */}
          <div className="lg:flex justify-center items-center">
            <div className="lg:floating-card lg:glass-card p-6 md:p-8 rounded-xl lg:rounded-2xl w-full max-w-md animate-fade-up bg-white/5 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border border-white/10 lg:border-white/20" style={{ animationDelay: '1s' }}>
              <div className="text-center mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Phone className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="font-display text-lg md:text-2xl font-semibold text-white mb-1 md:mb-2">
                  Contact direct
                </h3>
                <p className="text-white/80 text-sm">
                  Assistance pour votre projet
                </p>
              </div>

              <div className="space-y-3 md:space-y-4">
                <a href="tel:0977405060" className="flex items-center p-3 md:p-4 rounded-lg md:rounded-xl bg-white/5 border border-white/10 touch-target hover:bg-white/10 transition-colors">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-white mr-3" />
                  <div>
                    <div className="text-white font-medium text-sm md:text-base">09 77 40 50 60</div>
                    <div className="text-white/60 text-xs">Lun-Ven 9h-18h</div>
                  </div>
                </a>
                
                <div className="flex items-center p-3 md:p-4 rounded-lg md:rounded-xl bg-white/5 border border-white/10">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-white mr-3" />
                  <div>
                    <div className="text-white font-medium text-sm md:text-base">Expert dédié</div>
                    <div className="text-white/60 text-xs">Réponse sous 2h</div>
                  </div>
                </div>

                <div className="flex items-center justify-center pt-2 md:pt-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-white fill-current" />
                    ))}
                  </div>
                  <span className="text-white/80 text-xs md:text-sm ml-2">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;