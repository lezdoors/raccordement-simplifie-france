import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile-First Sticky Header */}
      <nav className="mobile-header bg-primary text-white z-50">
        <div className="px-4 h-16 flex items-center justify-between">
          {/* Mobile Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <div className="h-8 w-auto mr-2">
              <img 
                src="/lovable-uploads/55f86fce-e7c0-4a55-95e2-4c1c19dcbc0f.png" 
                alt="Portail" 
                className="h-full w-auto object-contain brightness-0 invert" 
              />
            </div>
            <span className="text-sm font-semibold">Portail Enedis</span>
          </div>
          
          {/* Mobile Phone Number - Prominent Display */}
          <div className="flex items-center">
            <a href="tel:0970709570" className="flex items-center text-white hover:text-white/80 transition-colors">
              <Phone className="w-4 h-4 mr-1" />
              <span className="text-sm font-semibold">09 70 70 95 70</span>
            </a>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="ml-3 p-2 rounded-md hover:bg-white/10 transition-colors btn-mobile"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Header - Hidden on Mobile */}
        <div className="hidden lg:block bg-gradient-to-r from-primary to-primary/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Desktop Logo */}
              <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
                <div className="h-12 w-auto mr-4">
                  <img 
                    src="/lovable-uploads/55f86fce-e7c0-4a55-95e2-4c1c19dcbc0f.png" 
                    alt="Portail en ligne - Raccordement électrique" 
                    className="h-full w-auto object-contain brightness-0 invert" 
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Portail en ligne</h1>
                  <p className="text-sm text-white/80">Service Raccordement Électrique</p>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <div className="flex items-center space-x-8">
                <a href="/contact" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Contact
                </a>
                <a href="/faq" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  FAQ
                </a>
                <a href="/a-propos" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  À propos
                </a>
              </div>

              {/* Desktop Contact Info & CTA */}
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <Phone className="w-4 h-4" />
                    <span>Appelez nous au</span>
                  </div>
                  <p className="text-lg font-bold text-white">09 70 70 95 70</p>
                  <p className="text-xs text-white/80">Lun-Ven 9h-19h</p>
                </div>
                
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/raccordement-enedis")}
                  className="bg-white text-primary hover:bg-white/90 font-semibold border-0"
                >
                  Démarrer ma demande
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-white/20 bg-primary/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            <a href="/" className="text-white hover:text-white/80 block px-3 py-3 rounded-md text-base font-medium touch-target">
              Accueil
            </a>
            <a href="/contact" className="text-white hover:text-white/80 block px-3 py-3 rounded-md text-base font-medium touch-target">
              Contact
            </a>
            <a href="/faq" className="text-white hover:text-white/80 block px-3 py-3 rounded-md text-base font-medium touch-target">
              FAQ
            </a>
            <a href="/a-propos" className="text-white hover:text-white/80 block px-3 py-3 rounded-md text-base font-medium touch-target">
              À propos
            </a>
          </div>
        </div>
      )}

      {/* Bottom Action Bar for Mobile */}
      <div className="bottom-action-bar lg:hidden">
        <Button 
          onClick={() => navigate("/raccordement-enedis")}
          className="w-full bg-primary text-white hover:bg-primary/90 font-semibold py-4 text-base"
          size="lg"
        >
          Démarrer ma demande
        </Button>
      </div>
    </>
  );
};
export default Navigation;