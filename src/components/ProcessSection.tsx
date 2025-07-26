import { Button } from "@/components/ui/button";
import { FileText, Search, Wrench, Power } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProcessSection = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: FileText,
      step: "1",
      title: "Demande en ligne",
      description: "Formulaire simplifié en 5 minutes pour initier votre projet de raccordement électrique"
    },
    {
      icon: Search,
      step: "2", 
      title: "Études et devis",
      description: "Analyse technique personnalisée et établissement du devis détaillé par nos experts"
    },
    {
      icon: Wrench,
      step: "3",
      title: "Intervention",
      description: "Réalisation des travaux de raccordement par des techniciens qualifiés Enedis"
    },
    {
      icon: Power,
      step: "4",
      title: "Mise en service",
      description: "Activation de votre compteur électrique et finalisation du raccordement"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Processus de raccordement électrique
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Un processus simple et structuré en 4 étapes pour votre raccordement électrique Enedis
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {step.step}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Prêt à commencer votre raccordement ?
            </h3>
            <p className="text-muted-foreground mb-6">
              Démarrez dès maintenant votre demande de raccordement électrique ou contactez nos experts 
              pour un accompagnement personnalisé.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 px-8"
              onClick={() => navigate("/commencer")}
            >
              Démarrer ma demande
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8"
            >
              Contacter un expert
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;