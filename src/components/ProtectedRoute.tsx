import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        // Check if user email is in admin_users table
        const { data, error } = await supabase
          .from('admin_users')
          .select('email, is_active, role, can_see_payments, can_manage_users, can_see_all_leads')
          .eq('email', session.user.email)
          .eq('is_active', true)
          .single();

        if (error || !data) {
          await supabase.auth.signOut();
          toast.error("⛔ Accès refusé. Cette adresse email n'est pas autorisée.");
          navigate('/login');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking access:', error);
        await supabase.auth.signOut();
        navigate('/login');
      }
    };

    checkAccess();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
        navigate('/login');
        return;
      }

      // Re-check authorization on auth change
      const { data, error } = await supabase
        .from('admin_users')
        .select('email, is_active, role, can_see_payments, can_manage_users, can_see_all_leads')
        .eq('email', session.user.email)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        await supabase.auth.signOut();
        toast.error("⛔ Accès refusé. Cette adresse email n'est pas autorisée.");
        navigate('/login');
        return;
      }

      setIsAuthorized(true);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Vérification des autorisations...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
};

export default ProtectedRoute;