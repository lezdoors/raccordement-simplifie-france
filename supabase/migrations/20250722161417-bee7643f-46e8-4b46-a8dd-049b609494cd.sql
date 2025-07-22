-- Add initial admin users for immediate access
INSERT INTO public.admin_users (email, role, can_see_payments, can_manage_users, can_see_all_leads, is_active) VALUES
('admin@raccordement.net', 'superadmin', true, true, true, true),
('manager@raccordement.net', 'manager', true, false, true, true),
('traiteur@raccordement.net', 'traiteur', false, false, false, true)
ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  can_see_payments = EXCLUDED.can_see_payments,
  can_manage_users = EXCLUDED.can_manage_users,
  can_see_all_leads = EXCLUDED.can_see_all_leads,
  is_active = EXCLUDED.is_active;