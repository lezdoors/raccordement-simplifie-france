-- Security fixes for database access and RLS policies

-- 1. Fix admin_users table security
DROP POLICY IF EXISTS "Allow authenticated users to read admin_users for verification" ON public.admin_users;
CREATE POLICY "Allow service role and specific admin queries only" 
ON public.admin_users 
FOR SELECT 
USING (
  -- Only allow reading for admin verification context
  current_setting('role') = 'service_role' OR
  email = auth.jwt() ->> 'email'
);

-- 2. Strengthen leads_raccordement policies
DROP POLICY IF EXISTS "Allow all authenticated users to read leads" ON public.leads_raccordement;
DROP POLICY IF EXISTS "Allow authenticated users to read leads" ON public.leads_raccordement;
DROP POLICY IF EXISTS "authenticated_users_all_access" ON public.leads_raccordement;

-- More restrictive lead access policies
CREATE POLICY "Admins can view all leads" 
ON public.leads_raccordement 
FOR SELECT 
USING (is_current_user_admin());

CREATE POLICY "Assigned users can view their leads" 
ON public.leads_raccordement 
FOR SELECT 
USING (assigned_to_email = auth.jwt() ->> 'email');

CREATE POLICY "Admins can update leads" 
ON public.leads_raccordement 
FOR UPDATE 
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

CREATE POLICY "Admins can delete leads" 
ON public.leads_raccordement 
FOR DELETE 
USING (is_current_user_admin());

-- 3. Strengthen payments table security
DROP POLICY IF EXISTS "Allow authenticated users to read payments" ON public.payments;

CREATE POLICY "Only admins with payment permission can view payments" 
ON public.payments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.jwt() ->> 'email' 
    AND is_active = true 
    AND can_see_payments = true
  )
);

-- 4. Add audit logging for sensitive operations
CREATE OR REPLACE FUNCTION public.audit_sensitive_operations()
RETURNS TRIGGER AS $$
BEGIN
  -- Log all admin operations
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
      auth.jwt() ->> 'email',
      TG_OP,
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
      CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
      jsonb_build_object(
        'timestamp', NOW(),
        'user_agent', current_setting('request.headers', true)::jsonb ->> 'user-agent'
      ),
      NOW()
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for audit logging
DROP TRIGGER IF EXISTS audit_admin_users ON public.admin_users;
CREATE TRIGGER audit_admin_users
  AFTER INSERT OR UPDATE OR DELETE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_operations();

DROP TRIGGER IF EXISTS audit_leads ON public.leads_raccordement;
CREATE TRIGGER audit_leads
  AFTER INSERT OR UPDATE OR DELETE ON public.leads_raccordement
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_operations();

DROP TRIGGER IF EXISTS audit_payments ON public.payments;
CREATE TRIGGER audit_payments
  AFTER INSERT OR UPDATE OR DELETE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.audit_sensitive_operations();

-- 5. Add rate limiting for form submissions
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- IP address or user email
  action text NOT NULL, -- 'form_submission', 'login_attempt', etc.
  count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT NOW(),
  created_at timestamp with time zone NOT NULL DEFAULT NOW()
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages rate limits" 
ON public.rate_limits 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Function to check rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier text,
  p_action text,
  p_max_requests integer DEFAULT 10,
  p_window_minutes integer DEFAULT 60
) RETURNS boolean AS $$
DECLARE
  current_count integer;
  window_start timestamp with time zone;
BEGIN
  window_start := NOW() - (p_window_minutes || ' minutes')::interval;
  
  -- Clean old entries
  DELETE FROM public.rate_limits 
  WHERE window_start < (NOW() - (p_window_minutes || ' minutes')::interval);
  
  -- Get current count
  SELECT COALESCE(SUM(count), 0) INTO current_count
  FROM public.rate_limits
  WHERE identifier = p_identifier
    AND action = p_action
    AND window_start >= window_start;
  
  -- Check if limit exceeded
  IF current_count >= p_max_requests THEN
    RETURN false;
  END IF;
  
  -- Increment counter
  INSERT INTO public.rate_limits (identifier, action, count, window_start)
  VALUES (p_identifier, p_action, 1, NOW())
  ON CONFLICT (identifier, action) 
  DO UPDATE SET 
    count = rate_limits.count + 1,
    window_start = CASE 
      WHEN rate_limits.window_start < window_start THEN NOW()
      ELSE rate_limits.window_start
    END;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Add input validation constraints
ALTER TABLE public.leads_raccordement 
ADD CONSTRAINT valid_email_format CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
ADD CONSTRAINT valid_phone_format CHECK (telephone ~* '^[+]?[0-9\s\-\(\)\.]{10,}$'),
ADD CONSTRAINT reasonable_name_length CHECK (char_length(nom) <= 100 AND char_length(prenom) <= 100),
ADD CONSTRAINT reasonable_comment_length CHECK (char_length(commentaires) <= 2000);

ALTER TABLE public.messages
ADD CONSTRAINT valid_message_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
ADD CONSTRAINT reasonable_message_length CHECK (char_length(message) <= 5000),
ADD CONSTRAINT reasonable_name_length CHECK (char_length(name) <= 100);

-- 7. Secure session management
CREATE OR REPLACE FUNCTION public.is_session_valid()
RETURNS boolean AS $$
BEGIN
  -- Check if the JWT is not expired and user is active
  RETURN (
    auth.jwt() ->> 'exp' IS NOT NULL AND
    (auth.jwt() ->> 'exp')::bigint > EXTRACT(epoch FROM NOW()) AND
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_active = true
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Update admin policies to use session validation
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN (
    is_session_valid() AND
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.jwt() ->> 'email' AND is_active = true
    )
  );
END;
$$;