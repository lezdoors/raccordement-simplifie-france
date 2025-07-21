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
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/10 to-transparent"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-20">
          
          {/* Left Column - Main Content */}
          <div className="space-y-8 animate-fade-up">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium">
                <Award className="w-4 h-4 mr-2" />
                Excellence McKinsey-niveau
              </div>
              
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                Raccordement <span className="gradient-text">électrique</span> Enedis
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/90 font-light leading-relaxed">
                Service administratif professionnel
              </p>
              
              <p className="text-lg text-white/80 leading-relaxed max-w-xl font-body">
                Service expert en raccordement électrique Enedis pour toute la France. Nous gérons vos 
                démarches administratives : maison neuve, photovoltaïque, modification de branchement. 
                Processus simplifié, suivi personnalisé et conformité garantie.
              </p>
            </div>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="btn-luxury bg-white text-primary hover:bg-white/95 font-semibold px-8 py-6 text-lg h-auto touch-target transform hover:scale-105 transition-luxury shadow-luxury"
                onClick={() => navigate("/raccordement-enedis")}
              >
                Déposer ma demande
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="btn-luxury border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg h-auto touch-target backdrop-blur-md"
              >
                <Headphones className="mr-2 h-5 w-5" />
                Assistance technique
              </Button>
            </div>

            {/* Animated Statistics */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center animate-slide-in" style={{ animationDelay: '0.5s' }}>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stats.clients.toLocaleString()}+
                </div>
                <div className="text-white/70 text-sm font-medium">Clients accompagnés</div>
              </div>
              <div className="text-center animate-slide-in" style={{ animationDelay: '0.7s' }}>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stats.satisfaction}%
                </div>
                <div className="text-white/70 text-sm font-medium">Satisfaction client</div>
              </div>
              <div className="text-center animate-slide-in" style={{ animationDelay: '0.9s' }}>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stats.projects.toLocaleString()}+
                </div>
                <div className="text-white/70 text-sm font-medium">Projets réalisés</div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center text-white/80 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-gold" />
                Traitement sous 48h
              </div>
              <div className="flex items-center text-white/80 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-gold" />
                Conformité réglementaire
              </div>
              <div className="flex items-center text-white/80 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-gold" />
                Accompagnement dédié
              </div>
            </div>
          </div>

          {/* Right Column - Floating Contact Card */}
          <div className="lg:flex justify-center items-center hidden">
            <div className="floating-card glass-card p-8 rounded-2xl w-full max-w-md animate-fade-up" style={{ animationDelay: '1s' }}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-luxury rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-white mb-2">
                  Contact Premium
                </h3>
                <p className="text-white/80 text-sm">
                  Assistance dédiée pour votre projet
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <Phone className="w-5 h-5 text-gold mr-3" />
                  <div>
                    <div className="text-white font-medium">09 77 40 50 60</div>
                    <div className="text-white/60 text-xs">Lun-Ven 9h-18h</div>
                  </div>
                </div>
                
                <div className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <Mail className="w-5 h-5 text-gold mr-3" />
                  <div>
                    <div className="text-white font-medium">Expert dédié</div>
                    <div className="text-white/60 text-xs">Réponse sous 2h</div>
                  </div>
                </div>

                <div className="flex items-center justify-center pt-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gold fill-current" />
                    ))}
                  </div>
                  <span className="text-white/80 text-sm ml-2">4.9/5 (2,847 avis)</span>
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