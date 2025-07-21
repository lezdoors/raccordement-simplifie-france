import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building, Zap, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServiceTypesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Home,
      title: "Maison neuve",
      description: "Raccordement électrique pour construction neuve"
    },
    {
      icon: Building,
      title: "Raccordement provisoire",
      description: "Solution temporaire pour travaux"
    },
    {
      icon: Zap,
      title: "Viabilisation",
      description: "Raccordement pour terrain à viabiliser"
    },
    {
      icon: Zap,
      title: "Augmentation de puissance",
      description: "Modification d'abonnement existant"
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Types de raccordement Enedis
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Particuliers et professionnels. Toutes vos demandes de raccordement électrique 
            traitées avec le même formulaire simplifié.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service) => (
            <div key={service.title} className="text-center p-6 bg-background rounded-lg border hover:shadow-lg transition-shadow duration-300">
              <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-lg w-16 h-16 flex items-center justify-center">
                <service.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="max-w-2xl mx-auto p-8 bg-background rounded-lg border">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-lg">
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Formulaire unifié
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Un seul formulaire pour tous types de raccordement. Interface claire et 
              démarches administratives simplifiées.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/raccordement-enedis")}
              className="bg-primary hover:bg-primary/90 px-8"
            >
              Accéder au formulaire →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceTypesSection;