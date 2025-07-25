import { ReactNode } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { UserRole, getRolePermissions } from '@/utils/permissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: keyof ReturnType<typeof getRolePermissions>;
  fallback?: ReactNode;
}

export const RoleGuard = ({ 
  children, 
  requiredRole, 
  requiredPermission, 
  fallback 
}: RoleGuardProps) => {
  const { adminUser } = useAdmin();

  if (!adminUser) {
    return fallback || (
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          Vérification des autorisations en cours...
        </AlertDescription>
      </Alert>
    );
  }

  // Check role requirement
  if (requiredRole && adminUser.role !== requiredRole) {
    return fallback || (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Accès refusé. Rôle requis : {requiredRole}
        </AlertDescription>
      </Alert>
    );
  }

  // Check permission requirement
  if (requiredPermission) {
    const permissions = getRolePermissions(adminUser.role as UserRole);
    if (!permissions[requiredPermission]) {
      return fallback || (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Vous n'avez pas les autorisations nécessaires pour accéder à cette section.
          </AlertDescription>
        </Alert>
      );
    }
  }

  return <>{children}</>;
};