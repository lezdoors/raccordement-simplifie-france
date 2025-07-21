import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <div className="h-12 md:h-16 w-auto mr-3 md:mr-4">
              <img 
                src="/lovable-uploads/55f86fce-e7c0-4a55-95e2-4c1c19dcbc0f.png" 
                alt="Portail en ligne - Raccordement électrique" 
                className="h-full w-auto object-contain brightness-0 invert" 
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-white">Portail en ligne</h1>
              <p className="text-xs md:text-sm text-white/80">Service Raccordement</p>
            </div>
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

          {/* Contact Info & CTA */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <a href="tel:0977405060" className="text-right hover:text-white/90 transition-colors">
              <div className="flex items-center gap-2 text-sm text-white/90">
                <Phone className="w-4 h-4" />
                <span className="hidden lg:inline">Appelez nous au</span>
              </div>
              <p className="text-lg font-bold text-white">09 77 40 50 60</p>
              <p className="text-xs text-white/80 hidden lg:block">Lun-Ven 9h-19h</p>
            </a>
            
            <Button 
              variant="secondary"
              size="lg"
              onClick={() => navigate("/raccordement-enedis")}
              className="bg-white text-primary hover:bg-white/90 font-semibold touch-target px-4 lg:px-6"
            >
              <span className="hidden lg:inline">Démarrer ma demande</span>
              <span className="lg:hidden">Demande</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <a href="tel:0977405060" className="text-white/90 hover:text-white transition-colors touch-target">
              <Phone className="h-5 w-5" />
            </a>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white/80 hover:bg-white/10 touch-target"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary/95">
            <a href="/" className="text-white hover:text-white/80 block px-3 py-2 rounded-md text-base font-medium">
              Accueil
            </a>
            <a href="/contact" className="text-white hover:text-white/80 block px-3 py-2 rounded-md text-base font-medium">
              Contact
            </a>
            <a href="/faq" className="text-white hover:text-white/80 block px-3 py-2 rounded-md text-base font-medium">
              FAQ
            </a>
            <a href="/a-propos" className="text-white hover:text-white/80 block px-3 py-2 rounded-md text-base font-medium">
              À propos
            </a>
            <div className="px-3 py-4 border-t border-white/20">
              <a href="tel:0977405060" className="block text-center mb-3 touch-target hover:bg-white/5 rounded-lg py-2">
                <p className="text-sm text-white/90">Appelez nous au</p>
                <p className="text-lg font-bold text-white">09 77 40 50 60</p>
                <p className="text-xs text-white/70">Lun-Ven 9h-19h</p>
              </a>
              <Button 
                onClick={() => navigate("/raccordement-enedis")}
                className="w-full bg-white text-primary hover:bg-white/90 touch-target"
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

export default Navigation;