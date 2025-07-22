import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertCircle, TrendingUp, Users } from "lucide-react";
const UrgencySection = () => {
  const urgencyIndicators = [{
    icon: Clock,
    text: "Délai Enedis actuel: 8-12 semaines",
    type: "warning"
  }, {
    icon: TrendingUp,
    text: "Demandes en hausse de 40% cette année",
    type: "alert"
  }, {
    icon: Users,
    text: "127 dossiers traités cette semaine",
    type: "success"
  }];
  const limitedOffers = ["Traitement prioritaire en 48h (au lieu de 72h)", "Accompagnement personnalisé inclus", "Révision gratuite de votre dossier", "Garantie satisfait ou remboursé"];
  return (
    <section className="py-8 bg-orange-50 border-b">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {urgencyIndicators.map((indicator, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg border">
              <indicator.icon className={`w-5 h-5 ${
                indicator.type === 'warning' ? 'text-orange-500' :
                indicator.type === 'alert' ? 'text-red-500' : 'text-green-500'
              }`} />
              <span className="text-sm font-medium">{indicator.text}</span>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Badge variant="destructive" className="mb-2">
            <AlertCircle className="w-4 h-4 mr-2" />
            Offre limitée
          </Badge>
          <h3 className="text-xl font-bold mb-4">Accélérez votre raccordement dès maintenant</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {limitedOffers.map((offer, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-white rounded border">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{offer}</span>
              </div>
            ))}
          </div>
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
            Commencer mon dossier maintenant
          </Button>
        </div>
      </div>
    </section>
  );
};
export default UrgencySection;