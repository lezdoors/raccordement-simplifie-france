-- Fix Ethan's export data permission (should be false per requirements)
UPDATE public.admin_users 
SET can_export_data = false 
WHERE email = 'ethan@portailmail.com';