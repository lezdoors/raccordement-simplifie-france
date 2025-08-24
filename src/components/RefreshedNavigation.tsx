import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import logoImage from "@/assets/portail-raccordement-logo.png";

const RefreshedNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const scrollToForm = () => {
    const start = document.getElementById('demarrer') || document.getElementById('form');
    if (start) {
      start.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/raccordement-enedis');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-[60] transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-soft border-b border-border/50' 
        : 'bg-gradient-hero'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="flex justify-between items-center h-18 md:h-20">
          
          {/* Logo */}
          <a href="/" className="flex items-center justify-center md:justify-start">
            <img 
              src={logoImage} 
              alt="Portail Raccordement" 
              width="180" 
              height="50" 
              className="object-contain h-auto w-auto max-h-8 md:max-h-10 transition-transform hover:scale-105"
            />
          </a>
          
          {/* Desktop Navigation - Clean and minimal */}
          <div className="hidden lg:flex items-center space-x-10">
            <a href="/contact" className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
              isScrolled ? 'text-foreground hover:text-primary hover:bg-muted/50' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}>
              Contact
            </a>
            <a href="/faq" className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
              isScrolled ? 'text-foreground hover:text-primary hover:bg-muted/50' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}>
              FAQ
            </a>
            <a href="/a-propos" className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
              isScrolled ? 'text-foreground hover:text-primary hover:bg-muted/50' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}>
              À propos
            </a>
          </div>

          {/* Contact & CTA */}
          <div className="hidden sm:flex items-center space-x-6">
            <div className="text-right">
              <a 
                href="tel:0970709570" 
                className={`inline-flex items-center gap-2 text-base font-semibold transition-colors ${
                  isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/90'
                }`}
                aria-label="Appeler le 09 70 70 95 70"
              >
                <Phone className="h-4 w-4" />
                09 70 70 95 70
              </a>
              <p className={`text-xs ${isScrolled ? 'text-muted-foreground' : 'text-white/70'}`}>
                Lun–Ven 8h–18h
              </p>
            </div>
            
            <Button 
              onClick={scrollToForm} 
              className={`btn-cta-primary px-6 py-2.5 rounded-xl font-medium hover-scale ${isMobile ? 'w-auto' : ''}`}
            >
              Démarrer ma demande
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`p-3 rounded-xl transition-colors ${
                isScrolled ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/10'
              }`} 
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Cleaner design */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10">
          <div className="px-6 pt-4 pb-6 space-y-3 bg-white/95 backdrop-blur-lg">
            <a href="/" className="block px-4 py-3 text-foreground hover:bg-muted rounded-xl transition-colors font-medium">
              Accueil
            </a>
            <a href="/contact" className="block px-4 py-3 text-foreground hover:bg-muted rounded-xl transition-colors font-medium">
              Contact
            </a>
            <a href="/faq" className="block px-4 py-3 text-foreground hover:bg-muted rounded-xl transition-colors font-medium">
              FAQ
            </a>
            <a href="/a-propos" className="block px-4 py-3 text-foreground hover:bg-muted rounded-xl transition-colors font-medium">
              À propos
            </a>
            
            {/* Mobile contact & CTA */}
            <div className="px-4 py-6 border-t border-border/20 mt-4 space-y-4">
              <div className="text-center">
                <a 
                  href="tel:0970709570" 
                  className="inline-flex items-center justify-center gap-2 text-lg font-semibold text-foreground hover:text-primary transition-colors"
                  aria-label="Appeler le 09 70 70 95 70"
                >
                  <Phone className="h-5 w-5" />
                  09 70 70 95 70
                </a>
                <p className="text-sm text-muted-foreground mt-1">Lun–Ven 8h–18h</p>
              </div>
              
              <Button 
                onClick={() => {
                  scrollToForm();
                  setIsMenuOpen(false);
                }} 
                className="w-full btn-cta-primary py-3 rounded-xl font-medium"
              >
                Démarrer ma demande
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default RefreshedNavigation;