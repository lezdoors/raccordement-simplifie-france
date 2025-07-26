import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  return <nav className="bg-gradient-to-r from-primary to-primary/90 text-white sticky top-0 z-[60] shadow-lg backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo Section - Significantly enlarged */}
          <div className="flex items-center cursor-pointer justify-center md:justify-start" onClick={() => navigate("/")}>
            <div className="h-12 md:h-20 w-auto mr-3 md:mr-4 flex items-center justify-center">
              <img 
                src="https://kstugxtmghinprrpkrud.supabase.co/storage/v1/object/public/logo//Votre%20Partenaire%20(Logo)-3.png" 
                alt="Raccordement Connect - Votre Partenaire Raccordement Électrique" 
                className="w-[120px] md:w-[180px] h-auto transition-transform hover:scale-105"
              />
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

          {/* Contact Info & CTA - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
          <div className="text-center">
            <a 
              href="tel:0189701200" 
              className="text-lg font-bold text-white hover:text-white/90 transition-colors touch-feedback"
              aria-label="Appeler le 01 89 70 12 00"
            >
              📞 01 89 70 12 00
            </a>
            <p className="text-xs text-white/80">Du lundi au vendredi de 9h à 19h</p>
          </div>
          
          <Button 
            size="lg" 
            onClick={() => navigate("/commencer")} 
            className="font-bold px-4 py-2 rounded-lg text-[#1E1E1E] hover:opacity-90 transition-all duration-300"
            style={{ background: 'linear-gradient(90deg, #FFD77A 0%, #F2B736 100%)' }}
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
              href="tel:0189701200" 
              className="text-lg font-bold text-white hover:text-white/90 transition-colors touch-target touch-feedback"
              aria-label="Appeler le 01 89 70 12 00"
            >
              📞 01 89 70 12 00
            </a>
              <p className="text-xs text-white/80 mt-1">Lun-Ven 9h-18h</p>
            </div>
            <Button 
              onClick={() => {
                navigate("/commencer");
                setIsMenuOpen(false);
              }} 
              className="w-full font-bold px-4 py-2 rounded-lg text-[#1E1E1E] hover:opacity-90 transition-all duration-300 mobile-button touch-feedback"
              style={{ background: 'linear-gradient(90deg, #FFD77A 0%, #F2B736 100%)' }}
            >
              Démarrer ma demande
            </Button>
            </div>
          </div>
        </div>}

      {/* Floating CTA for mobile - Improved positioning */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <Button 
            onClick={() => navigate("/commencer")} 
            className="w-full font-bold px-6 py-4 rounded-xl text-[#1E1E1E] hover:opacity-90 transition-all duration-300 mobile-button shadow-2xl touch-feedback mobile-optimized" 
            size="lg"
            style={{ background: 'linear-gradient(90deg, #FFD77A 0%, #F2B736 100%)' }}
          >
            Démarrer ma demande
          </Button>
        </div>
      </div>
    </nav>;
};
export default Navigation;