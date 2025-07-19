import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-xl font-bold text-foreground">raccordement.net</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Accueil
              </a>
              <a href="#" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Services
              </a>
              <a href="#" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Tarifs
              </a>
              <a href="#" className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <Button variant="hero" size="lg">
              Démarrer ma demande
            </Button>
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