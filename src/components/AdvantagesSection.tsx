import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Shield, Users, Phone, FileText } from "lucide-react";

const AdvantagesSection = () => {
  const advantages = [
    {
      icon: Clock,
      title: "Traitement sous 48h",
      description: "Conformité réglementaire",
      badge: "Rapidité"
    },
    {
      icon: Shield,
      title: "Conformité réglementaire",
      description: "Accompagnement dédié",
      badge: "Sécurité"
    },
    {
      icon: Users,
      title: "Accompagnement dédié",
      description: "Équipe d'experts spécialisés",
      badge: "Support"
    },
    {
      icon: Phone,
      title: "Support technique",
      description: "Équipe d'experts spécialisés dans les procédures Enedis",
      badge: "Assistance"
    },
    {
      icon: FileText,
      title: "Gestion administrative",
      description: "Nous gérons vos démarches administratives",
      badge: "Simplicité"
    },
    {
      icon: CheckCircle,
      title: "Suivi personnalisé",
      description: "Accompagnement dédié et finalisation du raccordement",
      badge: "Qualité"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Nos avantages
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pourquoi choisir notre service ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Service expert en raccordement électrique Enedis pour toute la France. Nous gérons vos 
            démarches administratives : maison neuve, photovoltaïque, modification de branchement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <advantage.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {advantage.title}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {advantage.badge}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {advantage.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Processus simplifié</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Suivi personnalisé</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Garantie conformité</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;