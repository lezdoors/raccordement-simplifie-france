-- Add missing assigned_to_email column to leads_raccordement table
ALTER TABLE public.leads_raccordement 
ADD COLUMN assigned_to_email TEXT;

-- Add an index for better performance when querying by assigned email
CREATE INDEX idx_leads_raccordement_assigned_to_email 
ON public.leads_raccordement(assigned_to_email);