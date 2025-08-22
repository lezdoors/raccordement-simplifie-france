
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Clock, User, FileText, MessageSquare, Upload, UserCheck } from 'lucide-react';
import { useLeadEvents } from '@/hooks/use-lead-events';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimelineTabProps {
  leadId: string;
}

export const TimelineTab = ({ leadId }: TimelineTabProps) => {
  const { events, loading } = useLeadEvents(leadId);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'status_changed':
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      case 'note_added':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'message_added':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'file_uploaded':
        return <Upload className="h-4 w-4 text-orange-600" />;
      case 'assignment_changed':
        return <User className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventLabel = (type: string) => {
    const labels: Record<string, string> = {
      'status_changed': 'Statut modifié',
      'note_added': 'Note ajoutée',
      'message_added': 'Message ajouté',
      'file_uploaded': 'Fichier uploadé',
      'assignment_changed': 'Assignation modifiée'
    };
    return labels[type] || type;
  };

  const getEventDescription = (event: any) => {
    switch (event.type) {
      case 'status_changed':
        return `Statut changé: ${event.payload?.old_status || 'N/A'} → ${event.payload?.new_status || 'N/A'}`;
      case 'note_added':
        return `Note: "${event.payload?.title || 'Sans titre'}"`;
      case 'message_added':
        return `Message: "${event.payload?.subject || 'Sans objet'}"`;
      case 'file_uploaded':
        return `Fichier: ${event.payload?.filename || 'Fichier uploadé'}`;
      case 'assignment_changed':
        return `Assigné à: ${event.payload?.new_assignee || 'Non assigné'}`;
      default:
        return 'Événement';
    }
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Timeline des événements ({events.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucun événement enregistré pour ce lead
          </p>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={event.id} className="flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted border-2 border-background">
                      {getEventIcon(event.type)}
                    </div>
                    {index < events.length - 1 && (
                      <div className="w-px h-8 bg-border mt-2"></div>
                    )}
                  </div>

                  {/* Event content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {getEventLabel(event.type)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(event.created_at), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getEventDescription(event)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
