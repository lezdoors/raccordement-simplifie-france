
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

interface InternalMessage {
  id: string;
  lead_id: string;
  direction: 'internal' | 'inbound';
  subject: string;
  body_html: string | null;
  body_text: string | null;
  from_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useInternalMessages = (leadId: string) => {
  const { user } = useAdmin();
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_emails_internal')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching internal messages:', error);
      toast.error('Erreur lors du chargement des messages');
    }
  };

  const sendMessage = async (subject: string, bodyText: string, bodyHtml?: string) => {
    if (!user) {
      toast.error('Utilisateur non authentifié');
      return false;
    }

    setSending(true);
    try {
      const { error } = await supabase
        .from('lead_emails_internal')
        .insert({
          lead_id: leadId,
          direction: 'internal',
          subject,
          body_text: bodyText,
          body_html: bodyHtml || bodyText.replace(/\n/g, '<br>'),
          from_user_id: user.id
        });

      if (error) throw error;

      // Log the event
      await supabase.rpc('log_lead_event', {
        p_lead_id: leadId,
        p_type: 'message_added',
        p_actor_id: user.id,
        p_payload: { subject, message_type: 'internal' }
      });

      toast.success('Message envoyé avec succès');
      await fetchMessages();
      return true;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
      return false;
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchMessages().finally(() => setLoading(false));
    }
  }, [leadId]);

  return {
    messages,
    loading,
    sending,
    sendMessage,
    refetch: fetchMessages
  };
};
