-- Add Ethan as manager admin user
INSERT INTO public.admin_users (
  email,
  role,
  can_see_payments,
  can_manage_users,
  can_see_all_leads,
  can_export_data,
  can_modify_settings,
  can_assign_leads,
  is_active,
  department
) VALUES (
  'ethan@portailmail.com',
  'manager',
  true,
  false,
  true,
  true,
  false,
  true,
  true,
  'Management'
);

-- Add Amelie as traiteur admin user
INSERT INTO public.admin_users (
  email,
  role,
  can_see_payments,
  can_manage_users,
  can_see_all_leads,
  can_export_data,
  can_modify_settings,
  can_assign_leads,
  is_active,
  department
) VALUES (
  'amelie@portailmail.com',
  'traiteur',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'Traitement'
);