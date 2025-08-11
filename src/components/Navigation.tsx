import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import logoImage from "@/assets/portail-raccordement-logo.png";
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const scrollToForm = () => {
    const start = document.getElementById('demarrer') || document.getElementById('form');
    if (start) {
      start.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/commencer');
    }
  };
  return <nav className={`sticky top-0 z-[60] text-white transition-colors duration-300 ${isScrolled ? 'bg-primary/95 shadow-lg backdrop-blur-md' : 'bg-gradient-to-r from-primary to-primary/90'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-[72px]">
          <a href="/" className="flex items-center cursor-pointer justify-center md:justify-start px-3">
            <img 
              src={logoImage} 
              alt="Portail Raccordement" 
              width="200" 
              height="56" 
              className="object-contain h-auto w-auto max-h-[56px] md:max-h-[72px] transition-transform hover:scale-105"
            />
            <span className="ml-3 font-display text-white font-semibold tracking-wide text-base sm:text-lg md:text-xl whitespace-nowrap">PORTAIL RACCORDEMENT</span>
          </a>
          
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

          <div className="hidden sm:flex items-center space-x-6">
            <div className="text-right">
              <a 
                href="tel:0970709570" 
                className="inline-flex items-center gap-2 text-base md:text-lg font-bold text-white hover:text-white/90 transition-colors touch-feedback"
                aria-label="Appeler le 09 70 70 95 70"
              >
                <Phone className="h-5 w-5" />
                09 70 70 95 70
              </a>
              <p className="text-xs text-white/80">Lun–Ven 8h–18h</p>
            </div>
            <Button 
              size="lg" 
              onClick={scrollToForm} 
              className={`btn-cta-primary hover-scale ${isMobile ? 'w-auto' : ''}`}
            >
              Démarrer ma demande
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-3 rounded-md text-white hover:text-white/80 hover:bg-white/10 touch-target touch-feedback" aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && <div className="md:hidden border-t border-white/20 mobile-safe-area">
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
              <a 
                href="tel:0970709570" 
                className="inline-flex items-center justify-center gap-2 text-lg font-bold text-white hover:text-white/90 transition-colors touch-target touch-feedback"
                aria-label="Appeler le 09 70 70 95 70"
              >
                <Phone className="h-5 w-5" />
                09 70 70 95 70
              </a>
              <p className="text-xs text-white/80 mt-1">Lun–Ven 8h–18h</p>
            </div>
            <Button 
              onClick={() => {
                scrollToForm();
                setIsMenuOpen(false);
              }} 
              className="w-full btn-cta-primary mobile-button touch-feedback"
            >
              Démarrer ma demande
            </Button>
            </div>
          </div>
        </div>}

    </nav>;
};
export default Navigation;