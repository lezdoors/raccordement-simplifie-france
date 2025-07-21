import { Button } from "@/components/ui/button";
import { Home, Building, Zap, FileText, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServiceTypesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Home,
      title: "Maison neuve",
      description: "Raccordement électrique pour construction neuve",
      gradient: "from-royal to-royal-light"
    },
    {
      icon: Building,
      title: "Raccordement provisoire",
      description: "Solution temporaire pour travaux",
      gradient: "from-gold to-gold-light"
    },
    {
      icon: Zap,
      title: "Viabilisation",
      description: "Raccordement pour terrain à viabiliser",
      gradient: "from-royal-light to-gold"
    },
    {
      icon: Zap,
      title: "Augmentation de puissance",
      description: "Modification d'abonnement existant",
      gradient: "from-gold-dark to-royal"
    },
  ];

  return (
    <section className="py-luxury bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-luxury text-white text-sm font-medium shadow-luxury">
            <FileText className="w-4 h-4 mr-2" />
            Services Premium
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Types de raccordement 
            <span className="text-primary block">Enedis</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-body">
            Particuliers et professionnels. Toutes vos demandes de raccordement électrique 
            traitées avec le même formulaire simplifié et l'excellence McKinsey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {services.map((service, index) => (
            <div key={service.title} className="group floating-card bg-card rounded-2xl p-8 border border-border/50 hover:border-gold/30 transition-luxury">
              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-primary p-1 shadow-lg">
                  <div className="w-full h-full bg-card rounded-xl flex items-center justify-center">
                    <service.icon className="w-8 h-8 text-royal" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-royal transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-body">
                    {service.description}
                  </p>
                </div>
                
                <div className="pt-4">
                  <div className="w-12 h-1 bg-primary rounded-full mx-auto opacity-60 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="max-w-3xl mx-auto">
            <div className="floating-card glass-card p-12 rounded-3xl border border-white/20 backdrop-blur-xl">
              <div className="space-y-8">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-lg">
                    <FileText className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                    Formulaire <span className="text-primary">unifié</span>
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed font-body max-w-2xl mx-auto">
                    Un seul formulaire pour tous types de raccordement. Interface claire et 
                    démarches administratives simplifiées avec l'excellence d'un cabinet de conseil.
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate("/raccordement-enedis")}
                    className="btn-luxury bg-gradient-luxury text-white hover:shadow-floating px-10 py-6 text-lg h-auto touch-target font-semibold rounded-xl border-0"
                  >
                    Accéder au formulaire premium →
                  </Button>
                </div>
                
                <div className="flex items-center justify-center space-x-8 pt-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                    Interface simplifiée
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                    Suivi en temps réel
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                    Support dédié
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceTypesSection;