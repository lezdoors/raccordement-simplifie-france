import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertCircle, TrendingUp, Users } from "lucide-react";

const UrgencySection = () => {
  const urgencyIndicators = [
    {
      icon: Clock,
      text: "Délai Enedis actuel: 8-12 semaines",
      type: "warning"
    },
    {
      icon: TrendingUp,
      text: "Demandes en hausse de 40% cette année",
      type: "alert"
    },
    {
      icon: Users,
      text: "127 dossiers traités cette semaine",
      type: "success"
    }
  ];

  const limitedOffers = [
    "Traitement prioritaire en 48h (au lieu de 72h)",
    "Accompagnement personnalisé inclus",
    "Révision gratuite de votre dossier",
    "Garantie satisfait ou remboursé"
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Urgency Indicators */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="destructive" className="px-3 py-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                Attention
              </Badge>
              <span className="text-sm text-muted-foreground">Mis à jour il y a 2h</span>
            </div>
            
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
              Délais Enedis en forte augmentation
            </h3>
            
            <div className="space-y-4">
              {urgencyIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    indicator.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                    indicator.type === 'alert' ? 'bg-red-100 text-red-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <indicator.icon className="w-5 h-5" />
                  </div>
                  <span className="text-foreground font-medium">{indicator.text}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important :</strong> En raison de l'affluence actuelle, nous recommandons de 
                démarrer votre demande dès maintenant pour éviter les retards supplémentaires.
              </p>
            </div>
          </div>

          {/* Right Column - Limited Time Offer */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-orange-200">
            <div className="text-center mb-6">
              <Badge variant="secondary" className="mb-3 bg-orange-100 text-orange-800">
                Offre limitée - Janvier 2024
              </Badge>
              <h4 className="text-xl lg:text-2xl font-bold text-foreground mb-2">
                Service Express Gratuit
              </h4>
              <p className="text-muted-foreground">
                Profitez de nos services premium sans supplément
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {limitedOffers.map((offer, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-foreground">{offer}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-4 text-white text-center mb-6">
              <div className="text-2xl font-bold mb-1">Économisez 297€</div>
              <div className="text-sm text-white/90">Sur les frais de service express</div>
            </div>

            <Button 
              size="lg" 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
            >
              Profiter de l'offre maintenant
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-xs text-muted-foreground">
                Offre valable jusqu'au 31 janvier 2024 ou dans la limite des places disponibles
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UrgencySection;