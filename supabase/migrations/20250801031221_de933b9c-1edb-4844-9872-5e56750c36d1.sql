-- Fix security issues for database functions
-- Ensure all functions have proper search_path settings

-- Update any functions that might be missing search_path
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

-- Update notify_new_lead function to have proper search_path
CREATE OR REPLACE FUNCTION public.notify_new_lead()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- This will trigger when new lead is inserted
    -- Can integrate with email service to send alerts to bonjour@raccordement-elec.fr
    PERFORM pg_notify('new_lead', json_build_object(
        'lead_id', NEW.id,
        'name', NEW.nom,
        'email', NEW.email,
        'phone', NEW.telephone
    )::text);
    RETURN NEW;
END;
$function$;