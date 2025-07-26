import { Button } from "@/components/ui/button";
import { Home, Building, Zap, FileText, CheckCircle, Calendar, Landmark, Plug, Network, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const SwipeableServiceCards = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const services = [
    {
      icon: Home,
      title: "Raccordement Enedis Définitif / ajout de compteur linky",
      description: "Raccordement électrique pour construction neuve et ajout de compteur Linky",
      gradient: "from-royal to-royal-light"
    },
    {
      icon: Calendar,
      title: "Raccordement Enedis provisoire",
      description: "Solution temporaire pour travaux et besoins ponctuels",
      gradient: "from-gold to-gold-light"
    },
    {
      icon: Landmark,
      title: "Viabilisation d'un terrain",
      description: "Raccordement pour terrain à viabiliser et aménagement",
      gradient: "from-royal-light to-gold"
    },
    {
      icon: Plug,
      title: "Modification de raccordement Enedis",
      description: "Changement de puissance ou modification d'installation existante",
      gradient: "from-gold-dark to-royal"
    },
    {
      icon: Network,
      title: "Raccordement Enedis collectif",
      description: "Raccordement pour bâtiments collectifs et copropriétés",
      gradient: "from-royal to-gold"
    },
    {
      icon: Sun,
      title: "Raccordement Enedis photovoltaïque",
      description: "Raccordement pour installation solaire et injection réseau",
      gradient: "from-gold-light to-royal-light"
    },
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const currentX = e.touches[0].clientX;
    const diff = startX.current - currentX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0 && currentIndex < services.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
      isDragging.current = false;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <section className="py-luxury bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gold text-royal text-sm font-medium shadow-luxury">
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

        {/* Desktop Grid - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
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

        {/* Mobile Swipeable Cards */}
        <div className="md:hidden mb-20">
          <div 
            ref={containerRef}
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {services.map((service, index) => (
                <div key={service.title} className="w-full flex-shrink-0 px-4">
                  <div className="floating-card bg-card rounded-2xl p-8 border border-border/50 min-h-[44px] touch-target">
                    <div className="text-center space-y-6">
                      <div className="mx-auto w-20 h-20 rounded-2xl bg-primary p-1 shadow-lg">
                        <div className="w-full h-full bg-card rounded-xl flex items-center justify-center">
                          <service.icon className="w-8 h-8 text-royal" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed font-body">
                          {service.description}
                        </p>
                      </div>
                      
                      <div className="pt-4">
                        <div className="w-12 h-1 bg-primary rounded-full mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Swipe indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {services.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <span className="sr-only">Go to slide {index + 1}</span>
              </button>
            ))}
          </div>
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
                    onClick={() => navigate("/commencer")}
                    className="btn-cta px-10 py-6 text-lg min-h-[44px] h-auto touch-target font-semibold rounded-xl border-0"
                  >
                    Démarrer ma demande
                  </Button>
                </div>
                
                <div className="flex flex-wrap justify-center space-x-4 space-y-2 pt-6 text-sm text-muted-foreground">
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

export default SwipeableServiceCards;