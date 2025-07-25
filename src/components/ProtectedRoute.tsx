import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { user, adminUser, loading, error } = useAdmin();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    // Set timeout for loading state
    const timeout = setTimeout(() => {
      setTimeoutReached(true);
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('❌ No user found, redirecting to login');
        navigate('/login');
        return;
      }

      if (user && !adminUser && !error) {
        console.log('⚠️ User found but no admin access');
        // Will show unauthorized message
        return;
      }
    }
  }, [user, adminUser, loading, error, navigate]);

  // Loading state with timeout
  if (loading && !timeoutReached) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div>
            <p className="text-lg font-semibold text-foreground">Vérification des autorisations...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Utilisateur: {user?.email || 'Connexion en cours...'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Rôle: {adminUser?.role || 'Vérification...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Timeout reached
  if (loading && timeoutReached) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
          <div>
            <p className="text-lg font-semibold text-foreground">Délai d'attente dépassé</p>
            <p className="text-sm text-muted-foreground mt-2">
              La vérification des autorisations prend plus de temps que prévu.
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Réessayer
            </Button>
            <Button onClick={() => navigate('/login')}>
              Retour à la connexion
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No user - redirect handled in useEffect
  if (!user) {
    return null;
  }

  // Error state or unauthorized user
  if (error || (user && !adminUser)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <div>
            <p className="text-lg font-semibold text-foreground">Accès non autorisé</p>
            <div className="mt-4">
              <Alert className="border-red-200 bg-red-50 text-left">
                <AlertDescription className="text-red-800">
                  {error || 'Votre compte n\'est pas autorisé à accéder au CRM. Contactez l\'administrateur pour obtenir l\'accès.'}
                </AlertDescription>
              </Alert>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Utilisateur connecté: {user.email}
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => navigate('/login')} variant="outline">
              Changer de compte
            </Button>
            <a href="tel:+33189701200">
              <Button>
                📞 Contacter le support
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Authorized user
  return <>{children}</>;
};

export default ProtectedRoute;