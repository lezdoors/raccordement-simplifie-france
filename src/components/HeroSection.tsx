import { Button } from "@/components/ui/button";
import { Headphones, Phone, Mail, Star, Users, CheckCircle, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const navigate = useNavigate();

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
  const stats = {
    clients: 15000,
    satisfaction: 98,
    projects: 25000
  };
  return <section className="relative min-h-[85vh] bg-gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/10 to-transparent"></div>
      </div>
      
      {/* Centered container with optimized layout */}
      <div className="relative mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 h-full">
        <div className="flex lg:gap-8 xl:gap-12 items-center justify-center min-h-[85vh] py-12 lg:py-16">
          
          {/* Main Content - Moved right on desktop, more padding on mobile */}
          <div className="flex-1 lg:max-w-xl lg:ml-24 xl:ml-32 space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium">
                <Award className="w-4 h-4 mr-2" />
                Partenaire N°1 en France
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight text-center lg:text-left">
                Raccordement Électrique Enedis
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light leading-relaxed text-center lg:text-left">
                Votre expert national pour toutes vos démarches Enedis.
              </p>
              
              <p className="text-lg text-white/80 leading-relaxed max-w-xl font-body">
                Maison neuve, panneaux solaires, modification de branchement : nous simplifions le processus 
                avec un accompagnement personnalisé.
              </p>
            </div>

            {/* CTA with more breathing room on mobile */}
            <div className="flex justify-center lg:justify-start px-2 sm:px-0">
              <button 
                className="h-14 px-8 py-4 mx-4 sm:mx-0 text-lg font-semibold flex items-center justify-center btn-cta-animated w-full sm:w-auto sm:min-w-[280px] bg-accent text-white border-2 border-accent hover:bg-accent/90 transition-all duration-300 rounded-lg touch-feedback"
                onClick={scrollToForm}
              >
                Démarrer ma demande
              </button>
            </div>

            {/* Statistics */}
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

          {/* Contact Card - Reduced left margin to close gap */}
          <div className="lg:flex items-center hidden lg:ml-4 xl:ml-6">
            <div className="floating-card glass-card p-8 rounded-2xl w-full max-w-sm xl:max-w-md">
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
                    <div className="text-white font-medium">01 89 70 12 00</div>
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
    </section>;
};
export default HeroSection;