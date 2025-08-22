
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export interface AdminUser {
  email: string;
  role: 'superadmin' | 'manager' | 'traiteur';
  can_see_payments: boolean;
  can_manage_users: boolean;
  can_see_all_leads: boolean;
  is_active: boolean;
}

interface AdminContextType {
  user: User | null;
  adminUser: AdminUser | null;
  loading: boolean;
  error: string | null;
  hasPermission: (permission: keyof Pick<AdminUser, 'can_see_payments' | 'can_manage_users' | 'can_see_all_leads'>) => boolean;
  isRole: (role: AdminUser['role']) => boolean;
  refreshAdminUser: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminUser = async (userEmail: string, retryCount = 0): Promise<AdminUser | null> => {
    const maxRetries = 3;
    const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
    
    try {
      console.log(`🔍 Fetching admin user for email: ${userEmail} (attempt ${retryCount + 1})`);
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('email, role, can_see_payments, can_manage_users, can_see_all_leads, is_active')
        .eq('email', userEmail.toLowerCase().trim())
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('❌ Error fetching admin user:', error);
        
        // Retry on temporary errors
        if ((error.code === 'PGRST301' || error.message.includes('timeout')) && retryCount < maxRetries) {
          console.log(`⏳ Retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return fetchAdminUser(userEmail, retryCount + 1);
        }
        
        if (error.code === 'PGRST116') {
          // No rows returned
          const errorMessage = `Utilisateur "${userEmail}" non autorisé. Contactez l'administrateur pour obtenir l'accès.`;
          setError(errorMessage);
          toast.error('Accès refusé: utilisateur non autorisé');
          return null;
        }
        
        const errorMessage = `Erreur de base de données: ${error.message}`;
        setError(errorMessage);
        toast.error('Erreur lors de la vérification des autorisations');
        return null;
      }

      if (!data) {
        console.warn('⚠️ No admin user data found for:', userEmail);
        const errorMessage = `Utilisateur "${userEmail}" non trouvé dans le système`;
        setError(errorMessage);
        return null;
      }

      console.log('✅ Admin user found:', data);
      setError(null);
      return data as AdminUser;
    } catch (error) {
      console.error('💥 Unexpected error fetching admin user:', error);
      
      // Retry on network errors
      if (retryCount < maxRetries) {
        console.log(`⏳ Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return fetchAdminUser(userEmail, retryCount + 1);
      }
      
      const errorMessage = 'Erreur inattendue lors de la vérification des autorisations';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  };

  const refreshAdminUser = async () => {
    if (user?.email) {
      console.log('🔄 Refreshing admin user data for:', user.email);
      setLoading(true);
      setError(null);
      const adminData = await fetchAdminUser(user.email);
      setAdminUser(adminData);
      setLoading(false);
    }
  };

  const hasPermission = (permission: keyof Pick<AdminUser, 'can_see_payments' | 'can_manage_users' | 'can_see_all_leads'>): boolean => {
    return adminUser?.[permission] || false;
  };

  const isRole = (role: AdminUser['role']): boolean => {
    return adminUser?.role === role;
  };

  useEffect(() => {
    let isMounted = true;
    let isInitialLoad = true;
    
    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing admin authentication...');
        setLoading(true);
        
        // Get initial session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Error getting session:', sessionError);
          if (isMounted) {
            setError('Erreur de session');
            setLoading(false);
          }
          return null;
        }

        console.log('📋 Initial session:', session?.user?.email || 'No session');
        
        // Handle initial session
        if (isMounted) {
          setUser(session?.user ?? null);
          
          if (session?.user?.email) {
            console.log('🔍 Fetching admin data for initial session:', session.user.email);
            const adminData = await fetchAdminUser(session.user.email);
            if (isMounted) {
              setAdminUser(adminData);
            }
          } else {
            setAdminUser(null);
            setError(null);
          }
          setLoading(false);
          isInitialLoad = false;
        }

        // Listen for auth changes after initial load
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!isMounted || isInitialLoad) return;
          
          console.log('🔄 Auth state change:', event, newSession?.user?.email || 'No session');
          
          setUser(newSession?.user ?? null);
          
          if (newSession?.user?.email) {
            // Only fetch if user changed or it's a new sign in
            if (event === 'SIGNED_IN' || newSession.user.email !== session?.user?.email) {
              console.log('🔍 Fetching admin data for auth change:', newSession.user.email);
              setLoading(true);
              setError(null);
              const adminData = await fetchAdminUser(newSession.user.email);
              if (isMounted) {
                setAdminUser(adminData);
                setLoading(false);
              }
            }
          } else {
            if (isMounted) {
              setAdminUser(null);
              setError(null);
              setLoading(false);
            }
          }
        });
        
        return subscription;
      } catch (error) {
        console.error('💥 Auth initialization error:', error);
        if (isMounted) {
          setError('Erreur d\'initialisation');
          setLoading(false);
        }
        return null;
      }
    };

    const subscriptionPromise = initializeAuth();

    return () => {
      isMounted = false;
      subscriptionPromise.then(subscription => subscription?.unsubscribe());
    };
  }, []);

  return (
    <AdminContext.Provider value={{
      user,
      adminUser,
      loading,
      error,
      hasPermission,
      isRole,
      refreshAdminUser
    }}>
      {children}
    </AdminContext.Provider>
  );
};
