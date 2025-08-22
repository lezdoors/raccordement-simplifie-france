
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';
import { MessageComposer } from './MessageComposer';
import { MessageThreadItem } from './MessageThreadItem';
import { useInternalMessagesEnhanced } from '@/hooks/use-internal-messages-enhanced';

interface InternalMessagesTabProps {
  leadId: string;
}

export const InternalMessagesTab = ({ leadId }: InternalMessagesTabProps) => {
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [importantMessages, setImportantMessages] = useState<Set<string>>(new Set());

  const { messages, loading, sending, sendMessage, markAsImportant } = useInternalMessagesEnhanced(leadId);

  const handleSendMessage = async (
    subject: string, 
    bodyText: string, 
    bodyHtml: string, 
    isImportant?: boolean
  ) => {
    const success = await sendMessage(subject, bodyText, bodyHtml, isImportant);
    if (success && isImportant) {
      // Add to important messages (UI only for now)
      setTimeout(() => {
        const newMessage = messages.find(m => m.subject === subject);
        if (newMessage) {
          setImportantMessages(prev => new Set([...prev, newMessage.id]));
        }
      }, 100);
    }
    return success;
  };

  const handleToggleExpand = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleReply = (subject: string) => {
    // This would open the composer with the reply subject pre-filled
    // For now, we'll just show a toast
    console.log('Reply to:', subject);
  };

  const handleMarkImportant = (messageId: string) => {
    setImportantMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
    markAsImportant(messageId);
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
      {/* Message Composer */}
      <div className="flex justify-end">
        <MessageComposer 
          onSendMessage={handleSendMessage}
          sending={sending}
        />
      </div>

      {/* Messages Thread */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages ({messages.length})
            {importantMessages.size > 0 && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                {importantMessages.size} important{importantMessages.size > 1 ? 's' : ''}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucun message pour ce lead
            </p>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {messages.map((message) => (
                  <MessageThreadItem
                    key={message.id}
                    message={message}
                    isExpanded={expandedMessages.has(message.id)}
                    onToggleExpand={() => handleToggleExpand(message.id)}
                    onReply={handleReply}
                    onMarkImportant={() => handleMarkImportant(message.id)}
                    isImportant={importantMessages.has(message.id)}
                    optimisticUpdate={message.optimistic}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
