import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  email: string;
  role: 'superadmin' | 'manager' | 'traiteur';
  can_see_payments: boolean;
  can_manage_users: boolean;
  can_see_all_leads: boolean;
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
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminUser = async (userEmail: string, retryCount = 0): Promise<AdminUser | null> => {
    try {
      console.log(`🔍 Admin user functionality not implemented yet for: ${userEmail}`);
      // For now, return a default admin user for demo purposes
      return {
        email: userEmail,
        role: 'manager',
        can_see_payments: true,
        can_manage_users: false,
        can_see_all_leads: true,
      };
    } catch (error) {
      console.error('❌ Error fetching admin user:', error);
      return null;
    }
  };

  const refreshAdminUser = async () => {
    if (user?.email) {
      const admin = await fetchAdminUser(user.email);
      setAdminUser(admin);
    }
  };

  const hasPermission = (permission: keyof Pick<AdminUser, 'can_see_payments' | 'can_manage_users' | 'can_see_all_leads'>): boolean => {
    return adminUser?.[permission] ?? false;
  };

  const isRole = (role: AdminUser['role']): boolean => {
    return adminUser?.role === role;
  };

  useEffect(() => {
    console.log('🚀 Initializing admin authentication...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 Initial session:', session ? 'Found' : 'No session');
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session ? 'User logged in' : 'No session');
        
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser?.email) {
          console.log('👤 User authenticated, fetching admin data...');
          const admin = await fetchAdminUser(currentUser.email);
          setAdminUser(admin);
          
          if (admin) {
            console.log('✅ Admin user loaded:', admin.role);
          } else {
            console.log('❌ No admin user found');
            setError('Accès non autorisé. Contactez un administrateur.');
          }
        } else {
          console.log('🚪 User logged out');
          setAdminUser(null);
          setError(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AdminContextType = {
    user,
    adminUser,
    loading,
    error,
    hasPermission,
    isRole,
    refreshAdminUser,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};