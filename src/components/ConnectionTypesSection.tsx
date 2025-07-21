import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Building, Zap, Wrench } from "lucide-react";

const ConnectionTypesSection = () => {
  const connectionTypes = [
    {
      icon: Home,
      title: "Maison neuve",
      subtitle: "Raccordement électrique pour construction neuve",
      features: [
        "Raccordement électrique pour construction neuve",
        "Démarches simplifiées",
        "Accompagnement personnalisé"
      ]
    },
    {
      icon: Building,
      title: "Raccordement provisoire", 
      subtitle: "Solution temporaire pour travaux",
      features: [
        "Solution temporaire pour travaux",
        "Installation rapide",
        "Durée flexible"
      ]
    },
    {
      icon: Zap,
      title: "Augmentation de puissance",
      subtitle: "Modification d'abonnement existant", 
      features: [
        "Modification d'abonnement existant",
        "Adaptation aux besoins",
        "Procédure simplifiée"
      ]
    },
    {
      icon: Wrench,
      title: "Viabilisation",
      subtitle: "Raccordement pour terrain à viabiliser",
      features: [
        "Raccordement pour terrain à viabiliser", 
        "Études préalables",
        "Coordination des travaux"
      ]
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Types de raccordement
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Types de raccordement Enedis
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Particuliers et professionnels. Toutes vos demandes de raccordement électrique 
            traitées avec le même formulaire simplifié.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {connectionTypes.map((type, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <type.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-foreground mb-2">
                      {type.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {type.subtitle}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {type.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-colors">
                  En savoir plus
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Un seul formulaire pour tous types de raccordement
            </h3>
            <p className="text-muted-foreground mb-6">
              Interface claire et démarches administratives simplifiées.
            </p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Accéder au formulaire →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectionTypesSection;