import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  UserPlus, 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar,
  Edit3,
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

interface CRMLeadActionsProps {
  lead: any;
  onStatusUpdate: (leadId: string, status: string) => void;
  onAssignLead: (leadId: string, email: string) => void;
  onAddNote: (leadId: string, note: string) => void;
}

export const CRMLeadActions = ({ 
  lead, 
  onStatusUpdate, 
  onAssignLead, 
  onAddNote 
}: CRMLeadActionsProps) => {
  const [newNote, setNewNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(lead.etat_projet || '');
  const [selectedAssignee, setSelectedAssignee] = useState(lead.assigned_to_email || '');

  const handleQuickCall = () => {
    window.open(`tel:${lead.telephone}`, '_self');
    onAddNote(lead.id, `Appel effectué vers ${lead.telephone}`);
    toast.success('Appel initié');
  };

  const handleQuickEmail = () => {
    const subject = encodeURIComponent(`Votre demande de raccordement - ${lead.nom} ${lead.prenom}`);
    const body = encodeURIComponent(`Bonjour ${lead.prenom},\\n\\nNous avons bien reçu votre demande de raccordement.\\n\\nCordialement,\\nL'équipe Raccordement Connect`);
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_self');
    onAddNote(lead.id, `Email envoyé à ${lead.email}`);
    toast.success('Client de messagerie ouvert');
  };

  const handleStatusUpdate = () => {
    if (selectedStatus !== lead.etat_projet) {
      onStatusUpdate(lead.id, selectedStatus);
    }
  };

  const handleAssignUpdate = () => {
    if (selectedAssignee !== lead.assigned_to_email) {
      onAssignLead(lead.id, selectedAssignee);
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(lead.id, newNote);
      setNewNote('');
      toast.success('Note ajoutée avec succès');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nouveau': return 'bg-blue-100 text-blue-800';
      case 'en_cours': return 'bg-yellow-100 text-yellow-800';
      case 'contacte': return 'bg-purple-100 text-purple-800';
      case 'devis_envoye': return 'bg-orange-100 text-orange-800';
      case 'valide': return 'bg-green-100 text-green-800';
      case 'refuse': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormTypeBadge = (formType: string) => {
    switch (formType) {
      case 'quick': return <Badge variant="secondary">Contact rapide</Badge>;
      case 'callback': return <Badge variant="outline">Rappel demandé</Badge>;
      case 'step1': return <Badge variant="destructive">Partiel</Badge>;
      case 'full': return <Badge variant="default">Complet</Badge>;
      default: return <Badge variant="secondary">{formType}</Badge>;
    }
  };

  const getPriorityBadge = (lead: any) => {
    if (lead.payment_status === 'paid') {
      return <Badge className="bg-green-100 text-green-800">💳 Payé</Badge>;
    }
    if (lead.form_type === 'callback') {
      return <Badge className="bg-red-100 text-red-800">📞 Urgent</Badge>;
    }
    if (lead.form_type === 'step1') {
      return <Badge className="bg-yellow-100 text-yellow-800">⚠️ À compléter</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Lead Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {lead.prenom} {lead.nom}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {getFormTypeBadge(lead.form_type)}
            {getPriorityBadge(lead)}
            <Badge className={getStatusColor(lead.etat_projet || 'nouveau')}>
              {lead.etat_projet || 'nouveau'}
            </Badge>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date(lead.created_at).toLocaleDateString('fr-FR')}
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
        <div>
          <Label className="text-xs text-muted-foreground">Email</Label>
          <p className="text-sm">{lead.email}</p>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Téléphone</Label>
          <p className="text-sm">{lead.telephone}</p>
        </div>
        {lead.ville && (
          <div>
            <Label className="text-xs text-muted-foreground">Ville</Label>
            <p className="text-sm">{lead.ville}</p>
          </div>
        )}
        {lead.type_projet && (
          <div>
            <Label className="text-xs text-muted-foreground">Type de projet</Label>
            <p className="text-sm">{lead.type_projet}</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleQuickCall}
          className="flex-1"
        >
          <Phone className="h-4 w-4 mr-1" />
          Appeler
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleQuickEmail}
          className="flex-1"
        >
          <Mail className="h-4 w-4 mr-1" />
          Email
        </Button>
      </div>

      {/* Status Management */}
      <div className="space-y-3">
        <div>
          <Label className="text-sm">Statut</Label>
          <div className="flex gap-2 mt-1">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Changer le statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nouveau">Nouveau</SelectItem>
                <SelectItem value="contacte">Contacté</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="devis_envoye">Devis envoyé</SelectItem>
                <SelectItem value="valide">Validé</SelectItem>
                <SelectItem value="refuse">Refusé</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              onClick={handleStatusUpdate}
              disabled={selectedStatus === lead.etat_projet}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-sm">Assigné à</Label>
          <div className="flex gap-2 mt-1">
            <Select value={selectedAssignee || 'unassigned'} onValueChange={setSelectedAssignee}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Assigner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Non assigné</SelectItem>
                <SelectItem value="admin@raccordement-elec.fr">Admin</SelectItem>
                <SelectItem value="commercial@raccordement-elec.fr">Commercial</SelectItem>
                <SelectItem value="technique@raccordement-elec.fr">Technique</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              onClick={handleAssignUpdate}
              disabled={selectedAssignee === lead.assigned_to_email}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Add Note */}
      <div className="space-y-2">
        <Label className="text-sm">Ajouter une note</Label>
        <Textarea
          placeholder="Ajouter une note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={3}
        />
        <Button 
          size="sm" 
          onClick={handleAddNote}
          disabled={!newNote.trim()}
          className="w-full"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Ajouter la note
        </Button>
      </div>

      {/* Existing Comments */}
      {lead.commentaires && (
        <div className="space-y-2">
          <Label className="text-sm">Commentaires existants</Label>
          <div className="p-3 bg-muted/50 rounded text-sm max-h-32 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-xs">{lead.commentaires}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
