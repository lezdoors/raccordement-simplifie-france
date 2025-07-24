-- Fix remaining security warnings

-- 1. Fix function search path issues for remaining functions
CREATE OR REPLACE FUNCTION public.get_security_headers()
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN jsonb_build_object(
    'X-Content-Type-Options', 'nosniff',
    'X-Frame-Options', 'DENY',
    'X-XSS-Protection', '1; mode=block',
    'Referrer-Policy', 'strict-origin-when-cross-origin',
    'Content-Security-Policy', 'default-src ''self''; script-src ''self'' ''unsafe-inline''; style-src ''self'' ''unsafe-inline'';'
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_new_lead()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    res json;
BEGIN
    -- Send email notification for new leads
    PERFORM http_post(
        'https://api.resend.com/emails',
        json_build_object(
            'from', 'alert@racco-service.com',
            'to', 'contact@racco-service.com',
            'subject', '🆕 Nouvelle demande de raccordement reçue',
            'html', format(
                '<h2>🆕 Nouvelle demande reçue</h2>
                <p><strong>Nom:</strong> %s</p>
                <p><strong>Email:</strong> %s</p>
                <p><strong>Téléphone:</strong> %s</p>
                <p><strong>Adresse:</strong> %s</p>
                <p><strong>Code Postal:</strong> %s</p>
                <p><strong>Type de raccordement:</strong> %s</p>
                <p><strong>Puissance souhaitée:</strong> %s kW</p>
                <p><strong>Message:</strong> %s</p>
                <hr>
                <p><a href="https://racco-service.com/admin">Voir dans le CRM</a></p>',
                COALESCE(NEW.nom, 'Non renseigné'),
                COALESCE(NEW.email, 'Non renseigné'),
                COALESCE(NEW.telephone, 'Non renseigné'),
                COALESCE(NEW.adresse, 'Non renseignée'),
                COALESCE(NEW.code_postal, 'Non renseigné'),
                COALESCE(NEW.type_raccordement, 'Non renseigné'),
                COALESCE(NEW.puissance_souhaitee_kw, 'Non renseignée'),
                COALESCE(NEW.message, 'Aucun message')
            )
        )::text,
        json_build_object(
            'Authorization', 'Bearer YOUR_RESEND_API_KEY',
            'Content-Type', 'application/json'
        )::jsonb
    );
    
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_form_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Only notify for connection request forms
    IF NEW.form_type = 'connection_request' THEN
        PERFORM http_post(
            'https://api.resend.com/emails',
            json_build_object(
                'from', 'forms@racco-service.com',
                'to', 'contact@racco-service.com',
                'subject', '📝 Nouvelle soumission de formulaire',
                'html', format(
                    '<h2>📝 Nouvelle soumission de formulaire</h2>
                    <p><strong>Type:</strong> %s</p>
                    <p><strong>Données:</strong></p>
                    <pre>%s</pre>
                    <p><a href="https://racco-service.com/admin">Voir dans le CRM</a></p>',
                    NEW.form_type,
                    NEW.data::text
                )
            )::text,
            json_build_object(
                'Authorization', 'Bearer YOUR_RESEND_API_KEY',
                'Content-Type', 'application/json'
            )::jsonb
        );
    END IF;
    
    RETURN NEW;
END;
$function$;

-- 2. Add additional security constraints
-- Add constraint to ensure profiles table has proper user_id reference
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_not_null 
CHECK (id IS NOT NULL);

-- Add index for better performance on admin checks
CREATE INDEX IF NOT EXISTS idx_admin_users_email_active 
ON public.admin_users (email, is_active) 
WHERE is_active = true;

-- Add index for audit log queries
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_email_created 
ON public.admin_audit_log (admin_email, created_at DESC);

-- 3. Add table comments for documentation
COMMENT ON TABLE public.admin_audit_log IS 'Audit trail for all admin actions on sensitive data';
COMMENT ON TABLE public.rate_limits IS 'Rate limiting protection for API endpoints';
COMMENT ON CONSTRAINT valid_roles ON public.admin_users IS 'Ensures only valid admin roles are allowed';