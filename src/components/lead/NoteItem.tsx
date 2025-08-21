
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Pin, Edit2, Trash2, Save, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAdmin } from '@/contexts/AdminContext';
import type { LeadNote } from '@/hooks/use-lead-notes';

interface NoteItemProps {
  note: LeadNote;
  onUpdate: (noteId: string, body: string) => Promise<void>;
  onTogglePin: (noteId: string, isPinned: boolean) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
}

export const NoteItem = ({ note, onUpdate, onTogglePin, onDelete }: NoteItemProps) => {
  const { adminUser } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(note.body);
  const [loading, setLoading] = useState(false);

  const canDelete = adminUser?.role === 'superadmin' || adminUser?.role === 'manager';
  const canEdit = true; // All authenticated users can edit notes they have access to

  const handleSave = async () => {
    if (!editBody.trim() || editBody === note.body) {
      setIsEditing(false);
      setEditBody(note.body);
      return;
    }

    try {
      setLoading(true);
      await onUpdate(note.id, editBody.trim());
      setIsEditing(false);
    } catch (error) {
      setEditBody(note.body);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditBody(note.body);
  };

  const handleTogglePin = () => {
    onTogglePin(note.id, !note.is_pinned);
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      onDelete(note.id);
    }
  };

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true, 
      locale: fr 
    });
  };

  return (
    <div className={`border rounded-lg p-4 space-y-3 ${note.is_pinned ? 'border-yellow-200 bg-yellow-50' : 'bg-background'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">
              {note.author_id.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {formatTime(note.created_at)}
            </span>
            {note.is_pinned && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Pin className="w-3 h-3" />
                <span>Épinglé</span>
              </Badge>
            )}
            {note.updated_at !== note.created_at && (
              <span className="text-xs text-muted-foreground italic">
                modifié
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTogglePin}
            className={`h-8 w-8 p-0 ${note.is_pinned ? 'text-yellow-600' : 'text-muted-foreground'}`}
          >
            <Pin className="w-4 h-4" />
          </Button>
          
          {canEdit && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
          
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            disabled={loading}
            className="min-h-[80px]"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-1" />
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={loading || !editBody.trim()}
            >
              <Save className="w-4 h-4 mr-1" />
              Enregistrer
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-sm whitespace-pre-wrap text-foreground">
          {note.body}
        </div>
      )}
    </div>
  );
};
