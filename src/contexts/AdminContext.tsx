import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

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

  const fetchAdminUser = async (userEmail: string): Promise<AdminUser | null> => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('email, role, can_see_payments, can_manage_users, can_see_all_leads, is_active')
        .eq('email', userEmail)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return null;
      }

      return data as AdminUser;
    } catch (error) {
      console.error('Error fetching admin user:', error);
      return null;
    }
  };

  const refreshAdminUser = async () => {
    if (user?.email) {
      const adminData = await fetchAdminUser(user.email);
      setAdminUser(adminData);
    }
  };

  const hasPermission = (permission: keyof Pick<AdminUser, 'can_see_payments' | 'can_manage_users' | 'can_see_all_leads'>): boolean => {
    return adminUser?.[permission] || false;
  };

  const isRole = (role: AdminUser['role']): boolean => {
    return adminUser?.role === role;
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        const adminData = await fetchAdminUser(session.user.email);
        setAdminUser(adminData);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        const adminData = await fetchAdminUser(session.user.email);
        setAdminUser(adminData);
      } else {
        setAdminUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AdminContext.Provider value={{
      user,
      adminUser,
      loading,
      hasPermission,
      isRole,
      refreshAdminUser
    }}>
      {children}
    </AdminContext.Provider>
  );
};