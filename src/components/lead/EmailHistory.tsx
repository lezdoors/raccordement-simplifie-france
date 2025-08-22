
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail, ArrowUp, ArrowDown, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useLeadEmails } from '@/hooks/use-lead-emails';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmailHistoryProps {
  leadId: string;
}

export const EmailHistory = ({ leadId }: EmailHistoryProps) => {
  const { emails, loading } = useLeadEmails(leadId);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }

  const getEmailIcon = (direction: string) => {
    return direction === 'out' ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-green-600" />
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
      case 'bounced':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Mail className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'queued': 'En attente',
      'sent': 'Envoyé',
      'delivered': 'Délivré',
      'failed': 'Échec',
      'bounced': 'Rejeté',
      'opened': 'Ouvert',
      'clicked': 'Cliqué'
    };
    return labels[status] || status;
  };

  if (emails.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Historique des emails
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Aucun email envoyé pour ce lead
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Historique des emails ({emails.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {emails.map((email) => (
              <div
                key={email.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getEmailIcon(email.direction)}
                    <span className="font-medium text-sm">
                      {email.direction === 'out' ? 'Envoyé à' : 'Reçu de'}: {email.to_email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={email.status === 'sent' ? 'default' : 'secondary'} className="text-xs">
                      {getStatusIcon(email.status)}
                      <span className="ml-1">{getStatusLabel(email.status)}</span>
                    </Badge>
                  </div>
                </div>

                <h4 className="font-medium text-sm mb-2">
                  {email.subject}
                </h4>

                <div className="text-xs text-muted-foreground mb-2">
                  {format(new Date(email.created_at), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                </div>

                {email.body_text && (
                  <div className="text-sm text-muted-foreground bg-muted/30 p-2 rounded border-l-2 border-primary/20">
                    <p className="line-clamp-3">
                      {email.body_text.substring(0, 200)}
                      {email.body_text.length > 200 && '...'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
