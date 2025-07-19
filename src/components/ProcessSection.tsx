import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Search, Wrench, CheckCircle } from "lucide-react";

const ProcessSection = () => {
  const steps = [
    {
      icon: FileText,
      step: "01",
      title: "Demande en ligne",
      description: "Remplissez notre formulaire simple avec les informations de votre projet."
    },
    {
      icon: Search,
      step: "02", 
      title: "Étude technique",
      description: "Nos experts analysent votre demande et définissent la solution optimale."
    },
    {
      icon: Wrench,
      step: "03",
      title: "Intervention",
      description: "Nos techniciens certifiés réalisent votre raccordement dans les délais."
    },
    {
      icon: CheckCircle,
      step: "04",
      title: "Mise en service",
      description: "Votre installation est testée et mise en service en toute sécurité."
    }
  ];

  return (
    <section className="py-20 bg-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Un processus simple et transparent en 4 étapes pour votre raccordement électrique.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-primary/20 z-0"></div>
              )}
              
              <Card className="relative z-10 text-center hover:shadow-elegant transition-all duration-300 border-border/50">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 relative">
                    <step.icon className="w-8 h-8 text-white" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg" className="text-lg px-8 py-6">
            Commencer ma demande maintenant
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            ✨ Gratuit et sans engagement • ⚡ Réponse sous 24h
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;