import { Button } from "@/components/ui/button";
import { Headphones, Phone, Mail, Star, Users, CheckCircle, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RefreshedHeroSection = () => {
  const navigate = useNavigate();

  const scrollToForm = () => {
    const start = document.getElementById('demarrer') || document.getElementById('form');
    if (start) {
      start.scrollIntoView({ behavior: 'smooth' });
    } else {
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

  return (
    <section className="relative min-h-[90vh] bg-gradient-hero overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-soft/5 to-transparent"></div>
      </div>
      
      {/* Generous container with more white space */}
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-16 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-16 xl:gap-20 items-center min-h-[90vh] py-16 lg:py-20">
          
          {/* Left column: Enhanced with more breathing room */}
          <div className="space-y-12 lg:col-span-7">
            <div className="space-y-8">
              {/* Lighter, more minimal badge */}
              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/8 backdrop-blur-sm border border-white/15 text-white/85 text-sm font-medium">
                  <Award className="w-4 h-4 mr-2 text-warm" />
                  Partenaire de confiance
                </div>
              </div>
              
              {/* Enhanced typography with better spacing */}
              <h1 className="heading-1 text-white text-center lg:text-left">
                Raccordement Électrique 
                <span className="block text-white/90 mt-2">Simple & Rapide</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed text-center lg:text-left max-w-2xl">
                Simplifiez vos démarches Enedis avec notre accompagnement expert pour 
                <span className="text-white font-medium"> maisons neuves, solaire et modifications</span>.
              </p>

              {/* Trust indicators with more space */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 pt-4">
                <div className="flex items-center text-white/75 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-warm" /> 
                  Traitement 48h
                </div>
                <div className="flex items-center text-white/75 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-warm" /> 
                  100% conforme
                </div>
                <div className="flex items-center text-white/75 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-warm" /> 
                  Expert dédié
                </div>
              </div>
            </div>

            {/* Refined stats with more white space */}
            <div className="grid grid-cols-3 gap-8 pt-4">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-light text-white mb-2">
                  {stats.clients.toLocaleString()}+
                </div>
                <div className="text-white/60 text-sm font-medium">Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-light text-white mb-2">
                  {stats.satisfaction}%
                </div>
                <div className="text-white/60 text-sm font-medium">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-light text-white mb-2">
                  {stats.projects.toLocaleString()}+
                </div>
                <div className="text-white/60 text-sm font-medium">Projets</div>
              </div>
            </div>

            {/* Modern CTA with generous spacing */}
            <div className="pt-4 flex justify-center lg:justify-start">
              <button
                className="btn-cta-primary text-lg font-medium px-10 py-4 rounded-2xl hover-scale"
                onClick={scrollToForm}
                aria-label="Démarrer ma demande"
              >
                Démarrer ma demande
              </button>
            </div>
          </div>

          {/* Right column: Cleaner contact card */}
          <div className="w-full lg:col-span-5 mt-16 lg:mt-0">
            <div className="bg-white/3 backdrop-blur-sm border border-white/10 rounded-3xl p-8 w-full max-w-md mx-auto lg:mx-0 shadow-soft">
              <h3 className="text-xl font-medium text-white mb-6 text-center">Estimation gratuite</h3>
              
              <form
                onSubmit={(e) => { e.preventDefault(); navigate('/raccordement-enedis'); }}
                className="space-y-4"
                aria-label="Formulaire d'estimation rapide"
              >
                <input
                  className="w-full h-12 rounded-xl bg-white/90 px-4 text-foreground placeholder:text-muted-foreground border-0 focus:ring-2 focus:ring-warm transition-all"
                  placeholder="Code postal"
                  aria-label="Code postal"
                />
                <input
                  className="w-full h-12 rounded-xl bg-white/90 px-4 text-foreground placeholder:text-muted-foreground border-0 focus:ring-2 focus:ring-warm transition-all"
                  placeholder="Commune"
                  aria-label="Commune"
                />
                <select
                  className="w-full h-12 rounded-xl bg-white/90 px-4 text-foreground border-0 focus:ring-2 focus:ring-warm transition-all"
                  aria-label="Type de demande"
                  defaultValue=""
                >
                  <option value="" disabled>Type de demande</option>
                  <option>Raccordement provisoire</option>
                  <option>Raccordement définitif</option>
                  <option>Augmentation de puissance</option>
                  <option>Raccordement collectif</option>
                </select>
                <button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-warm text-white font-medium hover:bg-warm-light transition-colors"
                >
                  Commencer
                </button>
              </form>

              {/* Minimal contact info */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-white/60 text-sm mb-2">Contact direct</p>
                <a href="tel:0970709570" className="text-lg font-medium text-white hover:text-warm transition-colors" aria-label="Appeler le 09 70 70 95 70">
                  09 70 70 95 70
                </a>
                <p className="text-white/50 text-xs mt-1">Lun–Ven 8h–18h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RefreshedHeroSection;