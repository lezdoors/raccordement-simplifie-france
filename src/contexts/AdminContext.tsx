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

  const fetchAdminUser = async (userEmail: string): Promise<AdminUser | null> => {
    try {
      console.log('🔍 Fetching admin user for email:', userEmail);
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('email, role, can_see_payments, can_manage_users, can_see_all_leads, is_active')
        .eq('email', userEmail)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('❌ Error fetching admin user:', error);
        if (error.code === 'PGRST116') {
          // No rows returned
          setError(`Utilisateur non autorisé. Contactez l'administrateur pour obtenir l'accès.`);
          toast.error('Accès refusé: utilisateur non autorisé');
          return null;
        }
        setError(`Erreur de base de données: ${error.message}`);
        return null;
      }

      if (!data) {
        console.warn('⚠️ No admin user data found for:', userEmail);
        setError('Utilisateur non trouvé dans le système');
        return null;
      }

      console.log('✅ Admin user found:', data);
      setError(null);
      return data as AdminUser;
    } catch (error) {
      console.error('💥 Unexpected error fetching admin user:', error);
      setError('Erreur inattendue lors de la vérification des autorisations');
      return null;
    }
  };

  const refreshAdminUser = async () => {
    if (user?.email) {
      setLoading(true);
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
            // Only fetch if user changed
            if (newSession.user.email !== session?.user?.email) {
              console.log('🔍 Fetching admin data for new user:', newSession.user.email);
              setLoading(true);
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