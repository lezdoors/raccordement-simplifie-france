
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, Eye, EyeOff, AlertTriangle, Phone, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

const Login = () => {
  const navigate = useNavigate();
  const { user, adminUser, loading: authLoading, error: adminError, refreshAdminUser } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Redirect if already authenticated and authorized
  useEffect(() => {
    if (!authLoading && user && adminUser) {
      console.log('✅ User already authenticated and authorized, redirecting...');
      navigate('/admin');
    }
  }, [user, adminUser, authLoading, navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const retryAdminCheck = async () => {
    if (!user?.email) return;
    
    setIsRetrying(true);
    try {
      console.log('🔄 Retrying admin user check for:', user.email);
      await refreshAdminUser();
      
      // Small delay to allow context to update
      setTimeout(() => {
        setIsRetrying(false);
      }, 1000);
    } catch (error) {
      console.error('❌ Retry failed:', error);
      setIsRetrying(false);
      toast.error("Erreur lors de la vérification des autorisations");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Veuillez entrer une adresse email valide");
      return;
    }

    setLoading(true);
    setLoginAttempts(prev => prev + 1);
    
    try {
      console.log('🔐 Attempting login for:', email, `(attempt #${loginAttempts + 1})`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        
        // More specific error messages
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou mot de passe incorrect. Vérifiez vos identifiants.");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Veuillez confirmer votre email avant de vous connecter.");
        } else if (error.message.includes("Too many requests")) {
          toast.error("Trop de tentatives de connexion. Veuillez patienter quelques minutes.");
        } else if (error.message.includes("User not found")) {
          toast.error("Aucun compte trouvé avec cette adresse email.");
        } else {
          toast.error(`Erreur de connexion: ${error.message}`);
        }
        return;
      }

      if (data.user) {
        console.log('✅ Login successful for:', data.user.email);
        toast.success("Connexion réussie ! Vérification des autorisations...");
        
        // Give AdminContext time to process the new user
        setTimeout(() => {
          // Check if we have admin access after a delay
          if (!adminUser && !adminError) {
            console.log('⏳ Admin check still pending, will redirect after verification');
          } else {
            navigate('/admin');
          }
        }, 2000);
      }
    } catch (error: any) {
      console.error("💥 Unexpected login error:", error);
      toast.error("Erreur inattendue lors de la connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Veuillez entrer votre adresse email");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Veuillez entrer une adresse email valide");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`,
      });

      if (error) {
        toast.error(`Erreur: ${error.message}`);
        return;
      }

      toast.success("Email de réinitialisation envoyé ! Vérifiez votre boîte mail.");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error("Erreur lors de l'envoi de l'email");
    } finally {
      setLoading(false);
    }
  };

  // Show loading if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  // Show retry option if user is logged in but not authorized
  const showRetryOption = user && !adminUser && adminError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Phone Header */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center">
        <a 
          href="tel:+33970709570" 
          className="inline-flex items-center gap-2 hover:underline font-medium"
        >
          <Phone className="h-4 w-4" />
          Téléphone : 09 70 70 95 70
        </a>
      </div>

      <div className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Accès CRM
            </CardTitle>
            <p className="text-muted-foreground">
              Système de gestion des raccordements électriques
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Show retry option if logged in but not authorized */}
            {showRetryOption && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <div className="space-y-2">
                    <p><strong>Connexion établie mais accès non autorisé.</strong></p>
                    <p className="text-sm">Utilisateur: {user.email}</p>
                    <p className="text-sm">Erreur: {adminError}</p>
                    <Button 
                      onClick={retryAdminCheck} 
                      disabled={isRetrying}
                      size="sm" 
                      variant="outline"
                      className="mt-2"
                    >
                      {isRetrying ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Vérification...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Réessayer la vérification
                        </>
                      )}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Alert className="border-blue-200 bg-blue-50">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <strong>Accès réservé au personnel autorisé.</strong> 
                Si vous n'avez pas d'accès, contactez l'administrateur système.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@raccordement-elec.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                    disabled={loading || isRetrying}
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                    disabled={loading || isRetrying}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    disabled={loading || isRetrying}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  disabled={loading || isRetrying}
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" 
                disabled={loading || isRetrying}
              >
                {loading ? "Connexion en cours..." : "Accéder au CRM"}
              </Button>
            </form>

            {/* Show login attempt info for debugging */}
            {loginAttempts > 0 && (
              <div className="text-xs text-muted-foreground text-center">
                Tentatives de connexion : {loginAttempts}
              </div>
            )}

            <div className="mt-6 pt-6 border-t text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Problème d'accès ? Contactez le support technique
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <a href="tel:+33970709570" className="hover:underline">
                  📞 09 70 70 95 70
                </a>
                <span>•</span>
                <a href="mailto:support@raccordement-elec.fr" className="hover:underline">
                  ✉️ support@raccordement-elec.fr
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
