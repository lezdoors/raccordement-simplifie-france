-- Fix infinite recursion and security issues once and for all

-- 1. Drop problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Active admins can read only their own admin record" ON public.admin_users;
DROP POLICY IF EXISTS "admins_read_self" ON public.admin_users;
DROP POLICY IF EXISTS "admins_read_superadmin" ON public.admin_users;
DROP POLICY IF EXISTS "admins_write_superadmin" ON public.admin_users;
DROP POLICY IF EXISTS "Service role can manage admin_users" ON public.admin_users;

-- 2. Drop old overly-broad policies on leads_raccordement
DROP POLICY IF EXISTS "leads_select_all" ON public.leads_raccordement;
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads_raccordement;
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads_raccordement;
DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads_raccordement;
DROP POLICY IF EXISTS "Assigned users can view their leads" ON public.leads_raccordement;
DROP POLICY IF EXISTS "Traiteur users can view assigned leads with limited fields" ON public.leads_raccordement;

-- 3. Create secure admin_users policies without recursion
CREATE POLICY "admin_users_select_secure"
ON public.admin_users
FOR SELECT
USING (
  -- Only allow reading own record or if superadmin
  email = (auth.jwt()->>'email') OR
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = (auth.jwt()->>'email')
      AND au.role = 'superadmin' 
      AND au.is_active = true
  )
);

CREATE POLICY "admin_users_update_secure" 
ON public.admin_users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = (auth.jwt()->>'email')
      AND au.role = 'superadmin'
      AND au.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = (auth.jwt()->>'email')
      AND au.role = 'superadmin'
      AND au.is_active = true
  )
);

CREATE POLICY "admin_users_insert_secure"
ON public.admin_users
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = (auth.jwt()->>'email')
      AND au.role = 'superadmin'
      AND au.is_active = true
  )
);

CREATE POLICY "admin_users_delete_secure"
ON public.admin_users
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = (auth.jwt()->>'email')
      AND au.role = 'superadmin'
      AND au.is_active = true
  )
);

-- 4. Create secure leads_raccordement policies with proper role separation
CREATE POLICY "leads_read_mgr_sa"
ON public.leads_raccordement
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt()->>'email')
      AND role IN ('manager','superadmin') 
      AND is_active = true
  )
);

CREATE POLICY "leads_read_traiteur_assigned"
ON public.leads_raccordement
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = (auth.jwt()->>'email')
      AND au.role = 'traiteur' 
      AND au.is_active = true
      AND au.email = leads_raccordement.assigned_to_email
  )
);

CREATE POLICY "leads_insert_mgr_sa"
ON public.leads_raccordement
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt()->>'email')
      AND role IN ('manager','superadmin') 
      AND is_active = true
  )
);

CREATE POLICY "leads_update_mgr_sa"
ON public.leads_raccordement
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt()->>'email')
      AND role IN ('manager','superadmin') 
      AND is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt()->>'email')
      AND role IN ('manager','superadmin') 
      AND is_active = true
  )
);

CREATE POLICY "leads_delete_mgr_sa"
ON public.leads_raccordement
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt()->>'email')
      AND role IN ('manager','superadmin') 
      AND is_active = true
  )
);

-- 5. Update traiteur update policy (limited scope)
CREATE POLICY "leads_update_traiteur_assigned"
ON public.leads_raccordement
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = (auth.jwt()->>'email')
      AND au.role = 'traiteur' 
      AND au.is_active = true
      AND au.email = leads_raccordement.assigned_to_email
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = (auth.jwt()->>'email')
      AND au.role = 'traiteur' 
      AND au.is_active = true
      AND au.email = leads_raccordement.assigned_to_email
  )
);

-- 6. Drop and recreate leads_for_traiteur view with proper security
DROP VIEW IF EXISTS public.leads_for_traiteur;

CREATE VIEW public.leads_for_traiteur AS
SELECT
  -- Non-sensitive fields
  id, email, created_at, updated_at, consent_accepted, form_step, assigned_to, priority,
  civilite, type_client, nom, prenom, telephone, code_postal, ville, raison_sociale, siren,
  type_raccordement, type_projet, type_alimentation, puissance, adresse_chantier, numero_pdl,
  etat_projet, delai_souhaite, type_facturation, commentaires, assigned_to_email, status, form_type,
  -- Payment fields explicitly NULL for Traiteur security
  NULL::integer as amount,
  NULL::text as payment_status,
  NULL::text as stripe_session_id
FROM public.leads_raccordement
WHERE EXISTS (
  SELECT 1 FROM public.admin_users au
  WHERE au.email = (auth.jwt()->>'email') 
    AND au.role = 'traiteur' 
    AND au.is_active = true
    AND au.email = leads_raccordement.assigned_to_email
);

-- Grant proper permissions
GRANT SELECT ON public.leads_for_traiteur TO authenticated;

-- 7. Strengthen payments table security
DROP POLICY IF EXISTS "payments_insert_service_only" ON public.payments;
DROP POLICY IF EXISTS "payments_update_service_only" ON public.payments;

CREATE POLICY "payments_no_user_writes"
ON public.payments
FOR INSERT
WITH CHECK (false);

CREATE POLICY "payments_no_user_updates"
ON public.payments
FOR UPDATE
USING (false);

CREATE POLICY "payments_no_user_deletes"
ON public.payments
FOR DELETE
USING (false);

-- 8. Ensure messages table is secure
DROP POLICY IF EXISTS "Only admins can read messages" ON public.messages;

CREATE POLICY "messages_admin_read_only"
ON public.messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt()->>'email')
      AND is_active = true
  )
);

-- 9. Fix search path issues in existing functions
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN (
    is_session_valid() AND
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.jwt() ->> 'email' AND is_active = true
    )
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_manager_or_superadmin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN (
    is_current_user_admin() AND
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND role = ANY (ARRAY['superadmin'::text, 'manager'::text])
      AND is_active = true
    )
  );
END;
$function$;