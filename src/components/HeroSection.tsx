import { Button } from "@/components/ui/button";
import { Headphones, Phone, Mail, Star, Users, CheckCircle, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MiniForm } from "./MiniForm";
const HeroSection = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    clients: 0,
    satisfaction: 0,
    projects: 0
  });

  // Animated counter effect
  useEffect(() => {
    const animateNumber = (target: number, key: keyof typeof stats, duration: number = 2000) => {
      const start = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        setStats(prev => ({
          ...prev,
          [key]: current
        }));
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
  return <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
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
                Partenaire N°1 en France
              </div>
              
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight text-center lg:text-left">
                Raccordement <span className="text-slate-100">électrique</span> Enedis
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
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-6 text-lg h-auto transform hover:scale-105 transition-all duration-300" onClick={() => navigate("/raccordement-enedis")}>
                Déposer ma demande
              </Button>
              
              <Button variant="outline" size="lg" className="bg-white text-primary border-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg h-auto">
                <Headphones className="mr-2 h-5 w-5" />
                Contacter un expert
              </Button>
            </div>

            {/* Animated Statistics */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center animate-slide-in" style={{
              animationDelay: '0.5s'
            }}>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stats.clients.toLocaleString()}+
                </div>
                <div className="text-white/70 text-sm font-medium">Clients accompagnés</div>
              </div>
              <div className="text-center animate-slide-in" style={{
              animationDelay: '0.7s'
            }}>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stats.satisfaction}%
                </div>
                <div className="text-white/70 text-sm font-medium">Satisfaction client</div>
              </div>
              <div className="text-center animate-slide-in" style={{
              animationDelay: '0.9s'
            }}>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stats.projects.toLocaleString()}+
                </div>
                <div className="text-white/70 text-sm font-medium">Projets réalisés</div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center text-white/80 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-accent" />
                Traitement sous 48h
              </div>
              <div className="flex items-center text-white/80 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-accent" />
                Conformité réglementaire
              </div>
              <div className="flex items-center text-white/80 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-accent" />
                Accompagnement dédié
              </div>
            </div>
          </div>

          {/* Right Column - Mini Form */}
          <div className="lg:flex justify-center items-center hidden">
            <MiniForm />
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;