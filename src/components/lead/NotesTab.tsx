
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotesEditor } from './NotesEditor';
import { NoteItem } from './NoteItem';
import { useLeadNotes } from '@/hooks/use-lead-notes';
import { Skeleton } from '@/components/ui/skeleton';
import { StickyNote } from 'lucide-react';

interface NotesTabProps {
  leadId: string;
}

export const NotesTab: React.FC<NotesTabProps> = ({ leadId }) => {
  const { notes, loading, addNote, updateNote, togglePin, deleteNote } = useLeadNotes(leadId);

  const handleAddNote = async (body: string, isPinned?: boolean) => {
    return await addNote(body, isPinned);
  };

  const handleUpdateNote = async (noteId: string, body: string) => {
    await updateNote(noteId, body);
  };

  const handleTogglePin = async (noteId: string, isPinned: boolean) => {
    await togglePin(noteId, isPinned);
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Note Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5" />
            Ajouter une note
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NotesEditor onSave={handleAddNote} />
        </CardContent>
      </Card>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Aucune note pour ce lead</p>
            </CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onUpdate={handleUpdateNote}
              onTogglePin={handleTogglePin}
              onDelete={handleDeleteNote}
            />
          ))
        )}
      </div>
    </div>
  );
};
