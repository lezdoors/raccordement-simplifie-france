import { Card } from "@/components/ui/card";
import { Shield, Clock, Users, Phone } from "lucide-react";

export const FormFooter = () => {
  return (
    <div className="w-full mt-12 mb-8">
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Security */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">
              🔒 100% Sécurisé
            </h4>
            <p className="text-sm text-muted-foreground">
              Vos données sont protégées par un chiffrement SSL de niveau bancaire
            </p>
          </div>

          {/* Processing Time */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">
              ⚡ Traitement Express
            </h4>
            <p className="text-sm text-muted-foreground">
              Validation et transmission sous 48h maximum
            </p>
          </div>

          {/* Support */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">
              👥 Expert dédié
            </h4>
            <p className="text-sm text-muted-foreground">
              Accompagnement personnalisé tout au long du processus
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <a 
                href="tel:0189701200" 
                className="text-primary hover:text-primary/80 font-medium transition-colors touch-feedback"
                aria-label="Appeler le support"
              >
                📞 01 89 70 12 00
              </a>
            </div>
            <span className="hidden md:inline text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground">
              Lun-Ven 9h-18h - Support gratuit
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};