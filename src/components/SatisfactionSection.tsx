import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock, CheckCircle } from "lucide-react";

const SatisfactionSection = () => {
  const metrics = [
    {
      icon: Star,
      value: "4.8/5",
      label: "Satisfaction client",
      description: "Note moyenne sur 1200+ avis"
    },
    {
      icon: Users,
      value: "5000+",
      label: "Raccordements réalisés",
      description: "Depuis notre création"
    },
    {
      icon: Clock,
      value: "72h",
      label: "Délai moyen",
      description: "Pour le traitement des dossiers"
    },
    {
      icon: CheckCircle,
      value: "98%",
      label: "Taux de succès",
      description: "Dossiers acceptés par Enedis"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Nos résultats
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Rapports de satisfaction
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            La confiance de nos clients nous guide dans notre mission d'excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 border-0 bg-background/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <metric.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold text-primary mb-2">
                  {metric.value}
                </CardTitle>
                <h3 className="text-lg font-semibold text-foreground">
                  {metric.label}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-medium">Avis certifiés</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Processus certifié</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">Support dédié</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SatisfactionSection;