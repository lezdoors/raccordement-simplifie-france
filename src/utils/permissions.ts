export type UserRole = 'superadmin' | 'manager' | 'traiteur';

export interface UserPermissions {
  can_see_payments: boolean;
  can_manage_users: boolean;
  can_see_all_leads: boolean;
  can_export_data: boolean;
  can_modify_settings: boolean;
  can_assign_leads: boolean;
}

export const getRolePermissions = (role: UserRole): UserPermissions => {
  switch (role) {
    case 'superadmin':
      return {
        can_see_payments: true,
        can_manage_users: true,
        can_see_all_leads: true,
        can_export_data: true,
        can_modify_settings: true,
        can_assign_leads: true,
      };
    case 'manager':
      return {
        can_see_payments: true,
        can_manage_users: false,
        can_see_all_leads: true,
        can_export_data: true,
        can_modify_settings: false,
        can_assign_leads: true,
      };
    case 'traiteur':
      return {
        can_see_payments: false,
        can_manage_users: false,
        can_see_all_leads: false,
        can_export_data: false,
        can_modify_settings: false,
        can_assign_leads: false,
      };
    default:
      return {
        can_see_payments: false,
        can_manage_users: false,
        can_see_all_leads: false,
        can_export_data: false,
        can_modify_settings: false,
        can_assign_leads: false,
      };
  }
};