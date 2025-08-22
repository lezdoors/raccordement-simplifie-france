
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LeadEvent {
  id: string;
  lead_id: string;
  type: 'status_changed' | 'note_added' | 'message_added' | 'file_uploaded' | 'assignment_changed';
  actor_id: string | null;
  payload: any;
  created_at: string;
}

export const useLeadEvents = (leadId: string) => {
  const [events, setEvents] = useState<LeadEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_events')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching lead events:', error);
      toast.error('Erreur lors du chargement des événements');
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchEvents().finally(() => setLoading(false));
    }
  }, [leadId]);

  return {
    events,
    loading,
    refetch: fetchEvents
  };
};
