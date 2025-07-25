import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CRMLayout } from "@/components/CRMLayout";
import { RoleGuard } from "@/components/RoleGuard";
import { useCRMData } from "@/hooks/use-crm-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  FileText, 
  Search, 
  Eye,
  AlertTriangle,
  Loader2,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { LeadPreviewModal } from "@/components/LeadPreviewModal";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    leads,
    messages,
    stats,
    loading,
    error,
    updateLeadStatus,
    assignLead,
    addNote,
  } = useCRMData();

  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [previewLead, setPreviewLead] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [newNote, setNewNote] = useState("");

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

  if (loading) {
    return (
      <CRMLayout>
        <div className="container mx-auto p-6">
          <div className="text-center py-20">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Chargement des données du CRM...</p>
          </div>
        </div>
      </CRMLayout>
    );
  }

  if (error) {
    return (
      <CRMLayout>
        <div className="container mx-auto p-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </CRMLayout>
    );
  }

  return (
    <CRMLayout>
      <div className="container mx-auto p-6">
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

          <RoleGuard requiredPermission="can_see_all_leads">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMessages}</div>
              </CardContent>
            </Card>
          </RoleGuard>
        </div>

        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leads">Dossiers Leads ({stats.totalLeads})</TabsTrigger>
            <RoleGuard requiredPermission="can_see_all_leads">
              <TabsTrigger value="messages">Messages ({stats.totalMessages})</TabsTrigger>
            </RoleGuard>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestion des Leads</CardTitle>
                  <div className="flex items-center space-x-2">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-64"
                      />
                    </div>

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
                    <RoleGuard requiredPermission="can_see_all_leads">
                      <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Assigné à" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="unassigned">Non assigné</SelectItem>
                          <SelectItem value="oussama@raccordement.net">Oussama</SelectItem>
                          <SelectItem value="farah@raccordement.net">Farah</SelectItem>
                          <SelectItem value="rania@raccordement.net">Rania</SelectItem>
                        </SelectContent>
                      </Select>
                    </RoleGuard>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredLeads.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== "all" || assignedFilter !== "all" 
                        ? "Aucun lead ne correspond aux filtres sélectionnés."
                        : "Aucun lead disponible pour le moment."
                      }
                    </p>
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
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3" />
                                {lead.email}
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3" />
                                <a href={`tel:${lead.telephone}`} className="hover:underline">
                                  {lead.telephone}
                                </a>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm font-medium">{lead.type_projet}</div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {lead.ville}
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

          <RoleGuard requiredPermission="can_see_all_leads">
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
                            <TableCell>
                              <div className="text-sm">{formatDate(message.created_at)}</div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </RoleGuard>
        </Tabs>
      </div>

      <LeadPreviewModal 
        lead={previewLead}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </CRMLayout>
  );
};

export default AdminDashboard;