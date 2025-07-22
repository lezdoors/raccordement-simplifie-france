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
  return;
};
export default UrgencySection;