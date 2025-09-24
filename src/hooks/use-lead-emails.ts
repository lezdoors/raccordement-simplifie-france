
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
      console.log('Email templates disabled - database schema not ready');
      setTemplates([]);
    } catch (error) {
      console.error('Error fetching email templates:', error);
      toast.error('Erreur lors du chargement des modèles');
    }
  };

  // Fetch emails for this lead
  const fetchEmails = async () => {
    try {
      console.log('Lead emails disabled - database schema not ready');
      setEmails([]);
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

      // Email recording disabled - database schema not ready
      console.log('Email recording disabled');

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
