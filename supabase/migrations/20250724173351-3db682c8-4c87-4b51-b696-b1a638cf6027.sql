-- CRITICAL SECURITY FIXES MIGRATION

-- 1. Enable RLS on unprotected tables
ALTER TABLE public.form_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create secure RLS policies for form_logs
CREATE POLICY "Service role can manage form_logs"
ON public.form_logs
FOR ALL
USING (false)
WITH CHECK (false);

-- Only allow insertions from the application
CREATE POLICY "Allow form log insertions"
ON public.form_logs
FOR INSERT
WITH CHECK (true);

-- Admin users can read form logs
CREATE POLICY "Admins can read form_logs"
ON public.form_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = auth.jwt() ->> 'email' 
    AND is_active = true
  )
);

-- 3. Create secure RLS policies for leads
CREATE POLICY "Admins can manage leads"
ON public.leads
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = auth.jwt() ->> 'email' 
    AND is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = auth.jwt() ->> 'email' 
    AND is_active = true
  )
);

-- Allow anonymous lead creation
CREATE POLICY "Allow anonymous lead creation"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- 4. Create secure RLS policies for profiles
CREATE POLICY "Users can manage their own profile"
ON public.profiles
FOR ALL
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can read all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = auth.jwt() ->> 'email' 
    AND is_active = true
  )
);

-- 5. Fix database function security - Update existing functions with proper search_path
CREATE OR REPLACE FUNCTION public.is_admin_email(email_to_check text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = email_to_check AND is_active = true
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = auth.jwt() ->> 'email' AND is_active = true
  );
END;
$function$;

-- 6. Improve admin_users table security - make role validation stricter
ALTER TABLE public.admin_users 
ADD CONSTRAINT valid_roles 
CHECK (role IN ('superadmin', 'manager', 'traiteur'));

-- 7. Add audit logging for admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.admin_audit_log (
    admin_email,
    action,
    resource,
    resource_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    auth.jwt() ->> 'email',
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    ),
    inet_client_addr(),
    current_setting('request.headers', true)::jsonb ->> 'user-agent'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- 8. Add audit triggers for sensitive tables
CREATE TRIGGER audit_admin_users
  AFTER INSERT OR UPDATE OR DELETE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_action();

CREATE TRIGGER audit_form_submissions
  AFTER UPDATE OR DELETE ON public.form_submissions
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_action();

-- 9. Strengthen form_submissions policies - remove overly permissive policies
DROP POLICY IF EXISTS "form_submissions_update_service_only" ON public.form_submissions;

CREATE POLICY "Only service role can update form_submissions"
ON public.form_submissions
FOR UPDATE
USING (false)
WITH CHECK (false);

-- 10. Add rate limiting table for API protection
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- IP address or user ID
  endpoint text NOT NULL,
  requests_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Service role only can manage rate limits
CREATE POLICY "Service role manages rate limits"
ON public.rate_limits
FOR ALL
USING (false)
WITH CHECK (false);