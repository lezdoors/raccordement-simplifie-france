
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotesEditor } from './NotesEditor';
import { LeadNote } from '@/hooks/use-lead-notes';
import { Pin, Edit, Trash2, PinOff } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface NoteItemProps {
  note: LeadNote;
  onUpdate: (noteId: string, body: string) => Promise<void>;
  onTogglePin: (noteId: string, isPinned: boolean) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
}

export const NoteItem: React.FC<NoteItemProps> = ({
  note,
  onUpdate,
  onTogglePin,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async (body: string) => {
    await onUpdate(note.id, body);
    setIsEditing(false);
  };

  const handleTogglePin = () => {
    onTogglePin(note.id, !note.is_pinned);
  };

  const handleDelete = () => {
    onDelete(note.id);
  };

  return (
    <Card className={`${note.is_pinned ? 'border-yellow-300 bg-yellow-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {note.is_pinned && (
              <Badge variant="secondary" className="text-xs">
                <Pin className="h-3 w-3 mr-1" />
                Épinglée
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">
              {format(new Date(note.created_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
            </span>
            {note.updated_at !== note.created_at && (
              <span className="text-xs text-muted-foreground">
                (modifiée)
              </span>
            )}
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTogglePin}
              className="h-8 w-8 p-0"
            >
              {note.is_pinned ? (
                <PinOff className="h-4 w-4" />
              ) : (
                <Pin className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer la note</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isEditing ? (
          <NotesEditor
            initialValue={note.body}
            initialPinned={note.is_pinned}
            onSave={handleUpdate}
            onCancel={() => setIsEditing(false)}
            placeholder="Modifier la note..."
          />
        ) : (
          <div className="whitespace-pre-wrap text-sm">
            {note.body}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
