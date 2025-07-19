import { Zap, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const FooterSection = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-primary mr-2" />
              <h3 className="text-xl font-bold">raccordement.net</h3>
            </div>
            <p className="text-background/70 text-sm">
              Votre partenaire de confiance pour tous vos raccordements électriques. 
              Service rapide, transparent et professionnel.
            </p>
            <Button variant="secondary" size="sm">
              Demande express
            </Button>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-primary transition-colors">Raccordement particuliers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Raccordement professionnels</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Raccordement industriels</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Modification de branchement</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Augmentation de puissance</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Guide raccordement</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Simulateur de coût</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Suivi de dossier</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-background/70">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-primary" />
                <span>09 69 32 18 00</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-primary" />
                <span>contact@raccordement.net</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                <span>Service client France</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-background/70">
            © 2024 raccordement.net. Tous droits réservés.
          </p>
          <div className="flex space-x-6 text-sm text-background/70 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-primary transition-colors">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;