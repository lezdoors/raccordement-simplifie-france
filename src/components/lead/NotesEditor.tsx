
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Pin, Send } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface NotesEditorProps {
  onSubmit: (body: string, isPinned: boolean) => Promise<void>;
  disabled?: boolean;
}

export const NotesEditor = ({ onSubmit, disabled }: NotesEditorProps) => {
  const [body, setBody] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!body.trim()) return;

    try {
      setSubmitting(true);
      await onSubmit(body.trim(), isPinned);
      setBody('');
      setIsPinned(false);
    } catch (error) {
      // Error handled by parent
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/5">
      <Textarea
        placeholder="Ajouter une note... (Ctrl+Entrée pour envoyer)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || submitting}
        className="min-h-[100px] resize-none"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="pin-note"
            checked={isPinned}
            onCheckedChange={(checked) => setIsPinned(!!checked)}
            disabled={disabled || submitting}
          />
          <label 
            htmlFor="pin-note" 
            className="text-sm font-medium cursor-pointer flex items-center space-x-1"
          >
            <Pin className="w-3 h-3" />
            <span>Épingler cette note</span>
          </label>
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={disabled || submitting || !body.trim()}
          size="sm"
          className="flex items-center space-x-2"
        >
          <Send className="w-4 h-4" />
          <span>Ajouter</span>
        </Button>
      </div>
    </div>
  );
};
