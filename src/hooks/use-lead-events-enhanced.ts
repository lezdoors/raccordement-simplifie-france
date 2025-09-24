import { useState, useEffect } from 'react';

interface LeadEvent {
  id: string;
  lead_id: string;
  type: string;
  actor_id: string;
  payload: any;
  created_at: string;
}

export const useLeadEventsEnhanced = (leadId: string) => {
  const [events, setEvents] = useState<LeadEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    console.log('Enhanced lead events disabled - schema not ready');
    setEvents([]);
    setLoading(false);
  };

  const logEvent = async (type: string, payload: any) => {
    console.log('Event logging disabled - schema not ready');
  };

  useEffect(() => {
    if (leadId) {
      fetchEvents();
    }
  }, [leadId]);

  return {
    events,
    loading,
    logEvent,
    refetch: fetchEvents
  };
};