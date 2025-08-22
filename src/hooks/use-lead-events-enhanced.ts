
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LeadEvent {
  id: string;
  lead_id: string;
  type: 'status_changed' | 'note_added' | 'message_added' | 'file_uploaded' | 'file_deleted' | 'assignment_changed' | 'email_sent' | 'lead_created' | 'contact_updated';
  actor_id: string | null;
  actor_email?: string;
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
        .select(`
          *,
          actor_email:admin_users!lead_events_actor_id_fkey(email)
        `)
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Flatten the actor_email from the join
      const eventsWithEmail = data?.map(event => ({
        ...event,
        actor_email: event.actor_email?.email || null
      })) || [];
      
      setEvents(eventsWithEmail);
    } catch (error) {
      console.error('Error fetching lead events:', error);
      toast.error('Erreur lors du chargement des événements');
    }
  };

  const logEvent = async (
    type: LeadEvent['type'], 
    payload: any = {}, 
    actorId?: string
  ) => {
    try {
      const { error } = await supabase.rpc('log_lead_event', {
        p_lead_id: leadId,
        p_type: type,
        p_actor_id: actorId || null,
        p_payload: payload
      });

      if (error) throw error;
      
      // Refresh events after logging
      await fetchEvents();
    } catch (error) {
      console.error('Error logging event:', error);
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchEvents().finally(() => setLoading(false));
      
      // Set up real-time subscription for new events
      const channel = supabase
        .channel(`lead-events-${leadId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'lead_events',
            filter: `lead_id=eq.${leadId}`
          },
          () => {
            // Refetch events when new ones are added
            fetchEvents();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [leadId]);

  return {
    events,
    loading,
    refetch: fetchEvents,
    logEvent
  };
};
