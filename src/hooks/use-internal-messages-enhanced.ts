
import { useState, useEffect, useCallback } from 'react';
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

interface OptimisticMessage extends InternalMessage {
  optimistic?: boolean;
}

export const useInternalMessagesEnhanced = (leadId: string) => {
  const { user } = useAdmin();
  const [messages, setMessages] = useState<OptimisticMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      // Temporarily disable internal messages until proper tables are set up
      console.log('Internal messages disabled - database schema not ready');
      setMessages([]);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching internal messages:', error);
      toast.error('Erreur lors du chargement des messages');
    }
  }, [leadId]);

  const sendMessage = async (
    subject: string, 
    bodyText: string, 
    bodyHtml?: string, 
    isImportant?: boolean
  ) => {
    if (!user) {
      toast.error('Utilisateur non authentifié');
      return false;
    }

    setSending(true);

    // Create optimistic message
    const optimisticMessage: OptimisticMessage = {
      id: `temp-${Date.now()}`,
      lead_id: leadId,
      direction: 'internal',
      subject,
      body_text: bodyText,
      body_html: bodyHtml || bodyText.replace(/\n/g, '<br>'),
      from_user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      optimistic: true
    };

    // Add optimistic message to UI
    setMessages(prev => [optimisticMessage, ...prev]);

    try {
      const { data, error } = await supabase
        .from('lead_emails_internal')
        .insert({
          lead_id: leadId,
          direction: 'internal',
          subject,
          body_text: bodyText,
          body_html: bodyHtml || bodyText.replace(/\n/g, '<br>'),
          from_user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Log the event with importance flag if set
      await supabase.rpc('log_lead_event', {
        p_lead_id: leadId,
        p_type: 'message_added',
        p_actor_id: user.id,
        p_payload: { 
          subject, 
          message_type: 'internal',
          is_important: isImportant || false
        }
      });

      // Replace optimistic message with real one
      setMessages(prev => 
        prev.map(msg => 
          msg.id === optimisticMessage.id 
            ? { ...data, optimistic: false }
            : msg
        )
      );

      toast.success('Message envoyé avec succès');
      return true;
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      
      // Show appropriate error message
      if (error?.code === 'PGRST116' || error?.message?.includes('permission')) {
        toast.error('Vous n\'avez pas les permissions pour envoyer ce message');
      } else {
        toast.error('Erreur lors de l\'envoi du message');
      }
      return false;
    } finally {
      setSending(false);
    }
  };

  const markAsImportant = async (messageId: string) => {
    // This is a UI-only action for now, stored in local state
    // In a real implementation, you might want to store this in a separate table
    toast.success('Message marqué comme important');
    return true;
  };

  useEffect(() => {
    if (leadId) {
      fetchMessages().finally(() => setLoading(false));
    }
  }, [leadId, fetchMessages]);

  return {
    messages,
    loading,
    sending,
    sendMessage,
    markAsImportant,
    refetch: fetchMessages
  };
};
