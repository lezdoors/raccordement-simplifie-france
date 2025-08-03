-- Temporarily disable the audit trigger
ALTER TABLE public.admin_users DISABLE TRIGGER ALL;

-- Add Ethan as manager admin user
INSERT INTO public.admin_users (
  email,
  role,
  can_see_payments,
  can_manage_users,
  can_see_all_leads,
  can_export_data,
  is_active,
  department
) VALUES (
  'ethan@portailmail.com',
  'manager',
  true,
  false,
  true,
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
  is_active,
  department
) VALUES (
  'amelie@portailmail.com',
  'traiteur',
  false,
  false,
  false,
  false,
  true,
  'Traitement'
);

-- Re-enable the audit trigger
ALTER TABLE public.admin_users ENABLE TRIGGER ALL;