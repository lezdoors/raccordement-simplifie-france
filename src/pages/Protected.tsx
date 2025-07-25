import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Key } from "lucide-react";
import { Link } from "react-router-dom";

const Protected = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Zone Protégée
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Cette zone est réservée aux administrateurs autorisés.
          </p>
          <div className="flex items-center justify-center space-x-4 py-4">
            <Lock className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">Accès sécurisé</span>
            <Key className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <Link to="/login">
              <Button className="w-full">
                Se connecter
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Protected;