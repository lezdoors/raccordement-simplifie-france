import { Button } from "@/components/ui/button";
import { Headphones, Phone, Mail, Star, Users, CheckCircle, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToForm = () => {
    const start = document.getElementById('demarrer') || document.getElementById('form');
    if (start) {
      start.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/commencer');
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
  return <section className="relative min-h-[82vh] sm:min-h-[92vh] bg-gradient-hero hero-animated overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/10 to-transparent"></div>
      </div>
      
      {/* Centered container with optimized layout */}
      <div className="relative mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 h-full">
        {/* Radial focus behind left column */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="hero-vignette" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 xl:gap-12 items-center min-h-[82vh] sm:min-h-[92vh] sm:max-h-[720px] py-10 lg:py-14">
          {/* Left column: text */}
          <div className="space-y-8 lg:max-w-xl">
            <div className="space-y-6">
              <div className="badge-premium text-lg px-6 py-3">
                <Award className="w-5 h-5 mr-2" />
                Partenaire N°1 en France
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                Raccordement Électrique Enedis
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light leading-relaxed">
                Votre expert national pour toutes vos démarches : maison neuve, solaire, modification de branchement. Un accompagnement 100% conforme, rapide et clair.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2">
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
                <div className="text-white/70 text-sm font-medium">Satisfaction</div>
              </div>
              <div className="text-center col-span-2 sm:col-span-1">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stats.projects.toLocaleString()}+
                </div>
                <div className="text-white/70 text-sm font-medium">Projets réalisés</div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <button 
                className="btn-cta-primary btn-cta-animated hover-scale rounded-xl text-lg"
                onClick={scrollToForm}
              >
                Démarrer ma demande
              </button>
              <a 
                href="tel:0970709570" 
                aria-label="Appeler le 09 70 70 95 70"
                className="mt-3 block text-white/80 hover:text-white underline underline-offset-4"
              >
                Besoin d’aide ? Appelez le 09 70 70 95 70
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-start gap-6 pt-4">
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

          {/* Right column: Contact card */}
          <div className="w-full">
            <div className="floating-card glass-card p-8 rounded-2xl w-full max-w-sm xl:max-w-md ring-1 ring-white/20 mx-auto lg:mx-0">
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
                    <a href="tel:0970709570" className="text-white font-medium hover:underline" aria-label="Appeler le 09 70 70 95 70">09 70 70 95 70</a>
                    <div className="text-white/60 text-xs">Lun–Ven 8h–18h</div>
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
                  <span className="text-white/80 text-sm ml-2">4,9/5 (2 847 avis)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;