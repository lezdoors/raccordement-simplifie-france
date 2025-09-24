import { useState, useEffect } from 'react';
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
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      console.log('Internal messages fetching disabled - database schema not ready');
      setMessages([]);
    } catch (error) {
      console.error('Error fetching internal messages:', error);
      toast.error('Erreur lors du chargement des messages');
    }
  };

  const sendMessage = async (subject: string, message: string) => {
    setSending(true);
    try {
      console.log('Message sending disabled - database schema not ready');
      toast.info("Message sending not yet implemented");
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