import { FileText, Calculator, Zap } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: FileText,
    title: "Remplissez le formulaire",
    description: "Saisissez vos informations en 3 minutes"
  },
  {
    id: 2,
    icon: Calculator,
    title: "Recevez votre devis",
    description: "Devis personnalisé sous 24h"
  },
  {
    id: 3,
    icon: Zap,
    title: "Raccordement réalisé",
    description: "Installation par des techniciens certifiés"
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un processus simple et transparent pour votre raccordement électrique
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-border transform translate-x-4 -translate-y-1/2"></div>
              )}
              
              {/* Step Card */}
              <div className="text-center relative">
                {/* Icon */}
                <div className="mx-auto w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mb-6 shadow-card">
                  <step.icon className="h-12 w-12 text-white" />
                </div>
                
                {/* Step Number */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.id}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;