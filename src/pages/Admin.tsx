import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart3, Users, MessageSquare, CreditCard, FileText, LogOut, Bell, Download, Eye, Filter, Search, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

// Interfaces
interface FormSubmission {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  client_type: string;
  project_type: string;
  adresse: string;
  ville: string;
  code_postal: string;
  form_status: string;
  form_status_detailed: string;
  payment_status: string;
  payment_status_detailed: string;
  total_amount: number;
  internal_notes: string;
  assigned_to: string;
  connection_type: string;
  power_type: string;
  power_kva: string;
  created_at: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  request_type: string;
  created_at: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  customer_email: string;
  customer_name: string;
  currency: string;
  created_at: string;
  paid_at: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  read_at: string;
  created_at: string;
}

const FORM_STATUSES = ["Nouveau", "En cours", "En attente Enedis", "Terminé"];
const PAYMENT_STATUSES = ["En attente", "Payé", "Remboursé"];
const TRAITEURS = ["Hossam", "Oussama", "Farah", "Rania"];

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    totalMessages: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    weeklySubmissions: 0,
    monthlySubmissions: 0,
    conversionRate: 0,
    abandonedSubmissions: 0,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // Verify admin access for current user
      const isAdminAuthorized = await checkAdminAccess(session.user.email || '');
      if (!isAdminAuthorized) {
        await supabase.auth.signOut();
        toast.error("⛔ Accès refusé. Cette adresse email n'est pas autorisée.");
        navigate('/login');
        return;
      }

      setUser(session.user);
      fetchData();
      setupRealtimeSubscriptions();
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
        navigate('/login');
      } else {
        // Check admin access on auth state change
        const isAdminAuthorized = await checkAdminAccess(session.user.email || '');
        if (!isAdminAuthorized) {
          await supabase.auth.signOut();
          toast.error("⛔ Accès refusé. Cette adresse email n'est pas autorisée.");
          navigate('/login');
          return;
        }
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminAccess = async (userEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('email, active, name, role')
        .eq('email', userEmail)
        .eq('active', true)
        .single();

      if (error || !data) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Real-time subscriptions for notifications
    const notificationsChannel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications'
      }, () => {
        fetchNotifications();
      })
      .subscribe();

    const submissionsChannel = supabase
      .channel('submissions-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'form_submissions'
      }, (payload) => {
        // Trigger notification
        sendNotification('new_submission', payload.new);
        fetchData();
      })
      .subscribe();

    const messagesChannel = supabase
      .channel('messages-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        sendNotification('new_message', payload.new);
        fetchData();
      })
      .subscribe();

    const paymentsChannel = supabase
      .channel('payments-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'payments'
      }, (payload) => {
        if (payload.new.status === 'succeeded') {
          sendNotification('new_payment', payload.new);
        }
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(submissionsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(paymentsChannel);
    };
  };

  const sendNotification = async (type: string, data: any) => {
    try {
      console.log('Admin: Sending notification:', type, data);
      const { data: result, error } = await supabase.functions.invoke('notify-admin', {
        body: { type, data }
      });
      
      if (error) {
        console.error('Admin: Notification error:', error);
      } else {
        console.log('Admin: Notification sent successfully:', result);
      }
    } catch (error) {
      console.error('Admin: Error sending notification:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Admin: Fetching data...');

      const [submissionsRes, messagesRes, paymentsRes] = await Promise.all([
        supabase.from('form_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('messages').select('*').order('created_at', { ascending: false }),
        supabase.from('payments').select('*').order('created_at', { ascending: false }),
      ]);

      console.log('Admin: Query results:', {
        submissions: submissionsRes.data?.length || 0,
        messages: messagesRes.data?.length || 0,
        payments: paymentsRes.data?.length || 0,
        errors: {
          submissions: submissionsRes.error,
          messages: messagesRes.error,
          payments: paymentsRes.error
        }
      });

      if (submissionsRes.error) throw submissionsRes.error;
      if (messagesRes.error) throw messagesRes.error;
      if (paymentsRes.error) throw paymentsRes.error;

      setSubmissions(submissionsRes.data || []);
      setMessages(messagesRes.data || []);
      setPayments(paymentsRes.data || []);

      // Calculate advanced stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const weeklySubmissions = (submissionsRes.data || []).filter(
        s => new Date(s.created_at) >= weekAgo
      ).length;

      const monthlySubmissions = (submissionsRes.data || []).filter(
        s => new Date(s.created_at) >= monthAgo
      ).length;

      const totalRevenue = (paymentsRes.data || [])
        .filter(p => p.status === 'succeeded')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const pendingPayments = (paymentsRes.data || [])
        .filter(p => p.status === 'pending').length;

      const paidSubmissions = (submissionsRes.data || [])
        .filter(s => s.payment_status === 'succeeded' || s.payment_status_detailed === 'Payé').length;

      const conversionRate = submissionsRes.data?.length > 0 
        ? (paidSubmissions / submissionsRes.data.length) * 100 
        : 0;

      setStats({
        totalSubmissions: submissionsRes.data?.length || 0,
        totalMessages: messagesRes.data?.length || 0,
        totalRevenue: totalRevenue / 100,
        pendingPayments,
        weeklySubmissions,
        monthlySubmissions,
        conversionRate,
        abandonedSubmissions: 0, // Would need to implement step tracking
      });

      await fetchNotifications();

    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleStatusUpdate = async (id: string, field: string, value: string) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setSubmissions(prev => prev.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      ));

      toast.success('Statut mis à jour');
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleNotesUpdate = async (id: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({ internal_notes: notes })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => prev.map(s => 
        s.id === id ? { ...s, internal_notes: notes } : s
      ));

      toast.success('Notes mises à jour');
    } catch (error: any) {
      console.error('Error updating notes:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) {
      toast.error('Aucune donnée à exporter');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Export CSV réussi');
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', id);
      
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erreur lors de la déconnexion');
    } else {
      toast.success('Déconnexion réussie');
      navigate('/login');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getStatusBadge = (status: string, type: 'form' | 'payment' = 'form') => {
    const colors = {
      form: {
        'Nouveau': 'bg-blue-100 text-blue-800',
        'En cours': 'bg-yellow-100 text-yellow-800',
        'En attente Enedis': 'bg-orange-100 text-orange-800',
        'Terminé': 'bg-green-100 text-green-800',
      },
      payment: {
        'En attente': 'bg-yellow-100 text-yellow-800',
        'Payé': 'bg-green-100 text-green-800',
        'Remboursé': 'bg-red-100 text-red-800',
        'succeeded': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'failed': 'bg-red-100 text-red-800',
      }
    };

    const colorClass = colors[type][status as keyof typeof colors[typeof type]] || 'bg-gray-100 text-gray-800';

    return (
      <Badge className={colorClass}>
        {status}
      </Badge>
    );
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = searchTerm === "" || 
      submission.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.ville.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "tous" || 
      submission.form_status_detailed === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-muted-foreground">Bienvenue, {user.email}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchData} variant="outline">
              Actualiser
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Demandes totales</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.weeklySubmissions} cette semaine
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages de contact</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                Total des contacts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAmount(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingPayments} paiements en attente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Demandes → Paiements
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Activité récente
              {notifications.filter(n => !n.read_at).length > 0 && (
                <Badge variant="destructive">
                  {notifications.filter(n => !n.read_at).length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {notifications.slice(0, 10).map((notification) => (
                <div 
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
                    !notification.read_at ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <span className="text-2xl">
                    {notification.type === 'new_submission' && '📋'}
                    {notification.type === 'new_message' && '💬'}
                    {notification.type === 'new_payment' && '💳'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Aucune activité récente
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="submissions">Demandes de raccordement</TabsTrigger>
            <TabsTrigger value="messages">Messages de contact</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-4">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, email, ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  {FORM_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => exportToCSV(filteredSubmissions, 'demandes-raccordement')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter CSV
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Demandes de raccordement ({filteredSubmissions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Projet</TableHead>
                        <TableHead>Adresse</TableHead>
                        <TableHead>Status formulaire</TableHead>
                        <TableHead>Status paiement</TableHead>
                        <TableHead>Traiteur</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{submission.prenom} {submission.nom}</div>
                              <div className="text-sm text-muted-foreground">{submission.email}</div>
                              <div className="text-sm text-muted-foreground">{submission.telephone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{submission.project_type}</div>
                              <div className="text-sm text-muted-foreground">{submission.client_type}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {submission.adresse}<br />
                              {submission.code_postal} {submission.ville}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={submission.form_status_detailed || 'Nouveau'}
                              onValueChange={(value) => handleStatusUpdate(submission.id, 'form_status_detailed', value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {FORM_STATUSES.map(status => (
                                  <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={submission.payment_status_detailed || 'En attente'}
                              onValueChange={(value) => handleStatusUpdate(submission.id, 'payment_status_detailed', value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {PAYMENT_STATUSES.map(status => (
                                  <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={submission.assigned_to || ''}
                              onValueChange={(value) => handleStatusUpdate(submission.id, 'assigned_to', value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Assigner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">Non assigné</SelectItem>
                                {TRAITEURS.map(traiteur => (
                                  <SelectItem key={traiteur} value={traiteur}>{traiteur}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{submission.total_amount ? formatAmount(submission.total_amount) : '-'}</TableCell>
                          <TableCell>{formatDate(submission.created_at)}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedSubmission(submission)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    Détails de la demande - {submission.prenom} {submission.nom}
                                  </DialogTitle>
                                </DialogHeader>
                                {selectedSubmission && (
                                  <div className="space-y-6">
                                    {/* Client Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h3 className="font-semibold mb-2">Informations client</h3>
                                        <div className="space-y-1 text-sm">
                                          <p><strong>Nom:</strong> {selectedSubmission.prenom} {selectedSubmission.nom}</p>
                                          <p><strong>Email:</strong> {selectedSubmission.email}</p>
                                          <p><strong>Téléphone:</strong> {selectedSubmission.telephone}</p>
                                          <p><strong>Type:</strong> {selectedSubmission.client_type}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <h3 className="font-semibold mb-2">Projet</h3>
                                        <div className="space-y-1 text-sm">
                                          <p><strong>Type:</strong> {selectedSubmission.project_type}</p>
                                          <p><strong>Connexion:</strong> {selectedSubmission.connection_type}</p>
                                          <p><strong>Puissance:</strong> {selectedSubmission.power_kva} kVA</p>
                                          <p><strong>Type alimentation:</strong> {selectedSubmission.power_type}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                      <h3 className="font-semibold mb-2">Adresse</h3>
                                      <p className="text-sm">{selectedSubmission.adresse}</p>
                                      <p className="text-sm">{selectedSubmission.code_postal} {selectedSubmission.ville}</p>
                                    </div>

                                    {/* Status and Assignment */}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h3 className="font-semibold mb-2">Statuts</h3>
                                        <div className="space-y-2">
                                          <p className="text-sm">
                                            <strong>Formulaire:</strong> {getStatusBadge(selectedSubmission.form_status_detailed || 'Nouveau', 'form')}
                                          </p>
                                          <p className="text-sm">
                                            <strong>Paiement:</strong> {getStatusBadge(selectedSubmission.payment_status_detailed || 'En attente', 'payment')}
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        <h3 className="font-semibold mb-2">Attribution</h3>
                                        <p className="text-sm">
                                          <strong>Traiteur:</strong> {selectedSubmission.assigned_to || 'Non assigné'}
                                        </p>
                                        <p className="text-sm">
                                          <strong>Montant:</strong> {selectedSubmission.total_amount ? formatAmount(selectedSubmission.total_amount) : 'Non défini'}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Internal Notes */}
                                    <div>
                                      <h3 className="font-semibold mb-2">Notes internes</h3>
                                      <Textarea
                                        placeholder="Ajouter des notes internes..."
                                        value={selectedSubmission.internal_notes || ''}
                                        onChange={(e) => setSelectedSubmission({
                                          ...selectedSubmission,
                                          internal_notes: e.target.value
                                        })}
                                        className="min-h-20"
                                      />
                                      <Button
                                        onClick={() => handleNotesUpdate(selectedSubmission.id, selectedSubmission.internal_notes || '')}
                                        className="mt-2"
                                        size="sm"
                                      >
                                        Sauvegarder les notes
                                      </Button>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t">
                                      <Button
                                        onClick={() => {
                                          const info = `Nom: ${selectedSubmission.prenom} ${selectedSubmission.nom}\nEmail: ${selectedSubmission.email}\nTéléphone: ${selectedSubmission.telephone}\nProjet: ${selectedSubmission.project_type}\nAdresse: ${selectedSubmission.adresse}, ${selectedSubmission.ville}`;
                                          navigator.clipboard.writeText(info);
                                          toast.success('Informations copiées');
                                        }}
                                        variant="outline"
                                      >
                                        Copier les infos
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => exportToCSV(messages, 'messages-contact')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter CSV
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Messages de contact ({messages.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contact</TableHead>
                        <TableHead>Type de demande</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{message.name}</div>
                              <div className="text-sm text-muted-foreground">{message.email}</div>
                              {message.phone && (
                                <div className="text-sm text-muted-foreground">{message.phone}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(message.request_type)}</TableCell>
                          <TableCell>
                            <div className="max-w-md truncate" title={message.message}>
                              {message.message || 'Demande de rappel'}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(message.created_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => exportToCSV(payments, 'paiements')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter CSV
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Paiements ({payments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Devise</TableHead>
                        <TableHead>Date création</TableHead>
                        <TableHead>Date paiement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{payment.customer_name || '-'}</div>
                              <div className="text-sm text-muted-foreground">{payment.customer_email || '-'}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {payment.amount ? formatAmount(payment.amount / 100) : '-'}
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.status, 'payment')}</TableCell>
                          <TableCell className="uppercase">{payment.currency || 'EUR'}</TableCell>
                          <TableCell>{formatDate(payment.created_at)}</TableCell>
                          <TableCell>{payment.paid_at ? formatDate(payment.paid_at) : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;