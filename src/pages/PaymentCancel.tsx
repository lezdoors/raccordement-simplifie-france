import { useEffect } from "react";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";

const PaymentCancel = () => {
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
            {/* Cancel Icon */}
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-8">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>

            {/* Cancel Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Paiement annulé
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
              Vous pouvez reprendre votre demande quand vous le souhaitez.
            </p>

            {/* Reassurance */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left max-w-lg mx-auto">
              <h3 className="font-semibold text-gray-900 mb-4">Pas d'inquiétude :</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span>Aucun frais n'a été prélevé</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span>Vos informations sont sauvegardées en sécurité</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span>Vous pouvez reprendre votre demande à tout moment</span>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Besoin d'aide ? Contactez-nous :</p>
              <p className="font-semibold text-gray-900">
                <a href="tel:0970709570" className="text-blue-600 hover:text-blue-700">
                  09 70 70 95 70
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
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
              </Button>
              
              <Button
                onClick={() => navigate("/raccordement-enedis")}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reprendre ma demande
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <FooterSection />
    </div>
  );
};

export default PaymentCancel;