import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Phone, Mail, User } from "lucide-react";

interface Lead {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  type_client: string;
  type_raccordement?: string;
  type_projet?: string;
  puissance?: string;
  adresse_chantier?: string;
  ville?: string;
  status?: string;
  created_at: string;
  delai_souhaite?: string;
  commentaires?: string;
}

interface LeadPreviewModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeadPreviewModal = ({ lead, isOpen, onClose }: LeadPreviewModalProps) => {
  if (!lead) return null;

  const getStatusColor = (status: string = 'nouveau') => {
    switch (status.toLowerCase()) {
      case 'nouveau': return 'bg-blue-500';
      case 'en_cours': return 'bg-yellow-500';
      case 'termine': return 'bg-green-500';
      case 'annule': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {lead.prenom} {lead.nom}
            <Badge className={`ml-2 ${getStatusColor(lead.status)}`}>
              {lead.status || 'nouveau'}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg mb-2">Informations Contact</h3>
            
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{lead.email}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${lead.telephone}`} className="hover:underline">
                {lead.telephone}
              </a>
            </div>
            
            {lead.adresse_chantier && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{lead.adresse_chantier}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Créé le {new Date(lead.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-lg mb-2">Détails du Projet</h3>
            
            <div>
              <span className="font-medium">Type de client :</span>
              <span className="ml-2">{lead.type_client}</span>
            </div>
            
            {lead.type_raccordement && (
              <div>
                <span className="font-medium">Type de raccordement :</span>
                <span className="ml-2">{lead.type_raccordement}</span>
              </div>
            )}
            
            {lead.type_projet && (
              <div>
                <span className="font-medium">Type de projet :</span>
                <span className="ml-2">{lead.type_projet}</span>
              </div>
            )}
            
            {lead.puissance && (
              <div>
                <span className="font-medium">Puissance :</span>
                <span className="ml-2">{lead.puissance}</span>
              </div>
            )}
            
            {lead.delai_souhaite && (
              <div>
                <span className="font-medium">Délai souhaité :</span>
                <span className="ml-2">{lead.delai_souhaite}</span>
              </div>
            )}
          </div>
        </div>
        
        {lead.commentaires && (
          <div className="mt-4">
            <h3 className="font-semibold text-lg mb-2">Commentaires</h3>
            <p className="text-muted-foreground bg-muted p-3 rounded-md">
              {lead.commentaires}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};