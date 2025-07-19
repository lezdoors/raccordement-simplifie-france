import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="w-full bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary">
                Raccordement Enedis
              </h1>
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-foreground hover:text-primary transition-colors">
              Services
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
              Comment ça marche
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>

          {/* Contact Info & CTA */}
          <div className="flex items-center space-x-4">
            {/* Phone Number - Hidden on small screens */}
            <div className="hidden lg:flex items-center text-sm text-muted-foreground">
              <Phone className="h-4 w-4 mr-2" />
              <span>01 23 45 67 89</span>
            </div>
            
            {/* CTA Button */}
            <Button variant="default" size="sm">
              Demande rapide
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;