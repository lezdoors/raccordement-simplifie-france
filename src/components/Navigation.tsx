import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  return <header>
    <nav className="bg-gradient-to-r from-primary to-primary/90 text-white sticky top-0 z-50 shadow-lg" aria-label="Navigation principale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="h-12 w-auto">
              <img 
                src="/lovable-uploads/18768f4f-172e-4185-83a0-540b1ab070ce.png" 
                alt="Logo Raccordement Connect" 
                className="h-full w-auto object-contain" 
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-bold text-white uppercase tracking-wide">
                VOTRE PARTENAIRE
              </div>
              <div className="text-xs text-white/90 italic font-light tracking-wider">
                Raccordement au réseau d'électricité d'Enedis
              </div>
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
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-white/90">
                <Phone className="w-4 h-4" />
                <span>Appelez nous au</span>
              </div>
              <a href="tel:0970709570" className="text-lg font-bold text-white hover:text-white/90 transition-colors">09 70 70 95 70</a>
              <p className="text-xs text-white/80">Du lundi au vendredi de 9h à 19h</p>
            </div>
            
            <Button variant="default" size="lg" onClick={() => navigate("/raccordement-enedis")} className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              Démarrer ma demande
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white/80 hover:bg-white/10">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && <div className="md:hidden border-t border-white/20">
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
              <div className="text-center mb-3">
                <p className="text-sm text-white/90">Appelez nous au</p>
                <a href="tel:0970709570" className="text-lg font-bold text-white hover:text-white/90 transition-colors">09 70 70 95 70</a>
              </div>
              <Button onClick={() => navigate("/raccordement-enedis")} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Démarrer ma demande
              </Button>
            </div>
          </div>
        </div>}
    </nav>
  </header>;
};
export default Navigation;