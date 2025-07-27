import { Button } from "@/components/ui/button";
import { Headphones, Phone, Mail, Star, CheckCircle, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const OptimizedHeroSection = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  const scrollToForm = () => {
    const formElement = document.getElementById('form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If no form on current page, navigate to form page
      navigate('/raccordement-enedis');
    }
  };

  const handleContactExpert = () => {
    // On mobile, call the number; on desktop, scroll to form
    if (window.innerWidth < 768) {
      window.location.href = 'tel:0970709570';
    } else {
      scrollToForm();
    }
  };

  // Simplified stats without heavy animations
  const stats = {
    clients: 15000,
    satisfaction: 98,
    projects: 25000
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-20">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium">
                  <Award className="w-4 h-4 mr-2" />
                  Partenaire N°1 en France
                </div>
                
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight text-center lg:text-left">
                  Raccordement <span className="text-slate-100">électrique</span> Enedis
                </h1>
                
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light leading-relaxed text-center lg:text-left">
                  Service administratif professionnel
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/10 to-transparent"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-20">
          
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium">
                <Award className="w-4 h-4 mr-2" />
                Partenaire N°1 en France
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight text-center lg:text-left">
                Raccordement <span className="text-slate-100">électrique</span> Enedis
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light leading-relaxed text-center lg:text-left">
                Service administratif professionnel
              </p>
              
              <p className="text-lg text-white/80 leading-relaxed max-w-xl font-body">
                Service expert en raccordement électrique Enedis pour toute la France. Nous gérons vos 
                démarches administratives : maison neuve, photovoltaïque, modification de branchement. 
                Processus simplifié, suivi personnalisé et conformité garantie.
              </p>
            </div>

            {/* Premium CTA Buttons - Mobile optimized with min 44px touch targets */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="mobile-button bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-6 text-lg min-h-[44px] h-auto transform hover:scale-105 transition-all duration-300 touch-feedback mobile-optimized" 
                onClick={scrollToForm}
              >
                Démarrer ma demande
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleContactExpert}
                className="mobile-button bg-white text-primary border-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg min-h-[44px] h-auto touch-feedback"
              >
                <Headphones className="mr-2 h-5 w-5" />
                Contacter un expert
              </Button>
            </div>

            {/* Static Statistics - No animation for better performance */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stats.clients.toLocaleString()}+
                </div>
                <div className="text-white/70 text-sm font-medium">Clients accompagnés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stats.satisfaction}%
                </div>
                <div className="text-white/70 text-sm font-medium">Satisfaction client</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stats.projects.toLocaleString()}+
                </div>
                <div className="text-white/70 text-sm font-medium">Projets réalisés</div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
              <div className="flex items-center text-white/80 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-accent" />
                100% sécurisé
              </div>
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

          {/* Right Column - Contact Card - Hidden on mobile for performance */}
          <div className="lg:flex justify-center items-center hidden">
            <div className="floating-card glass-card p-8 rounded-2xl w-full max-w-md">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                  <Phone className="w-5 h-5 text-accent mr-3" />
                  <div>
                    <div className="text-white font-medium">09 77 40 50 60</div>
                    <div className="text-white/60 text-xs">Lun-Ven 9h-18h</div>
                  </div>
                </div>
                
                <div className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <Mail className="w-5 h-5 text-accent mr-3" />
                  <div>
                    <div className="text-white font-medium">Expert dédié</div>
                    <div className="text-white/60 text-xs">Réponse sous 2h</div>
                  </div>
                </div>

                <div className="flex items-center justify-center pt-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-accent fill-current" />)}
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

export default OptimizedHeroSection;