import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoFull from "@/assets/logo-full.svg";
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  return <header>
    <nav className="bg-gradient-to-r from-primary to-primary/90 text-white sticky top-0 z-50 shadow-lg" aria-label="Navigation principale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 md:h-28">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <div className="h-20 w-auto md:h-24">
              <img 
                src={logoFull}
                alt="Logo Raccordement Connect" 
                className="h-full w-auto object-contain" 
              />
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/contact" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors touch-target">
              Contact
            </Link>
            <a href="/blog" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors touch-target">
              Blog
            </a>
            <a href="/faq" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors touch-target">
              FAQ
            </a>
            <Link to="/a-propos" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors touch-target">
              À propos
            </Link>
          </div>

          {/* Contact Info & CTA */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-white/90">
                <Phone className="w-4 h-4" />
                <span>Appelez nous au</span>
              </div>
              <a href="tel:0970959570" className="text-lg font-bold text-white hover:text-white/90 transition-colors">09 70 95 95 70</a>
              <p className="text-xs text-white/80">Du lundi au vendredi de 9h à 19h</p>
            </div>
            
            <Button variant="default" size="lg" onClick={() => navigate("/raccordement-enedis")} className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold min-h-[48px] touch-target">
              Démarrer ma demande
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-3 rounded-md text-white hover:text-white/80 hover:bg-white/10 touch-target min-h-[48px] min-w-[48px]">
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && <div className="md:hidden border-t border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary/95">
            <Link to="/" className="text-white hover:text-white/80 block px-3 py-2 rounded-md text-base font-medium touch-target">
              Accueil
            </Link>
            <Link to="/contact" className="text-white hover:text-white/80 block px-3 py-2 rounded-md text-base font-medium touch-target">
              Contact
            </Link>
            <a href="/faq" className="text-white hover:text-white/80 block px-3 py-2 rounded-md text-base font-medium touch-target">
              FAQ
            </a>
            <Link to="/a-propos" className="text-white hover:text-white/80 block px-3 py-2 rounded-md text-base font-medium touch-target">
              À propos
            </Link>
            <div className="px-3 py-4 border-t border-white/20">
              <div className="text-center mb-3">
                <p className="text-sm text-white/90">Appelez nous au</p>
                <a href="tel:0970959570" className="text-lg font-bold text-white hover:text-white/90 transition-colors">09 70 95 95 70</a>
              </div>
              <Button onClick={() => navigate("/raccordement-enedis")} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 min-h-[48px] touch-target">
                Démarrer ma demande
              </Button>
            </div>
          </div>
        </div>}
    </nav>
  </header>;
};
export default Navigation;