import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-primary to-primary/90 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-28">
          {/* Logo Section - Centered and enlarged */}
          <div className="flex items-center cursor-pointer justify-center md:justify-start" onClick={() => navigate("/")}>
            <div className="h-16 md:h-32 w-auto mr-3 md:mr-4">
              <img 
                src="/lovable-uploads/55f86fce-e7c0-4a55-95e2-4c1c19dcbc0f.png" 
                alt="raccordement-elec.fr" 
                className="h-full w-auto object-contain brightness-0 invert" 
                loading="lazy"
              />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">raccordement-elec.fr</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="/contact" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Contact
            </a>
            <a href="/blog" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Blog
            </a>
            <a href="/faq" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              FAQ
            </a>
            <a href="/a-propos" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              À propos
            </a>
          </div>

          {/* Contact Info & CTA - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-white/90">
                <Phone className="w-4 h-4" />
                <span>Appelez nous au</span>
              </div>
              <a href="tel:0977405060" className="text-lg font-bold text-white hover:text-white/90 transition-colors">
                09 77 40 50 60
              </a>
              <p className="text-xs text-white/80">Du lundi au vendredi de 9h à 19h</p>
            </div>
            
            <Button 
              variant="default" 
              size="lg" 
              onClick={() => navigate("/raccordement-enedis")} 
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              Démarrer ma demande
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="inline-flex items-center justify-center p-3 rounded-md text-white hover:text-white/80 hover:bg-white/10 touch-target touch-feedback"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/20 mobile-safe-area">
          <div className="px-4 pt-2 pb-3 space-y-1 bg-primary/95 backdrop-blur-md">
            <a href="/" className="mobile-nav-item text-white hover:text-white/80 touch-feedback">
              Accueil
            </a>
            <a href="/contact" className="mobile-nav-item text-white hover:text-white/80 touch-feedback">
              Contact
            </a>
            <a href="/faq" className="mobile-nav-item text-white hover:text-white/80 touch-feedback">
              FAQ
            </a>
            <a href="/a-propos" className="mobile-nav-item text-white hover:text-white/80 touch-feedback">
              À propos
            </a>
            <div className="px-4 py-6 border-t border-white/20 mt-4">
              <div className="text-center mb-4">
                <p className="text-sm text-white/90 mb-1">Appelez nous au</p>
                <a 
                  href="tel:0977405060" 
                  className="text-lg font-bold text-white hover:text-white/90 transition-colors touch-target"
                >
                  09 77 40 50 60
                </a>
                <p className="text-xs text-white/80 mt-1">Lun-Ven 9h-18h</p>
              </div>
              <Button 
                onClick={() => {
                  navigate("/raccordement-enedis");
                  setIsMenuOpen(false);
                }} 
                className="w-full mobile-button bg-white text-primary hover:bg-white/90 font-semibold touch-feedback"
              >
                Démarrer ma demande
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating CTA for mobile */}
      <div className="md:hidden fixed bottom-6 right-4 z-50">
        <Button 
          onClick={() => navigate("/raccordement-enedis")} 
          className="mobile-button bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-2xl rounded-full px-6 py-4 touch-feedback mobile-optimized"
          size="lg"
        >
          Démarrer ma demande
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;