import { Phone, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

interface CRMHeaderProps {
  newLeadsCount?: number;
}

export const CRMHeader = ({ newLeadsCount = 0 }: CRMHeaderProps) => {
  const navigate = useNavigate();
  const { user, adminUser } = useAdmin();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erreur lors de la déconnexion');
    } else {
      toast.success('Déconnexion réussie');
      navigate('/login');
    }
  };

  return (
    <>
      {/* Phone Header */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center">
        <a 
          href="tel:+33189701200" 
          className="inline-flex items-center gap-2 hover:underline font-medium"
        >
          <Phone className="h-4 w-4" />
          Téléphone : 01 89 70 12 00
        </a>
      </div>

      {/* Main Header */}
      <div className="bg-secondary border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                CRM Raccordement Électrique
              </h1>
              <p className="text-sm text-muted-foreground">
                Gestion des demandes de raccordement
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Connecté en tant que</p>
                <p className="font-medium text-foreground">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">
                    {adminUser?.role || 'En attente'}
                  </Badge>
                  {newLeadsCount > 0 && (
                    <Badge variant="default" className="bg-red-500">
                      <Bell className="w-3 h-3 mr-1" />
                      {newLeadsCount} nouveau{newLeadsCount > 1 ? 'x' : ''}
                    </Badge>
                  )}
                </div>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};