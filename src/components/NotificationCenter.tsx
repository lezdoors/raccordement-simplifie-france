import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Bell, BellOff, Settings, Download, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NotificationSettings {
  newSubmissions: boolean;
  newMessages: boolean;
  newPayments: boolean;
  emailNotifications: boolean;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    newSubmissions: true,
    newMessages: true,
    newPayments: true,
    emailNotifications: false,
  });
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Set up real-time subscriptions
    const submissionsChannel = supabase
      .channel('submissions-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'form_submissions'
      }, (payload) => {
        if (settings.newSubmissions) {
          addNotification({
            type: 'submission',
            title: 'Nouvelle demande de raccordement',
            message: `${payload.new.prenom} ${payload.new.nom} - ${payload.new.client_type}`,
            data: payload.new,
            timestamp: new Date().toISOString()
          });
        }
      })
      .subscribe();

    const messagesChannel = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        if (settings.newMessages) {
          addNotification({
            type: 'message',
            title: 'Nouveau message de contact',
            message: `${payload.new.name} - ${payload.new.request_type}`,
            data: payload.new,
            timestamp: new Date().toISOString()
          });
        }
      })
      .subscribe();

    const paymentsChannel = supabase
      .channel('payments-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'payments'
      }, (payload) => {
        if (settings.newPayments) {
          addNotification({
            type: 'payment',
            title: 'Nouveau paiement',
            message: `${payload.new.amount / 100}€ - ${payload.new.status}`,
            data: payload.new,
            timestamp: new Date().toISOString()
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(submissionsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(paymentsChannel);
    };
  }, [settings]);

  const addNotification = (notification: any) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50
    setUnreadCount(prev => prev + 1);
    
    // Show toast notification
    toast.success(notification.title, {
      description: notification.message,
    });
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  const exportData = async () => {
    try {
      // Fetch all data
      const [submissionsRes, messagesRes, paymentsRes] = await Promise.all([
        supabase.from('form_submissions').select('*'),
        supabase.from('messages').select('*'),
        supabase.from('payments').select('*'),
      ]);

      const data = {
        submissions: submissionsRes.data || [],
        messages: messagesRes.data || [],
        payments: paymentsRes.data || [],
        exported_at: new Date().toISOString(),
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `raccordement-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Données exportées avec succès');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'submission': return '📋';
      case 'message': return '💬';
      case 'payment': return '💳';
      default: return '🔔';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Paramètres des notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="new-submissions">Nouvelles demandes</Label>
              <Switch
                id="new-submissions"
                checked={settings.newSubmissions}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, newSubmissions: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-messages">Nouveaux messages</Label>
              <Switch
                id="new-messages"
                checked={settings.newMessages}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, newMessages: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-payments">Nouveaux paiements</Label>
              <Switch
                id="new-payments"
                checked={settings.newPayments}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, newPayments: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Notifications email</Label>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={exportData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter les données
            </Button>
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Marquer comme lu ({unreadCount})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications en temps réel
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BellOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune notification pour le moment</p>
              <p className="text-sm">Les nouvelles activités apparaîtront ici en temps réel</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.map((notification, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;