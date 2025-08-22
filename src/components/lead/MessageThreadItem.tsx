
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, Star, MoreVertical, Reply, Archive } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  lead_id: string;
  direction: 'internal' | 'inbound';
  subject: string;
  body_html: string | null;
  body_text: string | null;
  from_user_id: string | null;
  created_at: string;
  updated_at: string;
}

interface MessageThreadItemProps {
  message: Message;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onReply?: (subject: string) => void;
  onMarkImportant?: () => void;
  isImportant?: boolean;
  optimisticUpdate?: boolean;
}

export const MessageThreadItem = ({ 
  message, 
  isExpanded = false, 
  onToggleExpand,
  onReply,
  onMarkImportant,
  isImportant = false,
  optimisticUpdate = false
}: MessageThreadItemProps) => {
  const [localImportant, setLocalImportant] = useState(isImportant);

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

  const getMessageExcerpt = (text: string | null, maxLength: number = 120) => {
    if (!text) return '';
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/\n/g, ' ');
    return cleanText.length > maxLength 
      ? cleanText.substring(0, maxLength) + '...' 
      : cleanText;
  };

  const handleMarkImportant = () => {
    setLocalImportant(!localImportant);
    onMarkImportant?.();
  };

  const handleReply = () => {
    onReply?.(`Re: ${message.subject}`);
  };

  return (
    <div
      className={cn(
        "border rounded-lg transition-all duration-200 hover:shadow-sm",
        optimisticUpdate && "opacity-70 animate-pulse",
        localImportant && "border-yellow-200 bg-yellow-50/50",
        isExpanded && "ring-2 ring-primary/20"
      )}
    >
      {/* Message Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            {getDirectionIcon(message.direction)}
            <Badge 
              variant={message.direction === 'internal' ? 'default' : 'secondary'}
              className="shrink-0"
            >
              {getDirectionLabel(message.direction)}
            </Badge>
            {localImportant && (
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">
              {format(new Date(message.created_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleReply}>
                  <Reply className="mr-2 h-4 w-4" />
                  Répondre
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMarkImportant}>
                  <Star className="mr-2 h-4 w-4" />
                  {localImportant ? 'Retirer importance' : 'Marquer important'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="mr-2 h-4 w-4" />
                  Archiver
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div 
          className="cursor-pointer"
          onClick={onToggleExpand}
        >
          <h4 className="font-medium text-sm mb-1 flex items-center gap-2">
            {message.subject}
            {!isExpanded && message.body_text && (
              <span className="text-xs text-muted-foreground">
                - {getMessageExcerpt(message.body_text)}
              </span>
            )}
          </h4>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && message.body_text && (
        <div className="px-4 pb-4 border-t bg-muted/20">
          <div className="mt-3">
            {message.body_html ? (
              <div 
                className="prose prose-sm max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: message.body_html }}
              />
            ) : (
              <div className="text-sm whitespace-pre-wrap text-muted-foreground">
                {message.body_text}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-4 pt-3 border-t">
            <Button size="sm" variant="outline" onClick={handleReply}>
              <Reply className="h-3 w-3 mr-1" />
              Répondre
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
