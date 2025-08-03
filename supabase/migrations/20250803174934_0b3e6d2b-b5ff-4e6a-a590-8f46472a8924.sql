-- Remove remaining invalid users
DELETE FROM public.admin_users 
WHERE email IN ('admin@raccordement.net', 'manager@raccordement.net', 'traiteur@raccordement.net');