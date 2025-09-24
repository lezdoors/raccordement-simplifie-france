import { useState, useEffect } from 'react';

interface LeadEvent {
  id: string;
  lead_id: string;
  type: string;
  actor_id: string;
  payload: any;
  created_at: string;
}

export const useLeadEvents = (leadId: string) => {
  const [events, setEvents] = useState<LeadEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    console.log('Lead events disabled - schema not ready');
    setEvents([]);
    setLoading(false);
  };

  useEffect(() => {
    if (leadId) {
      fetchEvents();
    }
  }, [leadId]);

  return {
    events,
    loading,
    refetch: fetchEvents
  };
};