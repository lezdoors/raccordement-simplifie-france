
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Send, ArrowDown, ArrowUp } from 'lucide-react';
import { useInternalMessages } from '@/hooks/use-internal-messages';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InternalMessagesTabProps {
  leadId: string;
}

export const InternalMessagesTab = ({ leadId }: InternalMessagesTabProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const { messages, loading, sending, sendMessage } = useInternalMessages(leadId);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      return;
    }

    const success = await sendMessage(subject, message);
    if (success) {
      setIsOpen(false);
      setSubject('');
      setMessage('');
    }
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'internal' ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-green-600" />
    );
  };

  const getDirectionLabel = (direction: string) => {
    return direction === 'internal' ? 'Message interne' : 'Message entrant';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* New Message Button */}
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Nouveau message interne
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Nouveau message interne
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Objet</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Objet du message..."
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Votre message..."
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleSend}
                  disabled={sending || !subject.trim() || !message.trim()}
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

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages ({messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucun message pour ce lead
            </p>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getDirectionIcon(msg.direction)}
                        <Badge variant={msg.direction === 'internal' ? 'default' : 'secondary'}>
                          {getDirectionLabel(msg.direction)}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(msg.created_at), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </div>
                    </div>

                    <h4 className="font-medium text-sm mb-2">
                      {msg.subject}
                    </h4>

                    {msg.body_text && (
                      <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded border-l-2 border-primary/20">
                        <div className="whitespace-pre-wrap">
                          {msg.body_text}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
