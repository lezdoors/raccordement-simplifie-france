
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart3, Users, MessageSquare, FileText, Search, AlertCircle, Bell, Eye, Phone, Calendar, TrendingUp, Filter, Download, UserPlus, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRoleBasedCRMData } from "@/hooks/use-role-based-crm-data";
import { useAdmin } from "@/contexts/AdminContext";
import { useDataExport } from "@/hooks/use-data-export";
import { CRMStatsCards } from './CRMStatsCards';
import { CRMLeadActions } from './CRMLeadActions';
import { getTableColumnsForRole } from '@/utils/role-access';
import { UserRole } from '@/utils/permissions';

interface CRMDashboardProps {
  leads: any[];
  stats: any;
  onStatusUpdate: (leadId: string, status: string) => void;
  onAssignLead: (leadId: string, email: string) => void;
  onAddNote: (leadId: string, note: string) => void;
}

const CRMDashboard = ({ leads, stats, onStatusUpdate, onAssignLead, onAddNote }: CRMDashboardProps) => {
  const navigate = useNavigate();
  const { adminUser } = useAdmin();
  const { exportLeads, exporting } = useDataExport();
  const { roleConfig } = useRoleBasedCRMData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formTypeFilter, setFormTypeFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Get role-appropriate table columns
  const tableColumns = adminUser ? getTableColumnsForRole(adminUser.role as UserRole) : [];

  // Enhanced filtering logic
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telephone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || lead.etat_projet === statusFilter;
    const matchesFormType = formTypeFilter === "all" || lead.form_type === formTypeFilter;
    const matchesAssigned = assignedFilter === "all" || 
      (assignedFilter === "assigned" && lead.assigned_to_email) ||
      (assignedFilter === "unassigned" && !lead.assigned_to_email);
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const leadDate = new Date(lead.created_at);
      const now = new Date();
      switch (dateFilter) {
        case "today":
          matchesDate = leadDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = leadDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = leadDate >= monthAgo;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesFormType && matchesAssigned && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      nouveau: { variant: "default", label: "Nouveau", color: "bg-blue-100 text-blue-800" },
      en_cours: { variant: "secondary", label: "En cours", color: "bg-yellow-100 text-yellow-800" },
      valide: { variant: "default", label: "Validé", color: "bg-green-100 text-green-800" },
      termine: { variant: "outline", label: "Terminé", color: "bg-gray-100 text-gray-800" },
      annule: { variant: "destructive", label: "Annulé", color: "bg-red-100 text-red-800" },
    } as const;

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.nouveau;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getFormTypeBadge = (formType: string) => {
    const typeConfig = {
      full: { label: "Complet", color: "bg-green-100 text-green-800" },
      step1: { label: "Partiel", color: "bg-orange-100 text-orange-800" },
      quick: { label: "Contact", color: "bg-blue-100 text-blue-800" },
      callback: { label: "Rappel", color: "bg-purple-100 text-purple-800" },
    } as const;

    const config = typeConfig[formType as keyof typeof typeConfig] || typeConfig.full;
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityIcon = (lead: any) => {
    if (lead.form_type === 'step1') return <AlertCircle className="w-4 h-4 text-orange-500" />;
    if (lead.form_type === 'callback') return <Phone className="w-4 h-4 text-purple-500" />;
    if (roleConfig?.showPayments && lead.payment_status === 'paid') return <TrendingUp className="w-4 h-4 text-green-500" />;
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Statistics Cards */}
      <CRMStatsCards leads={leads} loading={false} />

      {/* Enhanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres Avancés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Nom, email, téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="nouveau">Nouveau</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="valide">Validé</SelectItem>
                  <SelectItem value="termine">Terminé</SelectItem>
                  <SelectItem value="annule">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={formTypeFilter} onValueChange={setFormTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="full">Complet</SelectItem>
                  <SelectItem value="step1">Partiel</SelectItem>
                  <SelectItem value="quick">Contact</SelectItem>
                  <SelectItem value="callback">Rappel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assignation</label>
              <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="assigned">Assignés</SelectItem>
                  <SelectItem value="unassigned">Non assignés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Période</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les dates</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {roleConfig?.canExportData && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <Button
                  onClick={() => exportLeads({ format: 'csv' })}
                  disabled={exporting}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {exporting ? "Export..." : "Exporter"}
                </Button>
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredLeads.length} lead(s) trouvé(s) sur {leads.length} total
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Lead Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Gestion des Leads</span>
            <Badge variant="secondary">{filteredLeads.length} leads</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableColumns.map((column) => (
                    <TableHead key={column.key} className={column.key === 'actions' ? 'w-[100px]' : ''}>
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(lead)}
                        {getFormTypeBadge(lead.form_type)}
                      </div>
                    </TableCell>
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
                      <div className="space-y-1">
                        <div className="text-sm">{lead.type_raccordement || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">{lead.type_projet || 'N/A'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(lead.etat_projet)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {lead.assigned_to_email ? (
                          <Badge variant="outline" className="text-xs">
                            {lead.assigned_to_email}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">Non assigné</span>
                        )}
                      </div>
                    </TableCell>
                    {roleConfig?.showPayments && (
                      <>
                        <TableCell>
                          <Badge variant={lead.payment_status === 'paid' ? 'default' : 'secondary'}>
                            {lead.payment_status === 'paid' ? 'Payé' : 'En attente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span className="text-sm">{(lead.amount / 100).toFixed(2)}€</span>
                          </div>
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(lead.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/leads/${lead.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {roleConfig?.canAssignLeads && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <UserPlus className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Gestion du Lead</DialogTitle>
                              </DialogHeader>
                              <CRMLeadActions 
                                lead={lead}
                                onStatusUpdate={onStatusUpdate}
                                onAssignLead={onAssignLead}
                                onAddNote={onAddNote}
                              />
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun lead trouvé avec ces filtres.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMDashboard;
