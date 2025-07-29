import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart3, Users, MessageSquare, FileText, LogOut, Search, AlertCircle, Bell, Eye, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { useLeadNotifications } from "@/hooks/use-lead-notifications";
import { useCRMData } from "@/hooks/use-crm-data";
import { PhoneHeader } from "@/components/PhoneHeader";
import { LeadPreviewModal } from "@/components/LeadPreviewModal";
import { AdminUserManagement } from "@/components/AdminUserManagement";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { useDataExport } from "@/hooks/use-data-export";
import { supabase } from "@/integrations/supabase/client";
import CRMDashboard from "@/components/enhanced/CRMDashboard";

const Admin = () => {
  const navigate = useNavigate();
  const { user, adminUser, loading: authLoading } = useAdmin();
  const { newLeadsCount, clearNotifications } = useLeadNotifications();
  const { 
    leads, 
    messages,
    stats, 
    loading: crmLoading, 
    error: crmError,
    updateLeadStatus,
    assignLead,
    addNote,
    refetch
  } = useCRMData();
  const { exportLeads, exportMessages, exporting } = useDataExport();
  
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [previewLead, setPreviewLead] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [newNote, setNewNote] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState<any>({});

  const isPendingValidation = user && !adminUser;
  const canSeeAllLeads = adminUser?.can_see_all_leads || adminUser?.role === 'superadmin' || adminUser?.role === 'manager';
  const isTraiteur = adminUser?.role === 'traiteur';

  useEffect(() => {
    if (!authLoading && !user) {
      console.log('❌ No user found, redirecting to login');
      navigate('/login');
    } else if (!authLoading && user && !adminUser) {
      console.log('⏳ User found but admin data pending...');
    }
  }, [authLoading, user, adminUser, navigate]);

  const handleSendEmail = async (lead: any) => {
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
      await addNote(lead.id, emailNote);

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

  // Enhanced filtering function with advanced filters
  const filteredLeads = leads.filter(lead => {
    // Basic search
    const matchesSearch = !advancedFilters.searchTerm || 
      lead.nom?.toLowerCase().includes(advancedFilters.searchTerm.toLowerCase()) ||
      lead.prenom?.toLowerCase().includes(advancedFilters.searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(advancedFilters.searchTerm.toLowerCase()) ||
      lead.ville?.toLowerCase().includes(advancedFilters.searchTerm.toLowerCase()) ||
      lead.telephone?.includes(advancedFilters.searchTerm);
    
    // Status filter
    const matchesStatus = !advancedFilters.status || advancedFilters.status === 'all' || lead.etat_projet === advancedFilters.status;
    
    // Assignment filter
    const matchesAssigned = !advancedFilters.assignedTo || advancedFilters.assignedTo === 'all' || 
      (advancedFilters.assignedTo === 'unassigned' && !lead.assigned_to_email) ||
      (advancedFilters.assignedTo !== 'unassigned' && lead.assigned_to_email === advancedFilters.assignedTo);
    
    // Client type filter
    const matchesClientType = !advancedFilters.clientType || advancedFilters.clientType === 'all' || lead.type_client === advancedFilters.clientType;
    
    // Connection type filter
    const matchesConnectionType = !advancedFilters.connectionType || advancedFilters.connectionType === 'all' || lead.type_raccordement === advancedFilters.connectionType;
    
    // Project type filter
    const matchesProjectType = !advancedFilters.projectType || advancedFilters.projectType === 'all' || lead.type_projet === advancedFilters.projectType;
    
    // Payment status filter
    const matchesPaymentStatus = !advancedFilters.paymentStatus || advancedFilters.paymentStatus === 'all' || lead.payment_status === advancedFilters.paymentStatus;
    
    // City filter
    const matchesCity = !advancedFilters.city || lead.ville?.toLowerCase().includes(advancedFilters.city.toLowerCase());
    
    // Postal code filter
    const matchesPostalCode = !advancedFilters.postalCode || lead.code_postal?.includes(advancedFilters.postalCode);
    
    // Date range filter
    const matchesDateRange = !advancedFilters.dateRange || !advancedFilters.dateRange.from || 
      (new Date(lead.created_at) >= advancedFilters.dateRange.from && 
       (!advancedFilters.dateRange.to || new Date(lead.created_at) <= advancedFilters.dateRange.to));
    
    return matchesSearch && matchesStatus && matchesAssigned && matchesClientType && 
           matchesConnectionType && matchesProjectType && matchesPaymentStatus && 
           matchesCity && matchesPostalCode && matchesDateRange;
  });

  const handleExport = async () => {
    await exportLeads({
      format: 'csv',
      filters: {
        status: advancedFilters.status,
        assignedTo: advancedFilters.assignedTo,
        clientType: advancedFilters.clientType
      },
      dateRange: advancedFilters.dateRange
    });
  };

  // Show loading state
  if (authLoading || crmLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement des données...</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Utilisateur: {user?.email || 'Non connecté'} | Rôle: {adminUser?.role || 'En attente'}
            </p>
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

  // Show CRM error if there's an error
  if (crmError) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg font-semibold text-foreground">Erreur de chargement</p>
            <p className="mt-2 text-muted-foreground">{crmError}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Rafraîchir la page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-responsive phone header */}
      <PhoneHeader />
      
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
          <div className="flex items-center gap-4">
            {newLeadsCount > 0 && (
              <Badge variant="default" className="bg-red-500">
                <Bell className="w-3 h-3 mr-1" />
                {newLeadsCount} nouveau{newLeadsCount > 1 ? 'x' : ''}
              </Badge>
            )}
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
                <CardTitle className="text-sm font-medium">Messages de contact</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMessages}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="leads" className="space-y-6">
            <TabsList className={`grid w-full ${adminUser?.can_manage_users ? 'grid-cols-4' : 'grid-cols-3'} mb-6`}>
              <TabsTrigger value="leads" className="text-sm sm:text-base">Leads ({stats.totalLeads})</TabsTrigger>
              <TabsTrigger value="messages" className="text-sm sm:text-base">Messages ({stats.totalMessages})</TabsTrigger>
              <TabsTrigger value="summary" className="text-sm sm:text-base">Résumé par Type</TabsTrigger>
              {adminUser?.can_manage_users && (
                <TabsTrigger value="users" className="text-sm sm:text-base">Utilisateurs</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="leads" className="space-y-6">
              {/* Advanced Search */}
              <AdvancedSearch
                onFiltersChange={setAdvancedFilters}
                onExport={handleExport}
                onRefresh={refetch}
                canExport={adminUser?.role === 'superadmin' || adminUser?.role === 'manager'}
                loading={crmLoading || exporting}
                totalResults={filteredLeads.length}
              />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Dossiers de raccordement ({filteredLeads.length})
                  </CardTitle>
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
                                   variant="ghost" 
                                   size="sm"
                                   onClick={() => {
                                     setPreviewLead(lead);
                                     setShowPreview(true);
                                   }}
                                 >
                                   <Eye className="w-4 h-4 mr-1" />
                                   Aperçu
                                 </Button>
                                 <Button 
                                   variant="outline" 
                                   size="sm"
                                   onClick={() => navigate(`/admin/leads/${lead.id}`)}
                                 >
                                   Détails
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
                                                onValueChange={(value) => updateLeadStatus(selectedLead.id, value)}
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
                                                 onValueChange={(value) => assignLead(selectedLead.id, value)}
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
                                                       addNote(selectedLead.id, newNote);
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
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Messages de contact ({messages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isPendingValidation ? (
                    <div className="text-center py-8">
                      <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Votre accès est en attente de validation par un administrateur.
                      </p>
                    </div>
                  ) : messages.length === 0 ? (
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
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {messages.map((message) => (
                          <TableRow key={message.id}>
                            <TableCell>
                              <div className="font-medium">{message.name}</div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="text-sm">{message.email}</div>
                                <div className="text-sm text-muted-foreground">{message.phone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={message.request_type === 'contact' ? 'default' : 'secondary'}>
                                {message.request_type === 'contact' ? 'Contact' : 'Rappel'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <p className="text-sm text-muted-foreground truncate">
                                  {message.message}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{formatDate(message.created_at)}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(`mailto:${message.email}`, '_blank')}
                                >
                                  <Mail className="w-4 h-4 mr-1" />
                                  Email
                                </Button>
                                {message.phone && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.open(`tel:${message.phone}`, '_blank')}
                                  >
                                    <Phone className="w-4 h-4 mr-1" />
                                    Appel
                                  </Button>
                                )}
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

            <TabsContent value="summary" className="space-y-6">
              {/* Lead Statistics by Form Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Formulaires complets</CardTitle>
                    <FileText className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.totalFullSubmissions}</div>
                    <p className="text-xs text-muted-foreground">Devis payés et validés</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Soumissions partielles</CardTitle>
                    <Users className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.totalPartialSubmissions}</div>
                    <p className="text-xs text-muted-foreground">Étape 1 du formulaire</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Demandes de rappel</CardTitle>
                    <Phone className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{stats.totalCallbackRequests}</div>
                    <p className="text-xs text-muted-foreground">Rappels demandés</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Contacts rapides</CardTitle>
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.totalQuickContacts}</div>
                    <p className="text-xs text-muted-foreground">Formulaire de contact</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Contact Leads */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Contacts Rapides ({leads.filter(l => l.form_type === 'quick').length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {leads.filter(l => l.form_type === 'quick').length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Aucun contact rapide pour le moment.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leads.filter(l => l.form_type === 'quick').map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.prenom} {lead.nom}</TableCell>
                            <TableCell>
                              <div>
                                <div className="text-sm">{lead.email}</div>
                                <div className="text-sm text-muted-foreground">{lead.telephone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs truncate">{lead.commentaires}</div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(lead.etat_projet)}
                            </TableCell>
                            <TableCell>{formatDate(lead.created_at)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/admin/leads/${lead.id}`)}
                              >
                                Détails
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Partial Submissions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-600" />
                    Soumissions Partielles - À relancer ({leads.filter(l => l.form_type === 'step1').length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {leads.filter(l => l.form_type === 'step1').length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Aucune soumission partielle.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Type Client</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leads.filter(l => l.form_type === 'step1').map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.prenom} {lead.nom}</TableCell>
                            <TableCell>
                              <div>
                                <div className="text-sm">{lead.email}</div>
                                <div className="text-sm text-muted-foreground">{lead.telephone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{lead.type_client}</Badge>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(lead.etat_projet)}
                            </TableCell>
                            <TableCell>{formatDate(lead.created_at)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/admin/leads/${lead.id}`)}
                              >
                                Relancer
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Management Tab - Only for superadmins and managers */}
            {adminUser?.can_manage_users && (
              <TabsContent value="users" className="space-y-6">
                <AdminUserManagement />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      <LeadPreviewModal 
        lead={previewLead}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
};

export default Admin;