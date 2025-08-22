
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Clock, User, FileText, MessageSquare, Upload, UserCheck, Mail, Bell, Settings, Filter } from 'lucide-react';
import { useLeadEvents } from '@/hooks/use-lead-events-enhanced';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';

interface EnhancedTimelineTabProps {
  leadId: string;
}

export const EnhancedTimelineTab = ({ leadId }: EnhancedTimelineTabProps) => {
  const { events, loading, refetch } = useLeadEvents(leadId);
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const getEventIcon = (type: string) => {
    const iconMap = {
      'status_changed': <UserCheck className="h-4 w-4 text-blue-600" />,
      'note_added': <FileText className="h-4 w-4 text-green-600" />,
      'message_added': <MessageSquare className="h-4 w-4 text-purple-600" />,
      'file_uploaded': <Upload className="h-4 w-4 text-orange-600" />,
      'file_deleted': <Upload className="h-4 w-4 text-red-600" />,
      'assignment_changed': <User className="h-4 w-4 text-red-600" />,
      'email_sent': <Mail className="h-4 w-4 text-cyan-600" />,
      'lead_created': <Bell className="h-4 w-4 text-emerald-600" />,
      'contact_updated': <Settings className="h-4 w-4 text-gray-600" />
    };
    return iconMap[type as keyof typeof iconMap] || <Clock className="h-4 w-4 text-gray-600" />;
  };

  const getEventLabel = (type: string) => {
    const labels: Record<string, string> = {
      'status_changed': 'Statut modifié',
      'note_added': 'Note ajoutée',
      'message_added': 'Message ajouté',
      'file_uploaded': 'Fichier uploadé',
      'file_deleted': 'Fichier supprimé',
      'assignment_changed': 'Assignation modifiée',
      'email_sent': 'Email envoyé',
      'lead_created': 'Lead créé',
      'contact_updated': 'Contact mis à jour'
    };
    return labels[type] || type;
  };

  const getEventDescription = (event: any) => {
    const { type, payload } = event;
    
    switch (type) {
      case 'status_changed':
        return `Statut changé: ${payload?.old_status || 'N/A'} → ${payload?.new_status || 'N/A'}`;
      case 'note_added':
        const noteLength = payload?.content_length || 0;
        return `Note ajoutée (${noteLength} caractères)${payload?.is_pinned ? ' - Épinglée' : ''}`;
      case 'message_added':
        return `Message: "${payload?.subject || 'Sans objet'}" (${payload?.direction || 'interne'})`;
      case 'file_uploaded':
        const fileSize = payload?.file_size ? `${Math.round(payload.file_size / 1024)}KB` : '';
        return `Fichier: ${payload?.filename || 'Fichier uploadé'} ${fileSize}`;
      case 'file_deleted':
        return `Fichier supprimé: ${payload?.filename || 'Fichier'}`;
      case 'assignment_changed':
        return `Assigné ${payload?.old_assignee ? `de ${payload.old_assignee} ` : ''}à: ${payload?.new_assignee || 'Non assigné'}`;
      case 'email_sent':
        return `Email envoyé à: ${payload?.to_email || 'destinataire'} - "${payload?.subject || 'Sans objet'}"`;
      case 'lead_created':
        return `Lead créé via ${payload?.form_type || 'formulaire'}`;
      case 'contact_updated':
        const fields = payload?.updated_fields || [];
        return `Contact mis à jour: ${fields.join(', ')}`;
      default:
        return 'Événement';
    }
  };

  const getUserAvatar = (event: any) => {
    // Get initials from actor email or use system
    const email = event.actor_email || 'system';
    if (email === 'system') {
      return (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-muted text-xs">SYS</AvatarFallback>
        </Avatar>
      );
    }
    const initials = email.split('@')[0].slice(0, 2).toUpperCase();
    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
    );
  };

  const getEventPriority = (type: string) => {
    const priorityMap = {
      'status_changed': 'high',
      'assignment_changed': 'high',
      'email_sent': 'medium',
      'note_added': 'medium',
      'file_uploaded': 'medium',
      'message_added': 'low',
      'contact_updated': 'low'
    };
    return priorityMap[type as keyof typeof priorityMap] || 'low';
  };

  const filteredEvents = events.filter(event => {
    if (eventTypeFilter !== 'all' && event.type !== eventTypeFilter) {
      return false;
    }
    
    if (dateFilter !== 'all') {
      const eventDate = new Date(event.created_at);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          return eventDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return eventDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return eventDate >= monthAgo;
        default:
          return true;
      }
    }
    
    return true;
  });

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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timeline des événements ({filteredEvents.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="status_changed">Statut</SelectItem>
                <SelectItem value="note_added">Notes</SelectItem>
                <SelectItem value="file_uploaded">Fichiers</SelectItem>
                <SelectItem value="email_sent">Emails</SelectItem>
                <SelectItem value="assignment_changed">Assignation</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tout</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">7 jours</SelectItem>
                <SelectItem value="month">30 jours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredEvents.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucun événement trouvé pour les filtres sélectionnés
          </p>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {filteredEvents.map((event, index) => {
                const priority = getEventPriority(event.type);
                return (
                  <div key={event.id} className="flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-background ${
                        priority === 'high' ? 'bg-red-100' : 
                        priority === 'medium' ? 'bg-yellow-100' : 'bg-muted'
                      }`}>
                        {getEventIcon(event.type)}
                      </div>
                      {index < filteredEvents.length - 1 && (
                        <div className="w-px h-8 bg-border mt-2"></div>
                      )}
                    </div>

                    {/* Event content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              priority === 'high' ? 'border-red-300 text-red-700' :
                              priority === 'medium' ? 'border-yellow-300 text-yellow-700' : ''
                            }`}
                          >
                            {getEventLabel(event.type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(event.created_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                          </span>
                        </div>
                        {getUserAvatar(event)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {getEventDescription(event)}
                      </p>
                      {event.actor_email && event.actor_email !== 'system' && (
                        <p className="text-xs text-muted-foreground">
                          Par: {event.actor_email}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
