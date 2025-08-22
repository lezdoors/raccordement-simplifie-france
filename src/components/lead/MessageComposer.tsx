
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MessageSquare, Send, ChevronDown, Star, FileText, AlertCircle } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface MessageComposerProps {
  onSendMessage: (subject: string, bodyText: string, bodyHtml: string, isImportant?: boolean) => Promise<boolean>;
  sending: boolean;
}

export const MessageComposer = ({ onSendMessage, sending }: MessageComposerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !bodyText.trim()) {
      return;
    }

    const success = await onSendMessage(subject, bodyText, bodyHtml, isImportant);
    if (success) {
      setIsOpen(false);
      setSubject('');
      setBodyHtml('');
      setBodyText('');
      setIsImportant(false);
    }
  };

  const handleQuickAction = (type: string) => {
    switch (type) {
      case 'note':
        setSubject('Note interne');
        setBodyText('');
        setBodyHtml('');
        setIsImportant(false);
        setIsOpen(true);
        break;
      case 'important':
        setSubject('Message important');
        setBodyText('');
        setBodyHtml('');
        setIsImportant(true);
        setIsOpen(true);
        break;
      case 'followup':
        setSubject('Suivi client');
        setBodyText('Point de suivi concernant le dossier...');
        setBodyHtml('Point de suivi concernant le dossier...');
        setIsImportant(false);
        setIsOpen(true);
        break;
    }
  };

  const handleContentChange = (html: string, text: string) => {
    setBodyHtml(html);
    setBodyText(text);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Actions rapides
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleQuickAction('note')}>
            <FileText className="mr-2 h-4 w-4" />
            Nouvelle note
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickAction('important')}>
            <Star className="mr-2 h-4 w-4" />
            Message important
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickAction('followup')}>
            <AlertCircle className="mr-2 h-4 w-4" />
            Suivi client
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Nouveau message
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Nouveau message interne
              {isImportant && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Objet *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Objet du message..."
                disabled={sending}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="important"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                disabled={sending}
                className="rounded"
              />
              <Label htmlFor="important" className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                Marquer comme important
              </Label>
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <RichTextEditor
                value={bodyText}
                onChange={handleContentChange}
                placeholder="Votre message..."
                disabled={sending}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={sending}>
                Annuler
              </Button>
              <Button 
                onClick={handleSend}
                disabled={sending || !subject.trim() || !bodyText.trim()}
                className="flex items-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Envoyer
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
