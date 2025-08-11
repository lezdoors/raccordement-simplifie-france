-- Fix RLS performance (wrap auth functions with SELECT) and clean duplicate indexes

-- 1) Profiles policies: wrap auth functions and scope to authenticated
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Admins can read all profiles') THEN
    DROP POLICY "Admins can read all profiles" ON public.profiles;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Allow user to access their profile') THEN
    DROP POLICY "Allow user to access their profile" ON public.profiles;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Users can manage their own profile') THEN
    DROP POLICY "Users can manage their own profile" ON public.profiles;
  END IF;
END$$;

CREATE POLICY "Admins can read all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = (select auth.jwt()) ->> 'email'
      AND au.is_active = true
  )
);

CREATE POLICY "Allow user to access their profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = (select auth.uid()));

CREATE POLICY "Users can manage their own profile"
ON public.profiles
FOR ALL
TO authenticated
USING (id = (select auth.uid()))
WITH CHECK (id = (select auth.uid()));

-- 2) lead_notes policy: wrap auth.jwt()
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='lead_notes' AND policyname='Admins can manage lead notes') THEN
    DROP POLICY "Admins can manage lead notes" ON public.lead_notes;
  END IF;
END$$;

CREATE POLICY "Admins can manage lead notes"
ON public.lead_notes
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = (select auth.jwt()) ->> 'email' AND au.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = (select auth.jwt()) ->> 'email' AND au.is_active = true
  )
);

-- 3) lead_status_history policy: wrap auth.jwt()
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='lead_status_history' AND policyname='Admins can view lead status history') THEN
    DROP POLICY "Admins can view lead status history" ON public.lead_status_history;
  END IF;
END$$;

CREATE POLICY "Admins can view lead status history"
ON public.lead_status_history
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = (select auth.jwt()) ->> 'email' AND au.is_active = true
  )
);

-- 4) payments policy: wrap auth.jwt()
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='payments' AND policyname='Only admins with payment permission can view payments') THEN
    DROP POLICY "Only admins with payment permission can view payments" ON public.payments;
  END IF;
END$$;

CREATE POLICY "Only admins with payment permission can view payments"
ON public.payments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = (select auth.jwt()) ->> 'email'
      AND au.is_active = true
      AND au.can_see_payments = true
  )
);

-- 5) admin_users policy: wrap auth.jwt()
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_users' AND policyname='Active admins can read only their own admin record') THEN
    DROP POLICY "Active admins can read only their own admin record" ON public.admin_users;
  END IF;
END$$;

CREATE POLICY "Active admins can read only their own admin record"
ON public.admin_users
FOR SELECT
TO authenticated
USING (
  is_current_user_admin() AND email = (select auth.jwt()) ->> 'email'
);

-- 6) leads_raccordement policy (assigned users): wrap auth.jwt()
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='leads_raccordement' AND policyname='Assigned users can view their leads') THEN
    DROP POLICY "Assigned users can view their leads" ON public.leads_raccordement;
  END IF;
END$$;

CREATE POLICY "Assigned users can view their leads"
ON public.leads_raccordement
FOR SELECT
TO authenticated
USING (assigned_to_email = (select auth.jwt()) ->> 'email');

-- 7) Drop duplicate indexes on leads_raccordement
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relkind='i' AND relname='idx_leads_assigned_to') THEN
    EXECUTE 'DROP INDEX IF EXISTS public.idx_leads_assigned_to';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_class WHERE relkind='i' AND relname='idx_leads_raccordement_assigned') THEN
    EXECUTE 'DROP INDEX IF EXISTS public.idx_leads_raccordement_assigned';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_class WHERE relkind='i' AND relname='idx_leads_status') THEN
    EXECUTE 'DROP INDEX IF EXISTS public.idx_leads_status';
  END IF;
END$$;