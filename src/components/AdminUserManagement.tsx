import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { UserPlus, Edit2, Trash2, Shield, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/contexts/AdminContext";
import { getRolePermissions, UserRole } from "@/utils/permissions";

interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
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
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    role: 'traiteur' as UserRole,
    department: ''
  });

  // Check if current user can manage users
  const canManageUsers = adminUser?.can_manage_users || adminUser?.role === 'superadmin';

  useEffect(() => {
    if (canManageUsers) {
      fetchUsers();
    }
  }, [canManageUsers]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      if (!newUser.email) {
        toast.error('L\'email est requis');
        return;
      }

      const permissions = getRolePermissions(newUser.role);
      
      const userData = {
        email: newUser.email,
        role: newUser.role,
        department: newUser.department || null,
        ...permissions,
        is_active: true
      };

      const { error } = await supabase
        .from('admin_users')
        .insert(userData);

      if (error) throw error;

      toast.success('Utilisateur ajouté avec succès');
      setShowAddDialog(false);
      setNewUser({ email: '', role: 'traiteur', department: '' });
      fetchUsers();
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast.error('Erreur lors de l\'ajout de l\'utilisateur');
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<AdminUser>) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      toast.success('Utilisateur mis à jour avec succès');
      fetchUsers();
      setEditingUser(null);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    await handleUpdateUser(userId, { is_active: isActive });
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const permissions = getRolePermissions(newRole);
    await handleUpdateUser(userId, { role: newRole, ...permissions });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-red-500 text-white';
      case 'manager': return 'bg-blue-500 text-white';
      case 'traiteur': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement des utilisateurs...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <CardTitle>Gestion des utilisateurs administrateurs</CardTitle>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Ajouter un utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel utilisateur administrateur</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Rôle *</Label>
                  <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traiteur">Traiteur</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      {adminUser?.role === 'superadmin' && (
                        <SelectItem value="superadmin">Super Administrateur</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Département</Label>
                  <Input
                    id="department"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    placeholder="Commercial, Technique..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddUser}>
                    Ajouter
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role === 'superadmin' ? 'Super Admin' : 
                       user.role === 'manager' ? 'Manager' : 'Traiteur'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {user.department || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {user.can_see_all_leads && (
                        <Badge variant="outline" className="text-xs">Voir tous les leads</Badge>
                      )}
                      {user.can_see_payments && (
                        <Badge variant="outline" className="text-xs">Voir paiements</Badge>
                      )}
                      {user.can_manage_users && (
                        <Badge variant="outline" className="text-xs">Gérer utilisateurs</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={user.is_active}
                        onCheckedChange={(checked) => handleToggleActive(user.id, checked)}
                        disabled={user.email === adminUser?.email} // Can't deactivate self
                      />
                      <span className="text-sm">
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(user.created_at)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingUser(user)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Modifier l'utilisateur</DialogTitle>
                          </DialogHeader>
                          {editingUser && (
                            <div className="space-y-4">
                              <div>
                                <Label>Email</Label>
                                <Input value={editingUser.email} disabled />
                              </div>
                              <div>
                                <Label>Rôle</Label>
                                <Select 
                                  value={editingUser.role} 
                                  onValueChange={(value: UserRole) => 
                                    handleRoleChange(editingUser.id, value)
                                  }
                                  disabled={editingUser.email === adminUser?.email}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="traiteur">Traiteur</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    {adminUser?.role === 'superadmin' && (
                                      <SelectItem value="superadmin">Super Administrateur</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
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
        </CardContent>
      </Card>
    </div>
  );
};