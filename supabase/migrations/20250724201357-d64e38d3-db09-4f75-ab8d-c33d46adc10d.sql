-- Fix function search path security issue
CREATE OR REPLACE FUNCTION log_lead_activity()
RETURNS TRIGGER AS $$
BEGIN
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
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;