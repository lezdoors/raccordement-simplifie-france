-- Fix security definer view issue by updating leads_for_traiteur view
-- to use proper security definer functions instead of direct auth.jwt() calls

-- Drop the existing view
DROP VIEW IF EXISTS public.leads_for_traiteur;

-- Recreate the view using security definer functions
CREATE VIEW public.leads_for_traiteur AS
SELECT 
    id,
    email,
    created_at,
    updated_at,
    consent_accepted,
    form_step,
    assigned_to,
    priority,
    civilite,
    type_client,
    nom,
    prenom,
    telephone,
    code_postal,
    ville,
    raison_sociale,
    siren,
    type_raccordement,
    type_projet,
    type_alimentation,
    puissance,
    adresse_chantier,
    numero_pdl,
    etat_projet,
    delai_souhaite,
    type_facturation,
    commentaires,
    assigned_to_email,
    status,
    form_type,
    -- Use security definer function instead of direct auth.jwt() calls
    CASE
        WHEN (EXISTS ( 
            SELECT 1 FROM admin_users 
            WHERE email = (auth.jwt() ->> 'email'::text) 
            AND role = ANY (ARRAY['superadmin'::text, 'manager'::text]) 
            AND is_active = true
        )) THEN amount
        ELSE NULL::integer
    END AS amount,
    -- Use security definer function for payment_status
    CASE
        WHEN (EXISTS ( 
            SELECT 1 FROM admin_users 
            WHERE email = (auth.jwt() ->> 'email'::text) 
            AND role = ANY (ARRAY['superadmin'::text, 'manager'::text]) 
            AND is_active = true
        )) THEN payment_status
        ELSE NULL::text
    END AS payment_status,
    -- Use security definer function for stripe_session_id
    CASE
        WHEN (EXISTS ( 
            SELECT 1 FROM admin_users 
            WHERE email = (auth.jwt() ->> 'email'::text) 
            AND role = ANY (ARRAY['superadmin'::text, 'manager'::text]) 
            AND is_active = true
        )) THEN stripe_session_id
        ELSE NULL::text
    END AS stripe_session_id
FROM leads_raccordement;

-- Create a helper security definer function for manager/superadmin checks
CREATE OR REPLACE FUNCTION public.is_manager_or_superadmin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

-- Now recreate the view using the security definer function
DROP VIEW public.leads_for_traiteur;

CREATE VIEW public.leads_for_traiteur AS
SELECT 
    id,
    email,
    created_at,
    updated_at,
    consent_accepted,
    form_step,
    assigned_to,
    priority,
    civilite,
    type_client,
    nom,
    prenom,
    telephone,
    code_postal,
    ville,
    raison_sociale,
    siren,
    type_raccordement,
    type_projet,
    type_alimentation,
    puissance,
    adresse_chantier,
    numero_pdl,
    etat_projet,
    delai_souhaite,
    type_facturation,
    commentaires,
    assigned_to_email,
    status,
    form_type,
    -- Use security definer function instead of direct checks
    CASE
        WHEN is_manager_or_superadmin() THEN amount
        ELSE NULL::integer
    END AS amount,
    CASE
        WHEN is_manager_or_superadmin() THEN payment_status
        ELSE NULL::text
    END AS payment_status,
    CASE
        WHEN is_manager_or_superadmin() THEN stripe_session_id
        ELSE NULL::text
    END AS stripe_session_id
FROM leads_raccordement;