-- Fix permission issues by granting access and simplifying policies
-- Grant necessary permissions to authenticated users for admin_users table
GRANT SELECT ON public.admin_users TO authenticated;
GRANT INSERT ON public.admin_users TO authenticated;
GRANT UPDATE ON public.admin_users TO authenticated;
GRANT DELETE ON public.admin_users TO authenticated;

-- Drop current policies
DROP POLICY IF EXISTS "admin_users_select_direct" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_insert_direct" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_update_direct" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_delete_direct" ON public.admin_users;

-- Create simpler, direct policies that don't cause recursion
CREATE POLICY "admin_users_select_simple" 
ON public.admin_users 
FOR SELECT 
USING (
  -- Allow users to see their own record or if they are superadmin
  email = auth.jwt() ->> 'email'
  OR 
  auth.jwt() ->> 'email' IN (
    'ryanaoufal@gmail.com'  -- Direct superadmin email
  )
);

CREATE POLICY "admin_users_manage_simple" 
ON public.admin_users 
FOR ALL 
USING (
  -- Only superadmin can manage all records
  auth.jwt() ->> 'email' = 'ryanaoufal@gmail.com'
)
WITH CHECK (
  auth.jwt() ->> 'email' = 'ryanaoufal@gmail.com'
);