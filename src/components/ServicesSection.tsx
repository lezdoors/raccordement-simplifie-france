import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building2, Factory, ArrowRight } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Home,
      title: "Particuliers",
      description: "Raccordement pour votre maison individuelle, appartement ou local commercial.",
      features: ["Démarches simplifiées", "Suivi en temps réel", "Intervention rapide"],
      cta: "Démarrer ma demande"
    },
    {
      icon: Building2,
      title: "Professionnels", 
      description: "Solutions pour bureaux, commerces et petites entreprises.",
      features: ["Accompagnement dédié", "Tarifs préférentiels", "Planning adapté"],
      cta: "Démarrer ma demande"
    },
    {
      icon: Factory,
      title: "Industriels",
      description: "Raccordements haute tension pour sites industriels et gros consommateurs.",
      features: ["Étude personnalisée", "Installation complexe", "Maintenance incluse"],
      cta: "Démarrer ma demande"
    }
  ];

  return (
    <section className="section-py bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Nos services de raccordement
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Que vous soyez particulier, professionnel ou industriel, nous avons la solution 
            adaptée à vos besoins de raccordement électrique.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="relative group card-interactive rounded-xl">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 transition-transform duration-300">
                  <service.icon className="w-7 h-7 text-white interactive-icon" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  {service.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="cta" size="lg">
            Voir tous nos services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;