
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Pin } from 'lucide-react';
import { useLeadNotes } from '@/hooks/use-lead-notes';
import { NotesEditor } from './NotesEditor';
import { NoteItem } from './NoteItem';

interface NotesTabProps {
  leadId: string;
}

export const NotesTab = ({ leadId }: NotesTabProps) => {
  const { 
    notes, 
    loading, 
    error, 
    addNote, 
    updateNote, 
    togglePin, 
    deleteNote 
  } = useLeadNotes(leadId);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  const pinnedNotes = notes.filter(note => note.is_pinned);
  const regularNotes = notes.filter(note => !note.is_pinned);

  return (
    <div className="space-y-6">
      {/* Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Ajouter une note</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NotesEditor onSubmit={addNote} />
        </CardContent>
      </Card>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Pin className="w-5 h-5 text-yellow-600" />
              <span>Notes épinglées</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pinnedNotes.map(note => (
              <NoteItem
                key={note.id}
                note={note}
                onUpdate={updateNote}
                onTogglePin={togglePin}
                onDelete={deleteNote}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Regular Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Notes ({regularNotes.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {regularNotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune note pour le moment
            </div>
          ) : (
            <div className="space-y-4">
              {regularNotes.map(note => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onUpdate={updateNote}
                  onTogglePin={togglePin}
                  onDelete={deleteNote}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
