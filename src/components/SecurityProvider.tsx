import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityContextType {
  sessionValid: boolean;
  isSecurityChecking: boolean;
  validateSession: () => Promise<boolean>;
  enforceSecureHeaders: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [sessionValid, setSessionValid] = useState(true);
  const [isSecurityChecking, setIsSecurityChecking] = useState(false);

  const validateSession = async (): Promise<boolean> => {
    try {
      setIsSecurityChecking(true);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session validation error:', error);
        setSessionValid(false);
        return false;
      }

      if (!session) {
        setSessionValid(true); // No session is valid for public areas
        return true;
      }

      // Check if session is expired
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = session.expires_at || 0;
      
      if (expiresAt < now) {
        await supabase.auth.signOut();
        setSessionValid(false);
        return false;
      }

      setSessionValid(true);
      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      setSessionValid(false);
      return false;
    } finally {
      setIsSecurityChecking(false);
    }
  };

  const enforceSecureHeaders = () => {
    // Add security headers via meta tags (client-side enforcement)
    const addMetaTag = (name: string, content: string) => {
      const existing = document.querySelector(`meta[name="${name}"]`);
      if (existing) {
        existing.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // CSP headers
    addMetaTag('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https: blob:; " +
      "connect-src 'self' https://kstugxtmghinprrpkrud.supabase.co https://api.stripe.com; " +
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com;"
    );

    // Other security headers
    addMetaTag('X-Content-Type-Options', 'nosniff');
    addMetaTag('X-Frame-Options', 'DENY');
    addMetaTag('X-XSS-Protection', '1; mode=block');
    addMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');
  };

  useEffect(() => {
    // Enforce security headers
    enforceSecureHeaders();

    // Validate session on mount
    validateSession();

    // Set up session validation interval (every 5 minutes)
    const interval = setInterval(validateSession, 5 * 60 * 1000);

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          await validateSession();
        }
      }
    );

    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, []);

  // Security event listeners
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Re-validate session when tab becomes visible
        validateSession();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'supabase.auth.token') {
        // Session changed in another tab
        validateSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = {
    sessionValid,
    isSecurityChecking,
    validateSession,
    enforceSecureHeaders
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};
