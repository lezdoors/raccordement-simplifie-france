import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Clock } from "lucide-react";

export const SupportSection = () => {
  const handleGetHelp = () => {
    // Scroll to contact form or open WhatsApp - can be customized later
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full mt-12 mb-8">
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-foreground">
                Besoin d'aide avec le formulaire ?
              </h3>
            </div>
            <p className="text-muted-foreground mb-4 max-w-2xl">
              Notre équipe est disponible. Appelez le 09 70 70 95 70 ou écrivez à contact@raccordement-elec.fr
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Réponse sous 2h en jours ouvrés</span>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <Button 
              onClick={handleGetHelp}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3"
            >
              Obtenir de l'aide
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};