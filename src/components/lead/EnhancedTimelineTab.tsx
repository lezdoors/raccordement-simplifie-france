import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, User, MessageSquare, FileText, Phone, Mail, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useLeadEventsEnhanced } from '@/hooks/use-lead-events-enhanced';

interface EnhancedTimelineTabProps {
  leadId: string;
}

export const EnhancedTimelineTab: React.FC<EnhancedTimelineTabProps> = ({ leadId }) => {
  const { events, loading } = useLeadEventsEnhanced(leadId);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Aucun événement dans la chronologie</p>
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'note':
        return <FileText className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'call':
        return 'bg-green-100 text-green-800';
      case 'email':
        return 'bg-blue-100 text-blue-800';
      case 'note':
        return 'bg-yellow-100 text-yellow-800';
      case 'message':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ScrollArea className="h-[600px] p-4">
      <div className="space-y-4">
        {events.map((event, index) => (
          <Card key={event.id} className="relative">
            {index < events.length - 1 && (
              <div className="absolute left-4 top-16 w-px h-4 bg-border" />
            )}
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${getEventColor(event.type)}`}>
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium capitalize">
                      {event.type}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(event.created_at), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>
                  {event.payload?.subject && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.payload.subject}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            {event.payload?.description && (
              <CardContent className="pt-0">
                <p className="text-sm">{event.payload.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};