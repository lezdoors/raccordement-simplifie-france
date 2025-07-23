import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";

const Merci = () => {
  const navigate = useNavigate();

  // Track purchase conversion on page load
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-16698052873/IFUxCJLHtMUaEImioJo-',
        'transaction_id': Math.random().toString(36).substr(2, 9).toUpperCase()
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Merci pour votre demande !
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Votre demande de raccordement électrique a été reçue avec succès. 
              Nous vous contacterons dans les plus brefs délais pour la suite de votre dossier.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                <strong>Référence:</strong> #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <p className="text-sm text-muted-foreground">
                Un email de confirmation va être envoyé à l'adresse que vous avez fournie.
              </p>
            </div>
            <div className="mt-8 space-x-4">
              <Button onClick={() => navigate("/")} variant="outline">
                Retour à l'accueil
              </Button>
              <Button onClick={() => navigate("/enedis-raccordement")}>
                Nouvelle demande
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Merci;