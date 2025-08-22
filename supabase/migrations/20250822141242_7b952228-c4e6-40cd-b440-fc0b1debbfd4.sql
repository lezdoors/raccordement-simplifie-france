-- Fix final security issues

-- 1. Drop the leads_for_traiteur view completely since it's flagged as security definer
-- We already have proper RLS policies on leads_raccordement table
DROP VIEW IF EXISTS public.leads_for_traiteur;

-- 2. Enable RLS on email_templates table  
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- 3. Create proper RLS policies for email_templates
DROP POLICY IF EXISTS "Admins can manage email templates" ON public.email_templates;

CREATE POLICY "email_templates_admin_access"
ON public.email_templates
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt()->>'email')
      AND is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (auth.jwt()->>'email')
      AND is_active = true
  )
);

-- 4. Ensure all our functions have proper search paths (no mutable functions)
CREATE OR REPLACE FUNCTION public.get_leads_for_traiteur()
RETURNS TABLE(
  id uuid, email text, created_at timestamp with time zone, updated_at timestamp with time zone, consent_accepted boolean, form_step integer, assigned_to uuid, priority integer, civilite text, type_client text, nom text, prenom text, telephone text, code_postal text, ville text, raison_sociale text, siren text, type_raccordement text, type_projet text, type_alimentation text, puissance text, adresse_chantier text, numero_pdl text, etat_projet text, delai_souhaite text, type_facturation text, commentaires text, assigned_to_email text, status character varying, form_type text, amount integer, payment_status text, stripe_session_id text
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if user is a manager or superadmin to show sensitive data
  IF (is_manager_or_superadmin()) THEN
    RETURN QUERY
    SELECT 
      l.id, l.email, l.created_at, l.updated_at, l.consent_accepted,
      l.form_step, l.assigned_to, l.priority, l.civilite, l.type_client,
      l.nom, l.prenom, l.telephone, l.code_postal, l.ville,
      l.raison_sociale, l.siren, l.type_raccordement, l.type_projet,
      l.type_alimentation, l.puissance, l.adresse_chantier, l.numero_pdl,
      l.etat_projet, l.delai_souhaite, l.type_facturation, l.commentaires,
      l.assigned_to_email, l.status, l.form_type,
      l.amount, l.payment_status, l.stripe_session_id
    FROM leads_raccordement l;
  ELSE
    -- For traiteur users, return with sensitive fields as null and only assigned leads
    RETURN QUERY
    SELECT 
      l.id, l.email, l.created_at, l.updated_at, l.consent_accepted,
      l.form_step, l.assigned_to, l.priority, l.civilite, l.type_client,
      l.nom, l.prenom, l.telephone, l.code_postal, l.ville,
      l.raison_sociale, l.siren, l.type_raccordement, l.type_projet,
      l.type_alimentation, l.puissance, l.adresse_chantier, l.numero_pdl,
      l.etat_projet, l.delai_souhaite, l.type_facturation, l.commentaires,
      l.assigned_to_email, l.status, l.form_type,
      NULL::integer as amount, NULL::text as payment_status, NULL::text as stripe_session_id
    FROM leads_raccordement l
    WHERE l.assigned_to_email = auth.jwt() ->> 'email';
  END IF;
END;
$function$;