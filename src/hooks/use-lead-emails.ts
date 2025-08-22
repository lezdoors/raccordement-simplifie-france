
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  variables: string[];
  is_active: boolean;
}

interface LeadEmail {
  id: string;
  lead_id: string;
  direction: 'out' | 'in';
  subject: string;
  body_html: string;
  body_text: string;
  from_email: string;
  to_email: string;
  status: string;
  created_at: string;
  sent_by: string;
}

export const useLeadEmails = (leadId: string) => {
  const { user } = useAdmin();
  const [emails, setEmails] = useState<LeadEmail[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Fetch email templates
  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching email templates:', error);
      toast.error('Erreur lors du chargement des modèles');
    }
  };

  // Fetch emails for this lead
  const fetchEmails = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_emails')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Erreur lors du chargement des emails');
    }
  };

  // Send email
  const sendEmail = async (
    to: string,
    subject: string,
    message: string,
    leadName: string
  ) => {
    if (!user) {
      toast.error('Utilisateur non authentifié');
      return false;
    }

    setSending(true);
    try {
      // Call the edge function to send the email
      const { data, error } = await supabase.functions.invoke('send-lead-email', {
        body: {
          to,
          subject,
          message,
          leadId,
          leadName
        }
      });

      if (error) throw error;

      // Record the email in our database
      const { error: dbError } = await supabase
        .from('lead_emails')
        .insert({
          lead_id: leadId,
          direction: 'out',
          subject,
          body_html: message.replace(/\n/g, '<br>'),
          body_text: message,
          from_email: 'contact@racco-service.com',
          to_email: to,
          status: 'sent',
          sent_by: user.id,
          provider_message_id: data.emailId
        });

      if (dbError) throw dbError;

      toast.success('Email envoyé avec succès');
      await fetchEmails(); // Refresh the email list
      return true;
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error('Erreur lors de l\'envoi de l\'email');
      return false;
    } finally {
      setSending(false);
    }
  };

  // Replace template variables
  const replaceTemplateVariables = (template: string, variables: Record<string, string>) => {
    let result = template;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value || `{{${key}}}`);
    });
    return result;
  };

  useEffect(() => {
    if (leadId) {
      Promise.all([fetchTemplates(), fetchEmails()]).finally(() => {
        setLoading(false);
      });
    }
  }, [leadId]);

  return {
    emails,
    templates,
    loading,
    sending,
    sendEmail,
    replaceTemplateVariables,
    refetch: () => Promise.all([fetchTemplates(), fetchEmails()])
  };
};
