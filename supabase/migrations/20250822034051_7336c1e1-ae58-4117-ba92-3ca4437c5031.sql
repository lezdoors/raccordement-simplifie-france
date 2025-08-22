
-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop existing policies for lead_emails_internal to replace with more specific ones
DROP POLICY IF EXISTS "Superadmin full access to internal emails" ON public.lead_emails_internal;
DROP POLICY IF EXISTS "Manager access to all internal emails" ON public.lead_emails_internal;
DROP POLICY IF EXISTS "Traiteur access to assigned lead emails" ON public.lead_emails_internal;

-- Keep SELECT policy for reading (same as before)
CREATE POLICY "LE emails select access" 
  ON public.lead_emails_internal 
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM admin_users au
    LEFT JOIN leads_raccordement l ON l.assigned_to_email = au.email
    WHERE au.email = (auth.jwt() ->> 'email') 
    AND au.is_active = true
    AND (
      au.role IN ('superadmin', 'manager')
      OR (au.role = 'traiteur' AND l.id = lead_emails_internal.lead_id)
    )
  ));

-- Allow INSERT only if user is superadmin/manager OR traiteur assigned to that lead
CREATE POLICY "LE emails insert check"
  ON public.lead_emails_internal
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.admin_users au
      LEFT JOIN public.leads_raccordement l ON l.assigned_to_email = au.email
      WHERE au.email = (auth.jwt() ->> 'email')
        AND au.is_active = true
        AND (
          au.role IN ('superadmin','manager')
          OR (au.role = 'traiteur' AND l.id = lead_emails_internal.lead_id)
        )
    )
  );

-- Allow UPDATE only if same condition is true
CREATE POLICY "LE emails update check"
  ON public.lead_emails_internal
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_users au
      LEFT JOIN public.leads_raccordement l ON l.assigned_to_email = au.email
      WHERE au.email = (auth.jwt() ->> 'email')
        AND au.is_active = true
        AND (
          au.role IN ('superadmin','manager')
          OR (au.role = 'traiteur' AND l.id = lead_emails_internal.lead_id)
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.admin_users au
      LEFT JOIN public.leads_raccordement l ON l.assigned_to_email = au.email
      WHERE au.email = (auth.jwt() ->> 'email')
        AND au.is_active = true
        AND (
          au.role IN ('superadmin','manager')
          OR (au.role = 'traiteur' AND l.id = lead_emails_internal.lead_id)
        )
    )
  );

-- Allow DELETE for superadmin/manager OR traiteur assigned to that lead
CREATE POLICY "LE emails delete check"
  ON public.lead_emails_internal
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_users au
      LEFT JOIN public.leads_raccordement l ON l.assigned_to_email = au.email
      WHERE au.email = (auth.jwt() ->> 'email')
        AND au.is_active = true
        AND (
          au.role IN ('superadmin','manager')
          OR (au.role = 'traiteur' AND l.id = lead_emails_internal.lead_id)
        )
    )
  );
