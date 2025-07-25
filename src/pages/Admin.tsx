import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart3, Users, MessageSquare, FileText, LogOut, Search, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

// Interfaces
interface Lead {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  type_client: string;
  type_projet: string;
  adresse_chantier: string;
  ville: string;
  code_postal: string;
  type_raccordement: string;
  type_alimentation: string;
  puissance: string;
  etat_projet: string;
  delai_souhaite: string;
  commentaires: string;
  assigned_to_email: string;
  created_at: string;
  updated_at: string;
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

const Admin = () => {
  const navigate = useNavigate();
  const { user, adminUser, loading: authLoading } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [newNote, setNewNote] = useState("");
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalMessages: 0,
    weeklyLeads: 0,
    monthlyLeads: 0,
  });

  const isPendingValidation = user && !adminUser;
  const canSeeAllLeads = adminUser?.can_see_all_leads || adminUser?.role === 'superadmin' || adminUser?.role === 'manager';
  const isTraiteur = adminUser?.role === 'traiteur';

  useEffect(() => {
    if (!authLoading && user && adminUser) {
      console.log('🚀 User authenticated, starting data fetch...', { user: user.email, adminUser: adminUser?.role });
      fetchData();
      
      // Disable realtime temporarily for debugging
      // setupRealtimeSubscriptions();
    } else if (!authLoading && !user) {
      console.log('❌ No user found, redirecting to login');
      navigate('/login');
    } else if (!authLoading && user && !adminUser) {
      console.log('⏳ User found but admin data pending...');
      setLoading(false); // Stop loading if admin validation is pending
    }

    // Add timeout safety net
    const timeout = setTimeout(() => {
      if (loading) {
        console.error('⏰ Data fetch timeout after 10 seconds');
        setLoading(false);
        toast.error('Chargement des données échoué - veuillez rafraîchir la page');
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [authLoading, user, adminUser]);

  const setupRealtimeSubscriptions = () => {
    const leadsChannel = supabase
      .channel('leads-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'leads_raccordement'
      }, () => {
        fetchData();
      })
      .subscribe();

    const messagesChannel = supabase
      .channel('messages-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages'
      }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(messagesChannel);
    };
  };

  const fetchData = async () => {
    try {
      console.log('🔄 Starting data fetch...', { 
        user: user?.email, 
        role: adminUser?.role,
        timestamp: new Date().toISOString()
      });
      setLoading(true);

      // Test connection first with simple query
      console.log('🧪 Testing Supabase connection...');
      const connectionTest = await supabase.from('leads_raccordement').select('count').limit(1);
      console.log('🔗 Connection test result:', connectionTest);

      if (connectionTest.error) {
        console.error('❌ Connection test failed:', connectionTest.error);
        throw new Error(`Connection failed: ${connectionTest.error.message}`);
      }

      // Fetch leads based on role
      let leadsQuery = supabase.from('leads_raccordement').select(`
        id, nom, prenom, email, telephone, type_client, type_projet, 
        adresse_chantier, ville, code_postal, type_raccordement, 
        type_alimentation, puissance, etat_projet, delai_souhaite, 
        commentaires, assigned_to_email, created_at, updated_at
      `);
      
      if (isTraiteur && user?.email) {
        console.log('👤 Fetching leads for traiteur:', user.email);
        leadsQuery = leadsQuery.eq('assigned_to_email', user.email);
      } else {
        console.log('👑 Fetching all leads for admin/manager');
      }
      
      console.log('📡 Executing queries...');
      const startTime = Date.now();
      
      // Execute queries sequentially to isolate timeout issues
      console.log('🔍 Fetching leads...');
      const leadsRes = await leadsQuery.order('created_at', { ascending: false }).limit(100);
      console.log('✅ Leads query completed:', { count: leadsRes.data?.length, error: leadsRes.error });
      
      console.log('🔍 Fetching messages...');
      const messagesRes = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(50);
      console.log('✅ Messages query completed:', { count: messagesRes.data?.length, error: messagesRes.error });

      const fetchTime = Date.now() - startTime;
      console.log(`⚡ Queries completed in ${fetchTime}ms`);

      console.log('📊 Data fetch results:', {
        leadsCount: leadsRes.data?.length || 0,
        messagesCount: messagesRes.data?.length || 0,
        leadsError: leadsRes.error,
        messagesError: messagesRes.error,
        leadsData: leadsRes.data?.slice(0, 2), // Show first 2 leads for debugging
        messagesData: messagesRes.data?.slice(0, 2) // Show first 2 messages for debugging
      });

      if (leadsRes.error) {
        console.error('❌ Leads fetch error:', leadsRes.error);
        throw new Error(`Leads error: ${leadsRes.error.message}`);
      }
      if (messagesRes.error) {
        console.error('❌ Messages fetch error:', messagesRes.error);
        throw new Error(`Messages error: ${messagesRes.error.message}`);
      }

      const leadsData = leadsRes.data || [];
      const messagesData = messagesRes.data || [];

      console.log('💾 Setting data in state...');
      setLeads(leadsData);
      setMessages(messagesData);

      // Calculate stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const weeklyLeads = leadsData.filter(
        l => new Date(l.created_at) >= weekAgo
      ).length;

      const monthlyLeads = leadsData.filter(
        l => new Date(l.created_at) >= monthAgo
      ).length;

      const newStats = {
        totalLeads: leadsData.length,
        totalMessages: messagesData.length,
        weeklyLeads,
        monthlyLeads,
      };

      console.log('📈 Updated stats:', newStats);
      setStats(newStats);

      console.log('✅ Data fetch completed successfully');

    } catch (error: any) {
      console.error('💥 Critical error fetching data:', error);
      console.error('📍 Error stack:', error.stack);
      toast.error(`Erreur lors du chargement des données: ${error.message}`);
      
      // Set fallback data for debugging
      console.log('🔄 Setting fallback empty data...');
      setLeads([]);
      setMessages([]);
      setStats({
        totalLeads: 0,
        totalMessages: 0,
        weeklyLeads: 0,
        monthlyLeads: 0,
      });
    } finally {
      console.log('🏁 Finalizing data fetch...');
      setLoading(false);
    }
  };

  const handleAssignLead = async (leadId: string, email: string) => {
    try {
      // Convert "unassigned" to null
      const assignedEmail = email === "unassigned" ? null : email;
      
      const { error } = await supabase
        .from('leads_raccordement')
        .update({ 
          assigned_to_email: assignedEmail,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.map(l => 
        l.id === leadId ? { ...l, assigned_to_email: assignedEmail } : l
      ));

      // Update selected lead if it's the same one
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, assigned_to_email: assignedEmail } : null);
      }

      toast.success('Lead assigné avec succès');
    } catch (error: any) {
      console.error('Error assigning lead:', error);
      toast.error('Erreur lors de l\'assignation');
    }
  };

  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads_raccordement')
        .update({ 
          etat_projet: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.map(l => 
        l.id === leadId ? { ...l, etat_projet: newStatus } : l
      ));

      // Update selected lead if it's the same one
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, etat_projet: newStatus } : null);
      }

      toast.success('Statut mis à jour avec succès');
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleAddNote = async (leadId: string, note: string) => {
    try {
      const currentComments = selectedLead?.commentaires || '';
      const timestamp = new Date().toLocaleString('fr-FR');
      const newComment = `${timestamp} - ${user?.email}: ${note}`;
      const updatedComments = currentComments 
        ? `${currentComments}\n\n${newComment}` 
        : newComment;

      const { error } = await supabase
        .from('leads_raccordement')
        .update({ 
          commentaires: updatedComments,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.map(l => 
        l.id === leadId ? { ...l, commentaires: updatedComments } : l
      ));

      // Update selected lead
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, commentaires: updatedComments } : null);
      }

      toast.success('Note ajoutée avec succès');
    } catch (error: any) {
      console.error('Error adding note:', error);
      toast.error('Erreur lors de l\'ajout de la note');
    }
  };

  const handleSendEmail = async (lead: Lead) => {
    try {
      const subject = `Votre demande de raccordement électrique - ${lead.type_raccordement}`;
      const message = `Bonjour ${lead.prenom},

Nous avons bien reçu votre demande de raccordement électrique pour votre projet de ${lead.type_projet} à ${lead.ville}.

Voici un récapitulatif de votre demande :
- Type de raccordement : ${lead.type_raccordement}
- Puissance souhaitée : ${lead.puissance}
- Adresse du projet : ${lead.adresse_chantier}

Notre équipe technique va analyser votre dossier et vous recontacter dans les plus brefs délais pour vous proposer un devis personnalisé.

N'hésitez pas à nous contacter si vous avez des questions.

Cordialement,
L'équipe Raccordement Connect`;

      const { error } = await supabase.functions.invoke('send-lead-email', {
        body: {
          to: lead.email,
          subject: subject,
          message: message,
          leadId: lead.id,
          leadName: `${lead.prenom} ${lead.nom}`
        }
      });

      if (error) throw error;

      // Add note about email sent
      const emailNote = `Email envoyé: ${subject}`;
      await handleAddNote(lead.id, emailNote);

      toast.success('Email envoyé avec succès');
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error('Erreur lors de l\'envoi de l\'email');
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

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'nouveau': 'bg-blue-100 text-blue-800',
      'en_cours': 'bg-yellow-100 text-yellow-800',
      'attente_enedis': 'bg-orange-100 text-orange-800',
      'termine': 'bg-green-100 text-green-800',
    };

    const colorClass = colors[status] || 'bg-gray-100 text-gray-800';

    return (
      <Badge className={colorClass}>
        {status?.replace('_', ' ') || 'Non défini'}
      </Badge>
    );
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === "" || 
      lead.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.ville?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.etat_projet === statusFilter;
    const matchesAssigned = assignedFilter === "all" || 
      (assignedFilter === "unassigned" && !lead.assigned_to_email) ||
      (assignedFilter !== "unassigned" && lead.assigned_to_email === assignedFilter);
    
    return matchesSearch && matchesStatus && matchesAssigned;
  });

  // Show loading state with timeout warning
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement des données...</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Utilisateur: {user?.email || 'Non connecté'} | Rôle: {adminUser?.role || 'En attente'}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Si le chargement prend plus de 15 secondes, rafraîchissez la page
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4"
            >
              Rafraîchir maintenant
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg font-semibold text-foreground">Erreur d'authentification</p>
            <p className="mt-2 text-muted-foreground">Veuillez vous reconnecter</p>
            <Button onClick={() => navigate('/login')} className="mt-4">
              Se reconnecter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div>
              <p className="font-medium">
                Connecté en tant que : {adminUser?.role || 'En attente'} — {user.email}
              </p>
              {isPendingValidation && (
                <p className="text-sm opacity-90 flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Votre accès est en attente de validation par un administrateur.
                </p>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalLeads}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cette semaine</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.weeklyLeads}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ce mois</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.monthlyLeads}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMessages}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="leads" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="leads">Dossiers Leads ({stats.totalLeads})</TabsTrigger>
              <TabsTrigger value="messages">Messages ({stats.totalMessages})</TabsTrigger>
            </TabsList>

            <TabsContent value="leads" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Gestion des Leads</CardTitle>
                    <div className="flex items-center space-x-2">
                      {/* Status Filter */}
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="nouveau">Nouveau</SelectItem>
                          <SelectItem value="en_cours">En cours</SelectItem>
                          <SelectItem value="attente_enedis">Attente Enedis</SelectItem>
                          <SelectItem value="termine">Terminé</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Assignment Filter */}
                      <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Assigné à" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="unassigned">Non assigné</SelectItem>
                          <SelectItem value="hossam@raccordement.net">Hossam</SelectItem>
                          <SelectItem value="oussama@raccordement.net">Oussama</SelectItem>
                          <SelectItem value="farah@raccordement.net">Farah</SelectItem>
                          <SelectItem value="rania@raccordement.net">Rania</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Rechercher par nom, email, ville..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-80"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isPendingValidation ? (
                    <div className="text-center py-8">
                      <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Votre accès est en attente de validation par un administrateur.
                      </p>
                    </div>
                  ) : filteredLeads.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Aucun dossier pour le moment.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Projet</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Assigné à</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLeads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{lead.prenom} {lead.nom}</div>
                                <div className="text-sm text-muted-foreground">{lead.type_client}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="text-sm">{lead.email}</div>
                                <div className="text-sm text-muted-foreground">{lead.telephone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="text-sm">{lead.type_projet}</div>
                                <div className="text-sm text-muted-foreground">
                                  {lead.ville} ({lead.code_postal})
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(lead.etat_projet)}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {lead.assigned_to_email || 'Non assigné'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{formatDate(lead.created_at)}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/kenitra/leads/${lead.id}`)}
                                >
                                  Voir détails
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => setSelectedLead(lead)}
                                    >
                                      Actions
                                    </Button>
                                  </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Détails du lead - {selectedLead?.prenom} {selectedLead?.nom}
                                    </DialogTitle>
                                  </DialogHeader>
                                  {selectedLead && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <strong>Type client:</strong> {selectedLead.type_client}
                                        </div>
                                        <div>
                                          <strong>Email:</strong> {selectedLead.email}
                                        </div>
                                        <div>
                                          <strong>Téléphone:</strong> {selectedLead.telephone}
                                        </div>
                                        <div>
                                          <strong>Type projet:</strong> {selectedLead.type_projet}
                                        </div>
                                        <div>
                                          <strong>Adresse:</strong> {selectedLead.adresse_chantier}
                                        </div>
                                        <div>
                                          <strong>Ville:</strong> {selectedLead.ville}
                                        </div>
                                        <div>
                                          <strong>Code postal:</strong> {selectedLead.code_postal}
                                        </div>
                                        <div>
                                          <strong>Type raccordement:</strong> {selectedLead.type_raccordement}
                                        </div>
                                        <div>
                                          <strong>Type alimentation:</strong> {selectedLead.type_alimentation}
                                        </div>
                                        <div>
                                          <strong>Puissance:</strong> {selectedLead.puissance}
                                        </div>
                                        <div>
                                          <strong>État projet:</strong> {selectedLead.etat_projet}
                                        </div>
                                        <div>
                                          <strong>Délai souhaité:</strong> {selectedLead.delai_souhaite}
                                        </div>
                                      </div>
                                      {selectedLead.commentaires && (
                                        <div>
                                          <strong>Commentaires:</strong>
                                          <p className="mt-1 text-sm">{selectedLead.commentaires}</p>
                                        </div>
                                      )}
                                      <div>
                                        <strong>Créé le:</strong> {formatDate(selectedLead.created_at)}
                                      </div>
                                      <div>
                                        <strong>Modifié le:</strong> {formatDate(selectedLead.updated_at)}
                                      </div>
                                      
                                      {/* Quick Actions Section */}
                                      {(canSeeAllLeads) && (
                                        <div className="pt-4 border-t space-y-4">
                                          <div className="grid grid-cols-2 gap-4">
                                            {/* Status Update */}
                                            <div>
                                              <strong>Mettre à jour le statut:</strong>
                                              <Select
                                                value={selectedLead.etat_projet || ""}
                                                onValueChange={(value) => handleStatusUpdate(selectedLead.id, value)}
                                              >
                                                <SelectTrigger className="mt-2">
                                                  <SelectValue placeholder="Changer le statut" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="nouveau">Nouveau</SelectItem>
                                                  <SelectItem value="en_cours">En cours</SelectItem>
                                                  <SelectItem value="attente_enedis">Attente Enedis</SelectItem>
                                                  <SelectItem value="termine">Terminé</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>

                                            {/* Assignment */}
                                            <div>
                                              <strong>Assigner à:</strong>
                                               <Select
                                                 value={selectedLead.assigned_to_email || "unassigned"}
                                                 onValueChange={(value) => handleAssignLead(selectedLead.id, value)}
                                              >
                                                <SelectTrigger className="mt-2">
                                                  <SelectValue placeholder="Sélectionner un traiteur" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="unassigned">Non assigné</SelectItem>
                                                  <SelectItem value="hossam@raccordement.net">Hossam</SelectItem>
                                                  <SelectItem value="oussama@raccordement.net">Oussama</SelectItem>
                                                  <SelectItem value="farah@raccordement.net">Farah</SelectItem>
                                                  <SelectItem value="rania@raccordement.net">Rania</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          </div>

                                           {/* Add Note Section */}
                                           <div>
                                             <strong>Ajouter une note:</strong>
                                             <div className="mt-2 space-y-2">
                                               <Input
                                                 value={newNote}
                                                 onChange={(e) => setNewNote(e.target.value)}
                                                 placeholder="Tapez votre note ici..."
                                                 className="w-full"
                                               />
                                               <div className="flex gap-2">
                                                 <Button
                                                   onClick={() => {
                                                     if (newNote.trim()) {
                                                       handleAddNote(selectedLead.id, newNote);
                                                       setNewNote("");
                                                     }
                                                   }}
                                                   size="sm"
                                                   disabled={!newNote.trim()}
                                                 >
                                                   Ajouter la note
                                                 </Button>
                                                 <Button
                                                   onClick={() => handleSendEmail(selectedLead)}
                                                   size="sm"
                                                   variant="outline"
                                                 >
                                                   📧 Envoyer email
                                                 </Button>
                                               </div>
                                             </div>
                                           </div>

                                          {/* Communication History */}
                                          {selectedLead.commentaires && (
                                            <div>
                                              <strong>Historique des communications:</strong>
                                              <div className="mt-2 p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                                                <pre className="text-sm whitespace-pre-wrap">{selectedLead.commentaires}</pre>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                 </DialogContent>
                               </Dialog>
                              </div>
                             </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Messages de Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Aucun message pour le moment.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {messages.map((message) => (
                          <TableRow key={message.id}>
                            <TableCell className="font-medium">{message.name}</TableCell>
                            <TableCell>
                              <div>
                                <div className="text-sm">{message.email}</div>
                                <div className="text-sm text-muted-foreground">{message.phone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{message.request_type}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs truncate">{message.message}</div>
                            </TableCell>
                            <TableCell>{formatDate(message.created_at)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;