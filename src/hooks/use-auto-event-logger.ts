import { useCallback } from 'react';

interface EventData {
  leadId?: string;
  eventType: 'form_start' | 'form_step' | 'form_submit' | 'payment_start' | 'payment_success' | 'payment_error';
  metadata?: Record<string, any>;
}

export const useAutoEventLogger = () => {
  const logEvent = useCallback(async (eventData: EventData) => {
    try {
      // Disable auto-event logging until proper functions are set up
      console.log('Auto-event logging disabled', eventData);
      return;
    } catch (error) {
      console.error('Event logging failed:', error);
    }
  }, []);

  return { logEvent };
};