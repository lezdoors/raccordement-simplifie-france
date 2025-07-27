-- Fix function search path security warnings

-- Update all functions to use secure search_path
CREATE OR REPLACE FUNCTION public.audit_sensitive_operations()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier text,
  p_action text,
  p_max_requests integer DEFAULT 10,
  p_window_minutes integer DEFAULT 60
) RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.is_session_valid()
RETURNS boolean 
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.is_admin_email(email_to_check text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = email_to_check AND is_active = true
  );
END;
$$;