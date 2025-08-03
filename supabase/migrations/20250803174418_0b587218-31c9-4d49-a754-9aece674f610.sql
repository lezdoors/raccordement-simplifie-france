-- Update the audit function to handle null admin_email during system operations
CREATE OR REPLACE FUNCTION public.audit_sensitive_operations()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Log all admin operations, but handle cases where auth.jwt() is null
  IF TG_TABLE_NAME IN ('admin_users', 'leads_raccordement', 'payments') THEN
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
      COALESCE(auth.jwt() ->> 'email', 'system'),  -- Use 'system' when JWT is null
      TG_OP,
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
      CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
      jsonb_build_object(
        'timestamp', NOW(),
        'user_agent', current_setting('request.headers', true)::jsonb ->> 'user-agent',
        'context', CASE WHEN auth.jwt() ->> 'email' IS NULL THEN 'system_operation' ELSE 'user_operation' END
      ),
      NOW()
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Now add the admin users
INSERT INTO public.admin_users (
  email,
  role,
  can_see_payments,
  can_manage_users,
  can_see_all_leads,
  can_export_data,
  is_active,
  department
) VALUES (
  'ethan@portailmail.com',
  'manager',
  true,
  false,
  true,
  true,
  true,
  'Management'
),
(
  'amelie@portailmail.com',
  'traiteur',
  false,
  false,
  false,
  false,
  true,
  'Traitement'
);