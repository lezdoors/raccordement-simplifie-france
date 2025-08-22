
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';

export const useAutoEventLogger = (leadId: string) => {
  const { user } = useAdmin();

  const logEvent = useCallback(async (
    type: string,
    payload: any = {},
    customActorId?: string
  ) => {
    try {
      await supabase.rpc('log_lead_event', {
        p_lead_id: leadId,
        p_type: type,
        p_actor_id: customActorId || user?.id || null,
        p_payload: payload
      });
    } catch (error) {
      console.error('Auto event logging failed:', error);
    }
  }, [leadId, user?.id]);

  // Specific logging functions for common events
  const logStatusChange = useCallback((oldStatus: string, newStatus: string) => {
    logEvent('status_changed', { old_status: oldStatus, new_status: newStatus });
  }, [logEvent]);

  const logNoteAdded = useCallback((contentLength: number, isPinned: boolean = false) => {
    logEvent('note_added', { content_length: contentLength, is_pinned: isPinned });
  }, [logEvent]);

  const logFileUploaded = useCallback((filename: string, fileSize: number, mimeType: string) => {
    logEvent('file_uploaded', { filename, file_size: fileSize, mime_type: mimeType });
  }, [logEvent]);

  const logFileDeleted = useCallback((filename: string) => {
    logEvent('file_deleted', { filename });
  }, [logEvent]);

  const logAssignmentChange = useCallback((oldAssignee: string | null, newAssignee: string | null) => {
    logEvent('assignment_changed', { old_assignee: oldAssignee, new_assignee: newAssignee });
  }, [logEvent]);

  const logEmailSent = useCallback((toEmail: string, subject: string) => {
    logEvent('email_sent', { to_email: toEmail, subject });
  }, [logEvent]);

  const logContactUpdated = useCallback ((updatedFields: string[]) => {
    logEvent('contact_updated', { updated_fields: updatedFields });
  }, [logEvent]);

  return {
    logEvent,
    logStatusChange,
    logNoteAdded,
    logFileUploaded,
    logFileDeleted,
    logAssignmentChange,
    logEmailSent,
    logContactUpdated
  };
};
