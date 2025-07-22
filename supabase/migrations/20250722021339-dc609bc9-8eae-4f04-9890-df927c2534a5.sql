-- Enable RLS on demandes table and create proper policies
ALTER TABLE public.demandes ENABLE ROW LEVEL SECURITY;

-- Create insert policy for demandes (allow anonymous submissions)
CREATE POLICY "Allow anonymous demandes insertion" ON public.demandes
  FOR INSERT 
  WITH CHECK (true);

-- Update form_submissions policies to be more restrictive
-- Drop existing policies first
DROP POLICY IF EXISTS "Allow form submission updates" ON public.form_submissions;
DROP POLICY IF EXISTS "Allow form submissions" ON public.form_submissions;

-- Create more secure policies for form_submissions
-- Allow inserts from anyone (for the contact form)
CREATE POLICY "form_submissions_insert_policy" ON public.form_submissions
  FOR INSERT 
  WITH CHECK (true);

-- Allow updates only by service role (for payment processing)
CREATE POLICY "form_submissions_update_service_only" ON public.form_submissions
  FOR UPDATE
  USING (false); -- No one can update via client

-- Update payments policies to be more restrictive
DROP POLICY IF EXISTS "Allow payment inserts" ON public.payments;
DROP POLICY IF EXISTS "Allow payment status updates" ON public.payments;

-- Create more secure payment policies
CREATE POLICY "payments_insert_service_only" ON public.payments
  FOR INSERT 
  WITH CHECK (false); -- Only service role can insert

CREATE POLICY "payments_update_service_only" ON public.payments
  FOR UPDATE
  USING (false); -- Only service role can update

-- Add IP address and user agent tracking for security
ALTER TABLE public.form_submissions 
ADD COLUMN IF NOT EXISTS created_ip inet,
ADD COLUMN IF NOT EXISTS user_agent text;