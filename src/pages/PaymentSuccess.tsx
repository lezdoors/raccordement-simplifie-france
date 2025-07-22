import { useEffect } from "react";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Card className="text-center border-0 shadow-2xl">
          <CardContent className="p-12">
            {/* Success Icon */}
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-8">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Paiement confirmé !
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Merci pour votre confiance. Votre demande de raccordement électrique a été enregistrée 
              et sera traitée par notre équipe dans les plus brefs délais.
            </p>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left max-w-lg mx-auto">
              <h3 className="font-semibold text-gray-900 mb-4">Prochaines étapes :</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                  <span>Vous recevrez un email de confirmation sous quelques minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                  <span>Notre équipe analysera votre dossier sous 24-48h</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                  <span>Vous serez contacté pour finaliser les démarches</span>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Une question ? Contactez-nous :</p>
              <p className="font-semibold text-gray-900">
                <a href="tel:0977405060" className="text-blue-600 hover:text-blue-700">
                  09 77 40 50 60
                </a>
              </p>
              <p className="text-xs text-gray-500">Du lundi au vendredi de 9h à 19h</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Retour à l'accueil
              </Button>
              
              <Button
                onClick={() => navigate("/contact")}
                className="flex items-center gap-2"
              >
                Nous contacter
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <FooterSection />
    </div>
  );
};

export default PaymentSuccess;