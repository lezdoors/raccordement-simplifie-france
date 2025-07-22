import { useCallback } from "react";

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

interface UseAnalyticsReturn {
  track: (event: AnalyticsEvent) => void;
  trackPageView: (page: string, title?: string) => void;
  trackFormSubmission: (formName: string, success: boolean) => void;
  trackPhoneCall: () => void;
  trackDownload: (fileName: string) => void;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const track = useCallback((event: AnalyticsEvent) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
    }

    // Custom analytics endpoint (if needed)
    try {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      }).catch(console.error);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, []);

  const trackPageView = useCallback((page: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: title,
        page_location: window.location.href,
        page_path: page
      });
    }
  }, []);

  const trackFormSubmission = useCallback((formName: string, success: boolean) => {
    track({
      action: success ? 'form_submit_success' : 'form_submit_error',
      category: 'engagement',
      label: formName
    });
  }, [track]);

  const trackPhoneCall = useCallback(() => {
    track({
      action: 'phone_call',
      category: 'engagement',
      label: '09_77_40_50_60'
    });
  }, [track]);

  const trackDownload = useCallback((fileName: string) => {
    track({
      action: 'download',
      category: 'engagement',
      label: fileName
    });
  }, [track]);

  return {
    track,
    trackPageView,
    trackFormSubmission,
    trackPhoneCall,
    trackDownload
  };
};

// Extend window type for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}