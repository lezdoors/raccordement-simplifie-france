
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';

interface NotesEditorProps {
  onSave: (body: string, isPinned?: boolean) => Promise<any>;
  initialValue?: string;
  initialPinned?: boolean;
  onCancel?: () => void;
  placeholder?: string;
}

export const NotesEditor: React.FC<NotesEditorProps> = ({
  onSave,
  initialValue = '',
  initialPinned = false,
  onCancel,
  placeholder = 'Saisissez votre note...'
}) => {
  const [body, setBody] = useState(initialValue);
  const [isPinned, setIsPinned] = useState(initialPinned);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!body.trim()) return;

    setSaving(true);
    try {
      await onSave(body.trim(), isPinned);
      setBody('');
      setIsPinned(false);
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setBody(initialValue);
    setIsPinned(initialPinned);
    if (onCancel) {
      onCancel();
    }
  };

  const handlePinChange = (checked: boolean | "indeterminate") => {
    setIsPinned(checked === true);
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px]"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="pin-note"
            checked={isPinned}
            onCheckedChange={handlePinChange}
          />
          <Label htmlFor="pin-note" className="text-sm">
            Épingler cette note
          </Label>
        </div>
        
        <div className="flex gap-2">
          {onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={saving}
            >
              <X className="h-4 w-4 mr-1" />
              Annuler
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!body.trim() || saving}
          >
            <Save className="h-4 w-4 mr-1" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
};
