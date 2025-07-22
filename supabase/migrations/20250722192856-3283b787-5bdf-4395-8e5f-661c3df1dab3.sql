-- Add Stripe-related columns to form_submissions table if they don't exist
ALTER TABLE public.form_submissions 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_form_submissions_stripe_session 
ON public.form_submissions(stripe_session_id);

-- Update the status column to include payment statuses
-- No action needed as the status column already exists