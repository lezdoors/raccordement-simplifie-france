
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { user, adminUser, loading, error, refreshAdminUser } = useAdmin();
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Set timeout for loading state - reduced to 5s for better UX
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Auth timeout reached after 5 seconds');
        setTimeoutReached(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('❌ No user found, redirecting to login');
        navigate('/login');
        return;
      }

      if (user && !adminUser && !error) {
        console.log('⚠️ User found but no admin access, checking...');
        // Will show checking message
        return;
      }
    }
  }, [user, adminUser, loading, error, navigate]);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await refreshAdminUser();
    } catch (error) {
      console.error('❌ Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

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
            {user && (
              <p className="text-xs text-muted-foreground mt-1">
                Vérification du rôle en cours...
              </p>
            )}
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
            {user?.email && (
              <p className="text-xs text-muted-foreground mt-1">
                Utilisateur: {user.email}
              </p>
            )}
          </div>
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={handleRetry} 
              variant="outline"
              disabled={isRetrying}
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Vérification...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </>
              )}
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
  if (error || (user && !adminUser && !loading)) {
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
            <div className="text-xs text-muted-foreground mt-2 space-y-1">
              <div>Utilisateur connecté: {user.email}</div>
              {!loading && (
                <div className="text-amber-600">
                  Statut: Non autorisé ou compte inactif
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button 
              onClick={handleRetry} 
              variant="outline"
              disabled={isRetrying}
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Vérification...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </>
              )}
            </Button>
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
