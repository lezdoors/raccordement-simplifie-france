import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            {/* Reserve space for logo - h-16 (64px) is better for professional headers */}
            <div className="h-16 w-auto mr-4">
              {/* Your logo will go here */}
              <div className="h-full w-32 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
                Logo Here
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">Service Raccordement Électricité</h1>
              <p className="text-sm text-muted-foreground">Votre partenaire raccordement au réseau d'électricité d'Enedis</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="/contact" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
              Contact
            </a>
            <a href="#" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
              Foire aux questions
            </a>
            <a href="/a-propos" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
              Qui sommes-nous
            </a>
          </div>

          {/* Contact Info */}
          <div className="hidden md:block text-right">
            <p className="text-sm text-muted-foreground">Appelez nous au</p>
            <p className="text-lg font-bold text-primary">01 88 61 50 00</p>
            <p className="text-xs text-muted-foreground">Du lundi au vendredi de 9h à 19h</p>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-accent"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
            <a href="#" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Accueil
            </a>
            <a href="#" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Services
            </a>
            <a href="#" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Tarifs
            </a>
            <a href="#" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Contact
            </a>
            <div className="px-3 py-2">
              <Button variant="hero" className="w-full">
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