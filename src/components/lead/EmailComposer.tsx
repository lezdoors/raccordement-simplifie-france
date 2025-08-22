
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, Send, Template, X } from 'lucide-react';
import { useLeadEmails } from '@/hooks/use-lead-emails';

interface EmailComposerProps {
  leadId: string;
  leadEmail: string;
  leadName: string;
  leadData?: {
    prenom?: string;
    nom?: string;
    ville?: string;
    type_projet?: string;
  };
}

export const EmailComposer = ({ 
  leadId, 
  leadEmail, 
  leadName, 
  leadData = {} 
}: EmailComposerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [to, setTo] = useState(leadEmail);

  const { templates, sending, sendEmail, replaceTemplateVariables } = useLeadEmails(leadId);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    // Prepare variables for replacement
    const variables = {
      prenom: leadData.prenom || leadName.split(' ')[0] || '',
      nom: leadData.nom || leadName.split(' ').slice(1).join(' ') || '',
      ville: leadData.ville || '',
      type_projet: leadData.type_projet || 'raccordement électrique',
      ref_dossier: leadId.split('-')[0].toUpperCase(),
      liste_pieces: '• Plan de situation\n• Autorisation d\'urbanisme\n• Plan de masse',
      lien_paiement: `https://racco-service.com/paiement/${leadId}`
    };

    setSubject(replaceTemplateVariables(template.subject, variables));
    setMessage(replaceTemplateVariables(template.body_text || template.body_html.replace(/<[^>]*>/g, ''), variables));
  };

  const handleSend = async () => {
    if (!to || !subject || !message) {
      return;
    }

    const success = await sendEmail(to, subject, message, leadName);
    if (success) {
      setIsOpen(false);
      setSelectedTemplate('');
      setSubject('');
      setMessage('');
      setTo(leadEmail);
    }
  };

  const resetForm = () => {
    setSelectedTemplate('');
    setSubject('');
    setMessage('');
    setTo(leadEmail);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Envoyer un email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Composer un email pour {leadName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Template className="h-4 w-4" />
                Utiliser un modèle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choisir un modèle..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name.replace(/_/g, ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={() => handleTemplateSelect(selectedTemplate)}
                  disabled={!selectedTemplate}
                >
                  Appliquer
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={resetForm}
                  title="Réinitialiser"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="to">Destinataire</Label>
              <Input
                id="to"
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <Label htmlFor="subject">Objet</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Objet de l'email..."
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Votre message..."
                rows={10}
                className="resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSend}
              disabled={sending || !to || !subject || !message}
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
  );
};
