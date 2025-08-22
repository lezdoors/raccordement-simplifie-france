-- Fix security definer view issue by removing the view and implementing 
-- proper RLS policies instead

-- Drop the problematic view
DROP VIEW IF EXISTS public.leads_for_traiteur;

-- Create a new RLS policy for traiteur users to access their assigned leads
-- This replaces the view functionality with secure table-level policies
CREATE POLICY "Traiteur users can view assigned leads with limited fields"
ON public.leads_raccordement
FOR SELECT
USING (
  -- Traiteur users can only see leads assigned to them
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = auth.jwt() ->> 'email'
    AND au.role = 'traiteur'
    AND au.is_active = true
    AND leads_raccordement.assigned_to_email = au.email
  )
);

-- Create a function to get leads for traiteurs with sensitive data filtered
CREATE OR REPLACE FUNCTION public.get_leads_for_traiteur()
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  updated_at timestamptz,
  consent_accepted boolean,
  form_step integer,
  assigned_to uuid,
  priority integer,
  civilite text,
  type_client text,
  nom text,
  prenom text,
  telephone text,
  code_postal text,
  ville text,
  raison_sociale text,
  siren text,
  type_raccordement text,
  type_projet text,
  type_alimentation text,
  puissance text,
  adresse_chantier text,
  numero_pdl text,
  etat_projet text,
  delai_souhaite text,
  type_facturation text,
  commentaires text,
  assigned_to_email text,
  status varchar,
  form_type text,
  amount integer,
  payment_status text,
  stripe_session_id text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
    -- For traiteur users, return with sensitive fields as null
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
$$;