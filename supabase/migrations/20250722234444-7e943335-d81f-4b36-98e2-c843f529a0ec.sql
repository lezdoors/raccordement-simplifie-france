-- Update admin emails from raccordement.net to raccordement-elec.fr
UPDATE public.admins 
SET email = REPLACE(email, '@raccordement.net', '@raccordement-elec.fr')
WHERE email LIKE '%@raccordement.net';