import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityConfig {
  enableCSRFProtection: boolean;
  enableRateLimit: boolean;
  maxRequestsPerHour: number;
}

export const useSecurityToken = () => {
  const [csrfToken, setCsrfToken] = useState<string>('');

  const generateCSRFToken = useCallback(() => {
    const token = crypto.randomUUID();
    setCsrfToken(token);
    sessionStorage.setItem('csrf_token', token);
    return token;
  }, []);

  useEffect(() => {
    const existingToken = sessionStorage.getItem('csrf_token');
    if (existingToken) {
      setCsrfToken(existingToken);
    } else {
      generateCSRFToken();
    }
  }, [generateCSRFToken]);

  const validateCSRFToken = useCallback((token: string) => {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === token;
  }, []);

  return {
    csrfToken,
    generateCSRFToken,
    validateCSRFToken
  };
};

export const useRateLimit = (action: string, maxRequests: number = 10) => {
  const [isLimited, setIsLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  const checkRateLimit = useCallback(async (): Promise<boolean> => {
    try {
      const userIP = await getUserIP();
      
      const { data, error } = await supabase.rpc('check_rate_limit', {
        p_identifier: userIP,
        p_action: action,
        p_max_requests: maxRequests,
        p_window_minutes: 60
      });

      if (error) {
        console.error('Rate limit check failed:', error);
        return true; // Allow on error to prevent blocking legitimate users
      }

      if (!data) {
        setIsLimited(true);
        setRetryAfter(3600); // 1 hour
        return false;
      }

      setIsLimited(false);
      setRetryAfter(null);
      return true;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return true; // Allow on error
    }
  }, [action, maxRequests]);

  return {
    isLimited,
    retryAfter,
    checkRateLimit
  };
};

const getUserIP = async (): Promise<string> => {
  try {
    // For client-side, we'll use a fallback identifier
    const fingerprint = `${navigator.userAgent}_${screen.width}_${screen.height}_${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
    return btoa(fingerprint).slice(0, 32);
  } catch (error) {
    return 'unknown';
  }
};

export const useSecureFormSubmission = (formType: string) => {
  const { csrfToken, validateCSRFToken } = useSecurityToken();
  const { isLimited, checkRateLimit, retryAfter } = useRateLimit('form_submission');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = useCallback(async (formData: Record<string, any>) => {
    try {
      setIsSubmitting(true);

      // Check rate limit first
      const canSubmit = await checkRateLimit();
      if (!canSubmit) {
        throw new Error(`Rate limit exceeded. Please wait ${Math.floor((retryAfter || 3600) / 60)} minutes before trying again.`);
      }

      // Validate CSRF token
      if (!validateCSRFToken(csrfToken)) {
        throw new Error('Security validation failed. Please refresh the page and try again.');
      }

      // Get user IP for server-side validation
      const userIP = await getUserIP();

      // Submit through secure edge function
      const response = await supabase.functions.invoke('rate-limited-form-submit', {
        body: {
          formType,
          formData: {
            ...formData,
            csrf_token: csrfToken
          },
          userIP
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Submission failed');
      }

      return response.data;
    } finally {
      setIsSubmitting(false);
    }
  }, [formType, csrfToken, validateCSRFToken, checkRateLimit, retryAfter]);

  return {
    submitForm,
    isSubmitting,
    isLimited,
    retryAfter,
    csrfToken
  };
};