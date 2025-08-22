
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LeadNote {
  id: string;
  lead_id: string;
  admin_email: string;
  note: string;
  note_type: string;
  created_at: string;
  // Map database fields to expected interface
  body: string;
  is_pinned: boolean;
  updated_at: string;
}

export const useLeadNotes = (leadId: string) => {
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lead_notes')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map database fields to expected interface
      const mappedNotes = (data || []).map(note => ({
        ...note,
        body: note.note, // Map 'note' field to 'body'
        is_pinned: note.note_type === 'pinned', // Use note_type to determine if pinned
        updated_at: note.created_at // Use created_at as updated_at since there's no updated_at field
      }));
      
      setNotes(mappedNotes);
    } catch (err: any) {
      console.error('Error fetching notes:', err);
      setError('Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (body: string, isPinned: boolean = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('lead_notes')
        .insert({
          lead_id: leadId,
          admin_email: user.email,
          note: body,
          note_type: isPinned ? 'pinned' : 'note'
        })
        .select()
        .single();

      if (error) throw error;

      const mappedNote = {
        ...data,
        body: data.note,
        is_pinned: data.note_type === 'pinned',
        updated_at: data.created_at
      };

      setNotes(prev => [mappedNote, ...prev]);
      toast.success('Note ajoutée avec succès');
      return mappedNote;
    } catch (err: any) {
      console.error('Error adding note:', err);
      toast.error('Erreur lors de l\'ajout de la note');
      throw err;
    }
  };

  const updateNote = async (noteId: string, body: string) => {
    try {
      const { data, error } = await supabase
        .from('lead_notes')
        .update({ note: body })
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => prev.map(note => 
        note.id === noteId ? { 
          ...note, 
          body: data.note,
          note: data.note,
          updated_at: data.created_at 
        } : note
      ));
      toast.success('Note modifiée avec succès');
    } catch (err: any) {
      console.error('Error updating note:', err);
      toast.error('Erreur lors de la modification de la note');
    }
  };

  const togglePin = async (noteId: string, isPinned: boolean) => {
    try {
      const { data, error } = await supabase
        .from('lead_notes')
        .update({ note_type: isPinned ? 'pinned' : 'note' })
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => prev.map(note => 
        note.id === noteId ? { 
          ...note, 
          is_pinned: isPinned,
          note_type: data.note_type 
        } : note
      ));
      toast.success(isPinned ? 'Note épinglée' : 'Note désépinglée');
    } catch (err: any) {
      console.error('Error toggling pin:', err);
      toast.error('Erreur lors de l\'épinglage');
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('lead_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));
      toast.success('Note supprimée avec succès');
    } catch (err: any) {
      console.error('Error deleting note:', err);
      toast.error('Erreur lors de la suppression de la note');
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchNotes();
    }
  }, [leadId]);

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    togglePin,
    deleteNote,
    refetch: fetchNotes
  };
};
