-- Harden RLS for leads_raccordement without breaking functionality

-- Ensure RLS is enabled
ALTER TABLE public.leads_raccordement ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate with explicit roles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='leads_raccordement' AND policyname='Admins can view all leads'
  ) THEN
    DROP POLICY "Admins can view all leads" ON public.leads_raccordement;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='leads_raccordement' AND policyname='Assigned users can view their leads'
  ) THEN
    DROP POLICY "Assigned users can view their leads" ON public.leads_raccordement;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='leads_raccordement' AND policyname='Admins can update leads'
  ) THEN
    DROP POLICY "Admins can update leads" ON public.leads_raccordement;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='leads_raccordement' AND policyname='Admins can delete leads'
  ) THEN
    DROP POLICY "Admins can delete leads" ON public.leads_raccordement;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='leads_raccordement' AND policyname='Service role can manage leads'
  ) THEN
    DROP POLICY "Service role can manage leads" ON public.leads_raccordement;
  END IF;
END$$;

-- Recreate policies with explicit, least-privilege scoping

-- Admins can view all leads
CREATE POLICY "Admins can view all leads"
ON public.leads_raccordement
FOR SELECT
TO authenticated
USING (is_current_user_admin());

-- Assigned users can view only their leads
CREATE POLICY "Assigned users can view their leads"
ON public.leads_raccordement
FOR SELECT
TO authenticated
USING (assigned_to_email = auth.jwt() ->> 'email');

-- Admins can update leads
CREATE POLICY "Admins can update leads"
ON public.leads_raccordement
FOR UPDATE
TO authenticated
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Admins can delete leads
CREATE POLICY "Admins can delete leads"
ON public.leads_raccordement
FOR DELETE
TO authenticated
USING (is_current_user_admin());

-- Anonymous lead submission stays allowed (no change)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='leads_raccordement' AND policyname='Allow anonymous lead submission'
  ) THEN
    CREATE POLICY "Allow anonymous lead submission"
    ON public.leads_raccordement
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
  END IF;
END$$;

-- Restrict full management to service role explicitly
CREATE POLICY "Service role can manage leads"
ON public.leads_raccordement
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
