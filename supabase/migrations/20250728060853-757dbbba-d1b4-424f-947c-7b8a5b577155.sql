-- Fix the lead activity audit trigger to handle cases where admin_email is null
CREATE OR REPLACE FUNCTION public.log_lead_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Only log if there's an admin email to associate the action with
    -- For user-submitted leads, we don't need to log to admin audit
    IF COALESCE(NEW.assigned_to_email, OLD.assigned_to_email) IS NOT NULL THEN
        INSERT INTO admin_audit_log (
            admin_email,
            action,
            resource,
            resource_id,
            old_values,
            new_values,
            details,
            created_at
        ) VALUES (
            COALESCE(NEW.assigned_to_email, OLD.assigned_to_email),
            TG_OP,
            'leads_raccordement',
            COALESCE(NEW.id, OLD.id),
            CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
            CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
            jsonb_build_object(
                'trigger', 'lead_audit',
                'timestamp', NOW()
            ),
            NOW()
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$function$;