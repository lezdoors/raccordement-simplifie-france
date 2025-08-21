import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Mail, Phone, MapPin, Building, Zap, Calendar, User, MessageSquare, Edit, Save, FileText } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { NotesTab } from "@/components/lead/NotesTab";

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

const AdminLeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, adminUser } = useAdmin();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  
  const canSeeAllLeads = adminUser?.can_see_all_leads || adminUser?.role === 'superadmin' || adminUser?.role === 'manager';
  const isTraiteur = adminUser?.role === 'traiteur';

  useEffect(() => {
    if (id && user) {
      fetchLead();
    }
  }, [id, user]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('leads_raccordement').select('*').eq('id', id);
      
      // If user is traiteur, only allow viewing leads assigned to them
      if (isTraiteur && user?.email) {
        query = query.eq('assigned_to_email', user.email);
      }
      
      const { data, error } = await query.maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        toast.error('Lead non trouvé ou accès non autorisé');
        navigate('/admin');
        return;
      }

      setLead(data);
    } catch (error: any) {
      console.error('Error fetching lead:', error);
      toast.error('Erreur lors du chargement du lead');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignLead = async (email: string) => {
    if (!lead) return;
    
    try {
      const assignedEmail = email === "unassigned" ? null : email;
      
      const { error } = await supabase
        .from('leads_raccordement')
        .update({ 
          assigned_to_email: assignedEmail,
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id);

      if (error) throw error;

      setLead(prev => prev ? { ...prev, assigned_to_email: assignedEmail } : null);
      toast.success('Lead assigné avec succès');
    } catch (error: any) {
      console.error('Error assigning lead:', error);
      toast.error('Erreur lors de l\'assignation');
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!lead) return;
    
    try {
      const { error } = await supabase
        .from('leads_raccordement')
        .update({ 
          etat_projet: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id);

      if (error) throw error;

      setLead(prev => prev ? { ...prev, etat_projet: newStatus } : null);
      toast.success('Statut mis à jour avec succès');
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleAddNote = async () => {
    if (!lead || !newNote.trim()) return;
    
    try {
      const currentComments = lead.commentaires || '';
      const timestamp = new Date().toLocaleString('fr-FR');
      const newComment = `${timestamp} - ${user?.email}: ${newNote}`;
      const updatedComments = currentComments 
        ? `${currentComments}\n\n${newComment}` 
        : newComment;

      const { error } = await supabase
        .from('leads_raccordement')
        .update({ 
          commentaires: updatedComments,
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id);

      if (error) throw error;

      setLead(prev => prev ? { ...prev, commentaires: updatedComments } : null);
      setNewNote("");
      toast.success('Note ajoutée avec succès');
    } catch (error: any) {
      console.error('Error adding note:', error);
      toast.error('Erreur lors de l\'ajout de la note');
    }
  };

  const handleSendEmail = async () => {
    if (!lead) return;
    
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
L'équipe Racco-Service`;

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
      const currentComments = lead.commentaires || '';
      const timestamp = new Date().toLocaleString('fr-FR');
      const newComment = `${timestamp} - ${user?.email}: ${emailNote}`;
      const updatedComments = currentComments 
        ? `${currentComments}\n\n${newComment}` 
        : newComment;

      await supabase
        .from('leads_raccordement')
        .update({ 
          commentaires: updatedComments,
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id);

      setLead(prev => prev ? { ...prev, commentaires: updatedComments } : null);
      toast.success('Email envoyé avec succès');
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error('Erreur lors de l\'envoi de l\'email');
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
      'permis_depose': 'bg-orange-100 text-orange-800',
      'attente_enedis': 'bg-purple-100 text-purple-800',
      'termine': 'bg-green-100 text-green-800',
      'archive': 'bg-gray-100 text-gray-800',
    };

    const colorClass = colors[status] || 'bg-gray-100 text-gray-800';

    return (
      <Badge className={colorClass}>
        {status?.replace('_', ' ') || 'Non défini'}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement du lead...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <p className="text-muted-foreground">Lead non trouvé</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {lead.prenom} {lead.nom}
              </h1>
              <p className="text-muted-foreground">
                {lead.type_client} • Créé le {formatDate(lead.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(lead.etat_projet)}
          </div>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Détails</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Notes</span>
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Emails</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Fichiers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Informations Client</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{lead.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <p className="font-medium">{lead.telephone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Type de client</p>
                      <p className="font-medium capitalize">{lead.type_client}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Assigné à</p>
                      <p className="font-medium">{lead.assigned_to_email || 'Non assigné'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Détails du Projet</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Adresse du chantier</p>
                        <p className="font-medium">{lead.adresse_chantier}</p>
                        <p className="text-sm text-muted-foreground">
                          {lead.ville} {lead.code_postal}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type de projet</p>
                      <p className="font-medium">{lead.type_projet}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Type de raccordement</p>
                      <p className="font-medium">{lead.type_raccordement}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Délai souhaité</p>
                        <p className="font-medium">{lead.delai_souhaite}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Spécifications Techniques</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Puissance souhaitée</p>
                    <p className="font-medium">{lead.puissance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type d'alimentation</p>
                    <p className="font-medium">{lead.type_alimentation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Panel */}
            {canSeeAllLeads && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Edit className="w-5 h-5" />
                    <span>Actions Rapides</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status Update */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Mettre à jour le statut
                      </label>
                      <Select
                        value={lead.etat_projet || ""}
                        onValueChange={handleStatusUpdate}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Changer le statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nouveau">Nouveau</SelectItem>
                          <SelectItem value="en_cours">En cours</SelectItem>
                          <SelectItem value="permis_depose">Permis déposé</SelectItem>
                          <SelectItem value="attente_enedis">Attente Enedis</SelectItem>
                          <SelectItem value="termine">Terminé</SelectItem>
                          <SelectItem value="archive">Archivé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Assignment */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Assigner à un membre de l'équipe
                      </label>
                       <Select
                         value={lead.assigned_to_email || "unassigned"}
                         onValueChange={handleAssignLead}
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

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Button onClick={handleSendEmail} className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Envoyer Email</span>
                    </Button>
                    <Button variant="outline" onClick={() => window.open(`tel:${lead.telephone}`)}>
                      <Phone className="w-4 h-4 mr-2" />
                      Appeler
                    </Button>
                    <Button variant="outline">
                      <Save className="w-4 h-4 mr-2" />
                      Générer Devis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Legacy Notes & Communication - keep for backward compatibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Notes & Communication (Legacy)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add New Note */}
                {canSeeAllLeads && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Ajouter une note
                      </label>
                      <Textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Tapez votre note ici..."
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                    <Button
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                      className="flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Ajouter la note</span>
                    </Button>
                  </div>
                )}

                {/* Communication History */}
                {lead.commentaires && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Historique des communications
                    </h4>
                    <div className="bg-muted p-4 rounded-lg max-h-60 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap font-sans">
                        {lead.commentaires}
                      </pre>
                    </div>
                  </div>
                )}

                {!lead.commentaires && (
                  <p className="text-muted-foreground text-center py-6">
                    Aucune note pour le moment
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <NotesTab leadId={lead.id} />
          </TabsContent>

          <TabsContent value="emails">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8 text-muted-foreground">
                  Fonctionnalité emails en cours de développement
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8 text-muted-foreground">
                  Fonctionnalité fichiers en cours de développement
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminLeadDetail;
