-- Completely rebuild admin_users RLS policies with direct approach
DROP POLICY IF EXISTS "admin_users_select_safe" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_insert_safe" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_update_safe" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_delete_safe" ON public.admin_users;

-- Disable RLS temporarily to allow direct access for superadmin functions
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Create security definer function that bypasses RLS entirely
CREATE OR REPLACE FUNCTION public.get_current_admin_user()
RETURNS TABLE(email text, role text, is_active boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Direct query without RLS to avoid any recursion
  RETURN QUERY
  SELECT au.email, au.role, au.is_active
  FROM public.admin_users au
  WHERE au.email = auth.jwt() ->> 'email';
END;
$function$;

-- Re-enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create simple policies using the security definer function
CREATE POLICY "admin_users_select_direct" 
ON public.admin_users 
FOR SELECT 
USING (
  email = auth.jwt() ->> 'email' 
  OR 
  EXISTS (
    SELECT 1 FROM get_current_admin_user() cau 
    WHERE cau.role = 'superadmin' AND cau.is_active = true
  )
);

CREATE POLICY "admin_users_insert_direct" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM get_current_admin_user() cau 
    WHERE cau.role = 'superadmin' AND cau.is_active = true
  )
);

CREATE POLICY "admin_users_update_direct" 
ON public.admin_users 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM get_current_admin_user() cau 
    WHERE cau.role = 'superadmin' AND cau.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM get_current_admin_user() cau 
    WHERE cau.role = 'superadmin' AND cau.is_active = true
  )
);

CREATE POLICY "admin_users_delete_direct" 
ON public.admin_users 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM get_current_admin_user() cau 
    WHERE cau.role = 'superadmin' AND cau.is_active = true
  )
);