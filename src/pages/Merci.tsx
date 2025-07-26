import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";

const Merci = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  // Verify payment on page load
  useEffect(() => {
    const verifyPayment = async () => {
      if (sessionId) {
        try {
          console.log("🔍 Verifying payment for session:", sessionId);
          
          const { data, error } = await supabase.functions.invoke('verify-payment', {
            body: { sessionId }
          });

          if (error) {
            console.error("❌ Payment verification error:", error);
            toast.error("Erreur lors de la vérification du paiement");
          } else {
            console.log("✅ Payment verification result:", data);
            setPaymentVerified(data.paymentStatus === 'paid');
            
            if (data.paymentStatus === 'paid') {
              toast.success("✅ Paiement confirmé avec succès!");
            }
          }
        } catch (error) {
          console.error("❌ Payment verification failed:", error);
          toast.error("Erreur lors de la vérification du paiement");
        }
      }
      setLoading(false);
    };

    verifyPayment();
  }, [sessionId]);

  // Track purchase conversion on page load
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-16698052873/IFUxCJLHtMUaEImioJo-',
        'transaction_id': sessionId || Math.random().toString(36).substr(2, 9).toUpperCase()
      });
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">
                Vérification du paiement en cours...
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {paymentVerified ? "Merci pour votre demande !" : "Demande reçue"}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {paymentVerified 
                ? "Votre paiement a été confirmé et votre demande de raccordement électrique a été reçue avec succès."
                : "Votre demande de raccordement électrique a été reçue. Le paiement sera vérifié sous peu."
              }
              <br />
              Nous vous contacterons dans les plus brefs délais pour la suite de votre dossier.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                <strong>Référence:</strong> #{sessionId || Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <p className="text-sm text-muted-foreground">
                Un email de confirmation va être envoyé à l'adresse que vous avez fournie.
              </p>
              {paymentVerified && (
                <p className="text-sm text-green-600 font-medium">
                  ✅ Paiement confirmé
                </p>
              )}
            </div>
            <div className="mt-8 space-x-4">
              <Button onClick={() => navigate("/")} variant="outline">
                Retour à l'accueil
              </Button>
              <Button onClick={() => navigate("/raccordement-enedis")}>
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