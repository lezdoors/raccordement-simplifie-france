
import { UserRole, getRolePermissions } from './permissions';

export interface RoleBasedConfig {
  showPayments: boolean;
  showAllLeads: boolean;
  canManageUsers: boolean;
  canExportData: boolean;
  canModifySettings: boolean;
  canAssignLeads: boolean;
  allowedFields: string[];
  tableView: 'full' | 'traiteur';
}

export const getRoleBasedConfig = (role: UserRole): RoleBasedConfig => {
  const permissions = getRolePermissions(role);
  
  const baseFields = [
    'id', 'created_at', 'updated_at', 'civilite', 'prenom', 'nom', 'email', 
    'telephone', 'type_client', 'type_raccordement', 'type_projet', 
    'type_alimentation', 'puissance', 'adresse_chantier', 'code_postal', 
    'ville', 'etat_projet', 'delai_souhaite', 'commentaires', 'assigned_to_email'
  ];

  const paymentFields = ['payment_status', 'amount', 'stripe_session_id'];
  const sensitiveFields = ['raison_sociale', 'siren', 'numero_pdl'];

  let allowedFields = [...baseFields];
  
  if (permissions.can_see_payments) {
    allowedFields = [...allowedFields, ...paymentFields];
  }
  
  if (role === 'superadmin' || role === 'manager') {
    allowedFields = [...allowedFields, ...sensitiveFields];
  }

  return {
    showPayments: permissions.can_see_payments,
    showAllLeads: permissions.can_see_all_leads,
    canManageUsers: permissions.can_manage_users,
    canExportData: permissions.can_export_data,
    canModifySettings: permissions.can_modify_settings,
    canAssignLeads: permissions.can_assign_leads,
    allowedFields,
    tableView: role === 'traiteur' ? 'traiteur' : 'full'
  };
};

export const filterLeadDataByRole = (lead: any, role: UserRole) => {
  const config = getRoleBasedConfig(role);
  const filteredLead: any = {};
  
  config.allowedFields.forEach(field => {
    if (lead[field] !== undefined) {
      filteredLead[field] = lead[field];
    }
  });
  
  return filteredLead;
};

export const getTableColumnsForRole = (role: UserRole) => {
  const config = getRoleBasedConfig(role);
  
  const baseColumns = [
    { key: 'priority', label: 'Priorité' },
    { key: 'client', label: 'Client' },
    { key: 'contact', label: 'Contact' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Statut' },
    { key: 'assigned', label: 'Assigné à' },
    { key: 'date', label: 'Date' }
  ];

  const paymentColumns = [
    { key: 'payment', label: 'Paiement' },
    { key: 'amount', label: 'Montant' }
  ];

  return config.showPayments 
    ? [...baseColumns, ...paymentColumns, { key: 'actions', label: 'Actions' }]
    : [...baseColumns, { key: 'actions', label: 'Actions' }];
};
