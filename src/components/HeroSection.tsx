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
  return <section className="relative min-h-[82vh] sm:min-h-[92vh] bg-gradient-hero hero-animated overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/10 to-transparent"></div>
      </div>
      
      {/* Centered container with optimized layout */}
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 h-full">
        {/* Radial focus behind left column */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="hero-vignette" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 xl:gap-12 items-center min-h-[82vh] sm:min-h-[92vh] sm:max-h-[720px] py-10 lg:py-14">
          {/* Left column: text */}
          <div className="space-y-8 lg:col-span-7">
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

              {/* Confidence strip under H1 */}
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> 100% sécurisé</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Traitement sous 48h</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Conformité réglementaire</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Accompagnement dédié</li>
              </ul>
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
                aria-label="Démarrer ma demande"
              >
                Démarrer ma demande
              </button>
            </div>

            {/* Confidence strip moved under the heading */}
          </div>

          {/* Right column: Mini form + Premium help */}
          <div className="w-full lg:col-span-5">
            <div className="floating-card glass-card p-6 rounded-2xl w-full max-w-sm xl:max-w-md ring-1 ring-white/20 mx-auto lg:mx-0">
              <h3 className="text-lg font-semibold text-white">Estimation rapide</h3>
              <form
                onSubmit={(e) => { e.preventDefault(); navigate('/raccordement-enedis'); }}
                className="mt-4 grid grid-cols-1 gap-3"
                aria-label="Formulaire d'estimation rapide"
              >
                <input
                  className="h-11 rounded-lg bg-white/90 px-3 text-foreground"
                  placeholder="Code postal"
                  aria-label="Code postal"
                />
                <input
                  className="h-11 rounded-lg bg-white/90 px-3 text-foreground"
                  placeholder="Commune"
                  aria-label="Commune"
                />
                <select
                  className="h-11 rounded-lg bg-white/90 px-3 text-foreground"
                  aria-label="Type de demande"
                  defaultValue=""
                >
                  <option value="" disabled>Type de demande</option>
                  <option>Raccordement provisoire</option>
                  <option>Raccordement définitif</option>
                  <option>Augmentation de puissance</option>
                  <option>Raccordement collectif</option>
                </select>
                <button type="submit" className="h-11 rounded-lg btn-cta-primary font-medium">
                  Commencer
                </button>
              </form>

              {/* Premium help */}
              <div className="mt-4 rounded-xl bg-white/5 p-4">
                <div className="text-sm text-white/80">Contact Premium (Lun–Ven 8h–18h)</div>
                <a href="tel:0970709570" className="mt-1 block text-xl font-semibold text-white hover:underline" aria-label="Appeler le 09 70 70 95 70">09 70 70 95 70</a>
                <div className="mt-1 text-xs text-white/70">Réponse sous 2h • 4,9/5 (2 847 avis)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;