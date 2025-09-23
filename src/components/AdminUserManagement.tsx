import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  can_see_payments: boolean;
  can_manage_users: boolean;
  can_see_all_leads: boolean;
  can_export_data: boolean;
  is_active: boolean;
  created_at: string;
  department?: string;
}

export const AdminUserManagement = () => {
  const { adminUser } = useAdmin();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  // Check if current user can manage users
  const canManageUsers = adminUser?.can_manage_users || adminUser?.role === 'superadmin';

  useEffect(() => {
    if (canManageUsers) {
      setLoading(false);
      toast.info("Admin user management not yet implemented");
    }
  }, [canManageUsers]);

  if (!canManageUsers) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Accès restreint</h3>
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour gérer les utilisateurs.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <CardTitle>Gestion des utilisateurs administrateurs</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Fonctionnalité en développement</h3>
          <p className="text-muted-foreground">
            La gestion des utilisateurs administrateurs sera disponible prochainement.
          </p>
          <Badge variant="secondary" className="mt-4">
            À venir
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};