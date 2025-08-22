
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

export interface LeadNote {
  id: string;
  lead_id: string;
  note: string;
  created_at: string;
  admin_email: string;
  note_type: string;
  body?: string;
  is_pinned?: boolean;
  updated_at?: string;
}

export const useLeadNotes = (leadId: string) => {
  const { user } = useAdmin();
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_notes')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching lead notes:', error);
      toast.error('Erreur lors du chargement des notes');
    }
  };

  const addNote = async (body: string, isPinned?: boolean) => {
    if (!user) {
      toast.error('Utilisateur non authentifié');
      return false;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('lead_notes')
        .insert({
          lead_id: leadId,
          note: body,
          note_type: 'note',
          admin_email: user.email,
          body: body,
          is_pinned: isPinned || false
        });

      if (error) throw error;

      // Log the event
      await supabase.rpc('log_lead_event', {
        p_lead_id: leadId,
        p_type: 'note_added',
        p_actor_id: user.id,
        p_payload: { content_length: body.length, is_pinned: isPinned }
      });

      toast.success('Note ajoutée avec succès');
      await fetchNotes();
      return true;
    } catch (error: any) {
      console.error('Error adding note:', error);
      toast.error('Erreur lors de l\'ajout de la note');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateNote = async (noteId: string, body: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('lead_notes')
        .update({ note: body, body: body })
        .eq('id', noteId);

      if (error) throw error;

      toast.success('Note mise à jour avec succès');
      await fetchNotes();
      return true;
    } catch (error: any) {
      console.error('Error updating note:', error);
      toast.error('Erreur lors de la mise à jour de la note');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const togglePin = async (noteId: string, isPinned: boolean) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('lead_notes')
        .update({ is_pinned: isPinned })
        .eq('id', noteId);

      if (error) throw error;

      toast.success(isPinned ? 'Note épinglée' : 'Note désépinglée');
      await fetchNotes();
      return true;
    } catch (error: any) {
      console.error('Error toggling pin:', error);
      toast.error('Erreur lors de la modification');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('lead_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      toast.success('Note supprimée avec succès');
      await fetchNotes();
      return true;
    } catch (error: any) {
      console.error('Error deleting note:', error);
      toast.error('Erreur lors de la suppression de la note');
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchNotes().finally(() => setLoading(false));
    }
  }, [leadId]);

  return {
    notes,
    loading,
    saving,
    addNote,
    updateNote,
    togglePin,
    deleteNote,
    refetch: fetchNotes
  };
};
