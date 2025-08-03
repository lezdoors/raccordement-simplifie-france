-- Task 1: Clean up invalid users
DELETE FROM public.admin_users 
WHERE email IN ('admin@raccordement.net', 'manager@raccordement.net', 'traiteur@raccordement.net');

-- Task 2: Update Ethan's permissions (remove export data permission as requested)
UPDATE public.admin_users 
SET can_export_data = false 
WHERE email = 'ethan@portailmail.com';

-- Task 3: Enable Supabase Realtime for tables
-- Enable replica identity for real-time updates
ALTER TABLE public.leads_raccordement REPLICA IDENTITY FULL;
ALTER TABLE public.admin_users REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads_raccordement;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;