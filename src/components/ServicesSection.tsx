import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building2, Factory, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServicesSection = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      icon: Home,
      title: "Particuliers",
      description: "Raccordement simplifié pour votre habitation principale ou secondaire.",
      features: ["Démarches claires", "Suivi personnalisé", "Prix transparent"],
      cta: "Démarrer ma demande"
    },
    {
      icon: Building2,
      title: "Professionnels", 
      description: "Solutions adaptées aux commerces, bureaux et petites entreprises.",
      features: ["Expert dédié", "Tarifs préférentiels", "Planning flexible"],
      cta: "Démarrer ma demande"
    },
    {
      icon: Factory,
      title: "Industriels",
      description: "Raccordements complexes pour sites industriels et gros consommateurs.",
      features: ["Étude sur mesure", "Installation technique", "Maintenance comprise"],
      cta: "Démarrer ma demande"
    }
  ];

  return (
    <section className="section-py bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        
        {/* Header with generous spacing */}
        <div className="text-center mb-20">
          <h2 className="heading-2 text-foreground mb-6">
            Solutions sur mesure
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Des services personnalisés selon votre profil, avec un accompagnement expert du début à la fin.
          </p>
        </div>

        {/* Lighter card grid with more spacing */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <Card key={index} className="group bg-white border-0 shadow-soft hover:shadow-medium transition-all duration-300 rounded-2xl overflow-hidden">
              <CardHeader className="pb-6 pt-8 px-8">
                {/* Lighter icon treatment */}
                <div className="w-12 h-12 bg-blue-subtle rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-lighter transition-colors duration-300">
                  <service.icon className="w-6 h-6 text-blue-soft" />
                </div>
                
                <CardTitle className="text-xl font-medium text-foreground mb-3">
                  {service.title}
                </CardTitle>
                
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                {/* Features with better spacing */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-warm rounded-full mr-4 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {/* Cleaner CTA button */}
                <Button 
                  onClick={() => navigate('/raccordement-enedis')}
                  variant="outline" 
                  className="w-full h-12 border-blue-subtle text-blue-soft hover:bg-blue-subtle hover:text-blue-soft hover:border-blue-light transition-all rounded-xl font-medium"
                >
                  {service.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA with more breathing room */}
        <div className="text-center mt-20">
          <Button 
            onClick={() => navigate('/raccordement-enedis')}
            className="btn-cta-primary text-lg px-10 py-4 rounded-2xl hover-scale"
            size="lg"
          >
            Voir tous nos services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;