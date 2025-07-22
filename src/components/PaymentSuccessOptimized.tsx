import { useEffect } from "react";
import { CheckCircle, ArrowRight, Home, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";
import { useAnalytics } from "@/hooks/use-analytics";
import { useAccessibility } from "@/components/AccessibilityProvider";

const PaymentSuccessOptimized = () => {
  const navigate = useNavigate();
  const { track, trackPageView } = useAnalytics();
  const { announceMessage } = useAccessibility();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Track page view
    trackPageView('/payment-success', 'Payment Success');
    
    // Track successful payment
    track({
      action: 'payment_success',
      category: 'conversion',
      label: 'raccordement_payment'
    });

    // Announce success to screen readers
    announceMessage("Paiement confirmé avec succès. Votre demande de raccordement électrique a été enregistrée.");
  }, [trackPageView, track, announceMessage]);

  const handlePhoneCall = () => {
    track({
      action: 'phone_call_from_success',
      category: 'engagement',
      label: 'post_payment_support'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-16">
        <Card className="text-center border-0 shadow-2xl">
          <CardContent className="p-8 md:p-12">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 md:mb-8">
              <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-green-600" aria-hidden="true" />
            </div>

            {/* Success Message */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Paiement confirmé !
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
              Merci pour votre confiance. Votre demande de raccordement électrique a été enregistrée 
              et sera traitée par notre équipe dans les plus brefs délais.
            </p>

            {/* Next Steps */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 md:p-6 mb-6 md:mb-8 text-left max-w-lg mx-auto">
              <h2 className="font-semibold text-foreground mb-4">Prochaines étapes :</h2>
              <ol className="space-y-3 text-muted-foreground" role="list">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0" aria-hidden="true">1</div>
                  <span>Vous recevrez un email de confirmation sous quelques minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0" aria-hidden="true">2</div>
                  <span>Notre équipe analysera votre dossier sous 24-48h</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0" aria-hidden="true">3</div>
                  <span>Vous serez contacté pour finaliser les démarches</span>
                </li>
              </ol>
            </div>

            {/* Contact Information */}
            <div className="bg-secondary/50 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
              <p className="text-sm text-muted-foreground mb-2">Une question ? Contactez-nous :</p>
              <p className="font-semibold text-foreground mb-1">
                <a 
                  href="tel:0977405060" 
                  className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2"
                  onClick={handlePhoneCall}
                  aria-label="Appeler le 09 77 40 50 60"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  09 77 40 50 60
                </a>
              </p>
              <p className="text-xs text-muted-foreground">Du lundi au vendredi de 9h à 19h</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 min-h-[48px] touch-manipulation"
                aria-label="Retourner à la page d'accueil"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                Retour à l'accueil
              </Button>
              
              <Button
                onClick={() => navigate("/contact")}
                size="lg"
                className="flex items-center gap-2 min-h-[48px] touch-manipulation"
                aria-label="Aller à la page de contact"
              >
                Nous contacter
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <FooterSection />
    </div>
  );
};

export default PaymentSuccessOptimized;