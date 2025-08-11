-- Secure admin_users table access
-- 1) Ensure RLS is enabled
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 2) Drop any overly permissive/public policies if they exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'admin_users' AND policyname = 'Public can read admin users'
  ) THEN
    DROP POLICY "Public can read admin users" ON public.admin_users;
  END IF;
END$$;

-- 3) Recreate strict SELECT policy (only active admins can read their own record)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='admin_users' AND policyname='Active admins can read only their own admin record'
  ) THEN
    DROP POLICY "Active admins can read only their own admin record" ON public.admin_users;
  END IF;
END$$;

CREATE POLICY "Active admins can read only their own admin record"
ON public.admin_users
FOR SELECT
TO authenticated
USING (
  is_current_user_admin() AND email = auth.jwt() ->> 'email'
);

-- 4) Service role full management policy (explicitly scoped to service_role)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='admin_users' AND policyname='Service role can manage admin_users'
  ) THEN
    DROP POLICY "Service role can manage admin_users" ON public.admin_users;
  END IF;
END$$;

CREATE POLICY "Service role can manage admin_users"
ON public.admin_users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
