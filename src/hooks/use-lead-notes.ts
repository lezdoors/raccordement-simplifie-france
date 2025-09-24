import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface LeadNote {
  id: string;
  lead_id: string;
  content: string;
  body?: string;
  is_pinned?: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useLeadNotes = (leadId: string) => {
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchNotes = async () => {
    try {
      console.log('Lead notes fetching disabled - database schema not ready');
      setNotes([]);
    } catch (error) {
      console.error('Error fetching lead notes:', error);
      toast.error('Erreur lors du chargement des notes');
    }
  };

  const addNote = async (content: string) => {
    setSaving(true);
    try {
      console.log('Note adding disabled - database schema not ready');
      toast.info("Note adding not yet implemented");
      return true;
    } catch (error: any) {
      console.error('Error adding note:', error);
      toast.error('Erreur lors de l\'ajout de la note');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateNote = async (noteId: string, content: string) => {
    setSaving(true);
    try {
      console.log('Note updating disabled - database schema not ready');
      toast.info("Note updating not yet implemented");
      return true;
    } catch (error: any) {
      console.error('Error updating note:', error);
      toast.error('Erreur lors de la mise à jour de la note');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      console.log('Note deletion disabled - database schema not ready');
      toast.info("Note deletion not yet implemented");
    } catch (error: any) {
      console.error('Error deleting note:', error);
      toast.error('Erreur lors de la suppression de la note');
    }
  };

  const togglePin = async (noteId: string) => {
    console.log('Note pinning disabled - database schema not ready');
    toast.info("Note pinning not yet implemented");
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
    deleteNote,
    togglePin,
    refetch: fetchNotes
  };
};