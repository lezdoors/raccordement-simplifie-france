import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building, Zap, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServiceTypesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Home,
      title: "Maison neuve",
      description: "Raccordement électrique pour construction neuve",
      link: "/raccordement-definitif",
    },
    {
      icon: Building,
      title: "Raccordement provisoire",
      description: "Solution temporaire pour travaux",
      link: "/raccordement-provisoire",
    },
    {
      icon: Wrench,
      title: "Viabilisation",
      description: "Raccordement pour terrain à viabiliser",
      link: "/viabilisation-terrain",
    },
    {
      icon: Zap,
      title: "Augmentation de puissance",
      description: "Modification d'abonnement existant",
      link: "/augmentation-puissance",
    },
  ];

  return (
    <section className="py-16 bg-background">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card key={service.title} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(service.link)}
                  className="w-full"
                >
                  En savoir plus
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto p-6 bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Wrench className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Formulaire unifié
              </CardTitle>
              <CardDescription className="text-lg">
                Un seul formulaire pour tous types de raccordement. Interface claire et 
                démarches administratives simplifiées.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg" 
                onClick={() => navigate("/raccordement-enedis")}
                className="bg-primary hover:bg-primary/90"
              >
                Accéder au formulaire →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ServiceTypesSection;