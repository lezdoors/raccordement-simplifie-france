-- Nettoyage des tables redondantes pour optimiser le CRM

-- 1. Supprimer la table 'admins' redondante (on garde admin_users)
DROP TABLE IF EXISTS public.admins CASCADE;

-- 2. Supprimer les tables de leads redondantes (on garde leads_raccordement)
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.demandes CASCADE;
DROP TABLE IF EXISTS public.connection_requests CASCADE;
DROP TABLE IF EXISTS public.form_submissions CASCADE;

-- 3. Supprimer les autres tables inutilisées
DROP TABLE IF EXISTS public.form_logs CASCADE;
DROP TABLE IF EXISTS public.lead_tracking CASCADE;
DROP TABLE IF EXISTS public.rate_limits CASCADE;

-- 4. Optimiser la table admin_users avec un index sur email
CREATE INDEX IF NOT EXISTS idx_admin_users_email_active ON public.admin_users(email) WHERE is_active = true;

-- 5. Optimiser la table leads_raccordement 
CREATE INDEX IF NOT EXISTS idx_leads_raccordement_assigned ON public.leads_raccordement(assigned_to_email);
CREATE INDEX IF NOT EXISTS idx_leads_raccordement_status ON public.leads_raccordement(status);
CREATE INDEX IF NOT EXISTS idx_leads_raccordement_created ON public.leads_raccordement(created_at DESC);

-- 6. Nettoyer les politiques RLS orphelines et optimiser
-- Supprimer les politiques qui référencent des tables supprimées
DO $$ 
BEGIN
    -- Les politiques seront automatiquement supprimées avec les tables
    NULL;
END $$;