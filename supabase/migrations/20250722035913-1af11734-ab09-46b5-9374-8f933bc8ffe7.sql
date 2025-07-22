-- Create notifications table for storing admin notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'new_submission', 'new_message', 'new_payment'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  email_sent BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read notifications
CREATE POLICY "Allow authenticated users to read notifications" 
ON notifications 
FOR ALL
TO authenticated 
USING (true);

-- Add status and notes columns to form_submissions
ALTER TABLE form_submissions 
ADD COLUMN IF NOT EXISTS form_status_detailed TEXT DEFAULT 'Nouveau',
ADD COLUMN IF NOT EXISTS payment_status_detailed TEXT DEFAULT 'En attente',
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS assigned_to TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(form_status_detailed);
CREATE INDEX IF NOT EXISTS idx_form_submissions_payment_status ON form_submissions(payment_status_detailed);