import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CRMLayout } from '@/components/CRMLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MoreVertical, Edit, User, Mail, Phone, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Checkbox } from "@/components/ui/checkbox"
import { useAdmin } from '@/contexts/AdminContext';
import { NotesTab } from '@/components/lead/NotesTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmailsTab } from '@/components/lead/EmailsTab';
import { FilesTab } from '@/components/lead/FilesTab';
import { InternalMessagesTab } from '@/components/lead/InternalMessagesTab';
import { TimelineTab } from '@/components/lead/TimelineTab';
import { getRoleBasedConfig } from '@/utils/role-access';
import { UserRole } from '@/utils/permissions';

// Define Lead type locally since @/types doesn't exist
interface Lead {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  type_client: string;
  type_projet: string;
  adresse_chantier?: string;
  ville?: string;
  code_postal?: string;
  type_raccordement?: string;
  type_alimentation?: string;
  puissance?: string;
  etat_projet?: string;
  delai_souhaite?: string;
  commentaires?: string;
  status?: string;
  assigned_to_email?: string;
  created_at: string;
  updated_at?: string;
  raison_sociale?: string;
  siren?: string;
  payment_status?: string;
  amount?: number;
}

const AdminLeadDetail = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { adminUser } = useAdmin();

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"details" | "notes" | "messages" | "emails" | "files" | "timeline">("details");

  // Add role-based config
  const roleConfig = adminUser ? getRoleBasedConfig(adminUser.role as UserRole) : null;

  const fetchLead = async () => {
    if (!leadId) {
      setError('Lead ID manquant');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads_raccordement')
        .select('*')
        .eq('id', leadId)
        .single();

      if (error) {
        console.error('Error fetching lead:', error);
        setError(`Erreur lors du chargement du lead: ${error.message}`);
      } else if (data) {
        setLead(data);
      } else {
        setError('Lead non trouvé');
      }
    } catch (err) {
      console.error('Unexpected error fetching lead:', err);
      setError('Erreur inattendue lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  if (loading) {
    return (
      <CRMLayout>
        <div className="max-w-7xl mx-auto p-6">
          <p>Chargement du lead...</p>
        </div>
      </CRMLayout>
    );
  }

  if (error) {
    return (
      <CRMLayout>
        <div className="max-w-7xl mx-auto p-6">
          <p className="text-red-500">Erreur: {error}</p>
        </div>
      </CRMLayout>
    );
  }

  if (!lead) {
    return (
      <CRMLayout>
        <div className="max-w-7xl mx-auto p-6">
          <p>Lead non trouvé.</p>
        </div>
      </CRMLayout>
    );
  }

  return (
    <CRMLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Détails du Lead
            </h1>
            <p className="text-muted-foreground">
              Informations complètes sur le lead {lead.id}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/crm')}>
              Retour à la liste
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Ouvrir le menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {roleConfig?.canModifySettings && (
                  <>
                    <DropdownMenuItem onClick={() => navigate(`/crm/lead/${leadId}/edit`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Voir le profil
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lead Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Informations du Lead</CardTitle>
                <CardDescription>Détails personnels et informations de contact.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {/* Basic Info - Always visible */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nom</Label>
                    <Input type="text" value={lead.nom} readOnly />
                  </div>
                  <div>
                    <Label>Prénom</Label>
                    <Input type="text" value={lead.prenom} readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={lead.email} readOnly />
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <Input type="tel" value={lead.telephone} readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Type de Client</Label>
                    <Input type="text" value={lead.type_client} readOnly />
                  </div>
                  <div>
                    <Label>Type de Projet</Label>
                    <Input type="text" value={lead.type_projet} readOnly />
                  </div>
                </div>

                {/* Sensitive company info - Only for superadmin/manager */}
                {(adminUser?.role === 'superadmin' || adminUser?.role === 'manager') && (
                  <>
                    {lead.raison_sociale && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Raison Sociale</Label>
                          <Input type="text" value={lead.raison_sociale} readOnly />
                        </div>
                        {lead.siren && (
                          <div>
                            <Label>SIREN</Label>
                            <Input type="text" value={lead.siren} readOnly />
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Adresse</Label>
                    <Input type="text" value={lead.adresse_chantier || 'N/A'} readOnly />
                  </div>
                  <div>
                    <Label>Ville</Label>
                    <Input type="text" value={lead.ville || 'N/A'} readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Code Postal</Label>
                    <Input type="text" value={lead.code_postal || 'N/A'} readOnly />
                  </div>
                  <div>
                    <Label>Type de Raccordement</Label>
                    <Input type="text" value={lead.type_raccordement || 'N/A'} readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="emails">Emails</TabsTrigger>
                <TabsTrigger value="files">Fichiers</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Détails du Projet</CardTitle>
                    <CardDescription>Informations spécifiques sur le projet de raccordement.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Type d'Alimentation</Label>
                        <Input type="text" value={lead.type_alimentation || 'N/A'} readOnly />
                      </div>
                      <div>
                        <Label>Puissance</Label>
                        <Input type="text" value={lead.puissance || 'N/A'} readOnly />
                      </div>
                    </div>
                    <div>
                      <Label>État du Projet</Label>
                      <Input type="text" value={lead.etat_projet || 'N/A'} readOnly />
                    </div>
                    <div>
                      <Label>Délai Souhaité</Label>
                      <Input type="text" value={lead.delai_souhaite || 'N/A'} readOnly />
                    </div>

                    {/* Payment info - Only visible to roles with payment permissions */}
                    {roleConfig?.showPayments && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h4 className="text-lg font-medium">Informations de Paiement</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Statut de Paiement</Label>
                              <Input type="text" value={lead.payment_status || 'En attente'} readOnly />
                            </div>
                            <div>
                              <Label>Montant</Label>
                              <Input type="text" value={lead.amount ? `${(lead.amount / 100).toFixed(2)}€` : 'N/A'} readOnly />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <Label>Commentaires</Label>
                      <Textarea value={lead.commentaires || 'Aucun commentaire'} readOnly className="min-h-[100px]" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes">
                <NotesTab leadId={leadId} />
              </TabsContent>

              <TabsContent value="messages">
                <InternalMessagesTab leadId={leadId} />
              </TabsContent>

              <TabsContent value="emails">
                <EmailsTab 
                  leadId={leadId}
                  leadEmail={lead?.email || ''}
                  leadName={`${lead?.prenom || ''} ${lead?.nom || ''}`.trim()}
                  leadData={{
                    prenom: lead?.prenom,
                    nom: lead?.nom,
                    ville: lead?.ville,
                    type_projet: lead?.type_projet
                  }}
                />
              </TabsContent>

              <TabsContent value="files">
                <FilesTab leadId={leadId} />
              </TabsContent>

              <TabsContent value="timeline">
                <TimelineTab leadId={leadId} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Statut du Lead</CardTitle>
                <CardDescription>Gérer l'état d'avancement du lead.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="status">État</Label>
                  <Input type="text" id="status" value={lead.status || 'Nouveau'} readOnly />
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="assignedTo">Assigné à</Label>
                  <Input type="text" id="assignedTo" value={lead.assigned_to_email || 'Non assigné'} readOnly />
                </div>
                <div className="space-y-2 mt-4">
                  <Label>Date de création</Label>
                  <Input type="text" value={format(new Date(lead.created_at), "dd MMMM yyyy 'à' HH:mm", { locale: fr })} readOnly />
                </div>
                <div className="space-y-2 mt-4">
                  <Label>Dernière mise à jour</Label>
                  <Input type="text" value={format(new Date(lead.updated_at || lead.created_at), "dd MMMM yyyy 'à' HH:mm", { locale: fr })} readOnly />
                </div>

                {/* Payment status - Only for users with payment permissions */}
                {roleConfig?.showPayments && lead.payment_status && (
                  <div className="space-y-2 mt-4">
                    <Label>Statut de Paiement</Label>
                    <Badge variant={lead.payment_status === 'paid' ? 'default' : 'secondary'} className="mt-1">
                      {lead.payment_status === 'paid' ? 'Payé' : 'En attente'}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
                <CardDescription>Informations de contact du lead.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${lead.email}`} className="text-sm text-primary hover:underline">
                    {lead.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${lead.telephone}`} className="text-sm text-primary hover:underline">
                    {lead.telephone}
                  </a>
                </div>
                {lead.adresse_chantier && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {lead.adresse_chantier}, {lead.ville}, {lead.code_postal}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
};

export default AdminLeadDetail;
