-- Fix function search path security vulnerability
-- Update the existing function to be secure
CREATE OR REPLACE FUNCTION public.is_admin_email(email_to_check text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins 
    WHERE email = email_to_check AND active = true
  );
END;
$function$;

-- Create a security definer function to check current user admin status
-- This prevents RLS recursion issues
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Get the current user's email
  RETURN EXISTS (
    SELECT 1 FROM public.admins 
    WHERE email = auth.jwt() ->> 'email' AND active = true
  );
END;
$function$;

-- Improve admin table RLS policies for better security
-- Drop existing policies first
DROP POLICY IF EXISTS "Allow authenticated users to read admins" ON public.admins;

-- Create more restrictive policies
CREATE POLICY "Admins can read all admin records" 
ON public.admins 
FOR SELECT 
TO authenticated
USING (public.is_current_user_admin());

-- Only allow service role to modify admin records
CREATE POLICY "Service role can manage admins" 
ON public.admins 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Improve notifications table security - only admins should access
DROP POLICY IF EXISTS "Allow authenticated users to read notifications" ON public.notifications;

CREATE POLICY "Admins can access notifications" 
ON public.notifications 
FOR ALL 
TO authenticated
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

-- Add audit trail for admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email text NOT NULL,
  action text NOT NULL,
  resource text NOT NULL,
  resource_id uuid,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Admins can read audit logs" 
ON public.admin_audit_log 
FOR SELECT 
TO authenticated
USING (public.is_current_user_admin());

-- Service role can insert audit entries
CREATE POLICY "Service role can insert audit logs" 
ON public.admin_audit_log 
FOR INSERT 
TO service_role
WITH CHECK (true);

-- Add security headers function for edge functions
CREATE OR REPLACE FUNCTION public.get_security_headers()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
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