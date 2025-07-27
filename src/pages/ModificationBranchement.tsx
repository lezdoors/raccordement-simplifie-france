import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ModificationBranchement = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-8">Modification de Branchement</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Page en cours de construction. Cette section sera bientôt disponible avec toutes les informations 
            sur les modifications de branchement électrique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/raccordement-enedis')}
              size="lg"
              className="font-bold text-[#1E1E1E]"
              style={{ background: 'linear-gradient(90deg, #FFD77A 0%, #F2B736 100%)' }}
            >
              Démarrer ma demande
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/contact')}
            >
              Nous contacter
            </Button>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default ModificationBranchement;