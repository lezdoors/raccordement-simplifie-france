import { Button } from "@/components/ui/button";
import { Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-hero py-24 lg:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            Raccordement électrique Enedis
          </h1>
          
          <p className="text-xl text-white/90 leading-relaxed mb-4">
            Service administratif professionnel
          </p>
          
          <p className="text-lg text-white/80 leading-relaxed max-w-4xl mx-auto mb-12">
            Service expert en raccordement électrique Enedis pour toute la France. Nous gérons vos 
            démarches administratives : maison neuve, photovoltaïque, modification de branchement. 
            Processus simplifié, suivi personnalisé et conformité garantie.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg"
              onClick={() => navigate("/raccordement-enedis")}
            >
              Déposer ma demande
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg"
            >
              <Headphones className="mr-2 h-5 w-5" />
              Assistance technique
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-white/80 text-sm">
            <span>✓ Traitement sous 48h</span>
            <span>✓ Conformité réglementaire</span>
            <span>✓ Accompagnement dédié</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;