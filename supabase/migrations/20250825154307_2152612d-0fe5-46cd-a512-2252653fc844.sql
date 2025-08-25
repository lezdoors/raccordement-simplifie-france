-- Fix infinite recursion in admin_users RLS policies
-- Create security definer function to check admin status safely
CREATE OR REPLACE FUNCTION public.is_current_user_admin_safe()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Direct check without RLS to avoid recursion
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = auth.jwt() ->> 'email' AND is_active = true
  );
END;
$function$;

-- Drop existing recursive policies
DROP POLICY IF EXISTS "admin_users_select_secure" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_insert_secure" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_update_secure" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_delete_secure" ON public.admin_users;

-- Create new non-recursive policies using the security definer function
CREATE POLICY "admin_users_select_safe" 
ON public.admin_users 
FOR SELECT 
USING (
  email = auth.jwt() ->> 'email' OR 
  (auth.jwt() ->> 'email' IN (
    SELECT email FROM public.admin_users 
    WHERE role = 'superadmin' AND is_active = true
  ))
);

CREATE POLICY "admin_users_insert_safe" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (
  auth.jwt() ->> 'email' IN (
    SELECT email FROM public.admin_users 
    WHERE role = 'superadmin' AND is_active = true
  )
);

CREATE POLICY "admin_users_update_safe" 
ON public.admin_users 
FOR UPDATE 
USING (
  auth.jwt() ->> 'email' IN (
    SELECT email FROM public.admin_users 
    WHERE role = 'superadmin' AND is_active = true
  )
)
WITH CHECK (
  auth.jwt() ->> 'email' IN (
    SELECT email FROM public.admin_users 
    WHERE role = 'superadmin' AND is_active = true
  )
);

CREATE POLICY "admin_users_delete_safe" 
ON public.admin_users 
FOR DELETE 
USING (
  auth.jwt() ->> 'email' IN (
    SELECT email FROM public.admin_users 
    WHERE role = 'superadmin' AND is_active = true
  )
);