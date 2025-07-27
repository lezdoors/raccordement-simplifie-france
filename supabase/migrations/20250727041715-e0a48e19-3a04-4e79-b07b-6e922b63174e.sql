-- Add form_type field to leads_raccordement table to track submission types
ALTER TABLE public.leads_raccordement 
ADD COLUMN form_type TEXT NOT NULL DEFAULT 'full';

-- Add index for better performance when filtering by form_type
CREATE INDEX idx_leads_raccordement_form_type ON public.leads_raccordement(form_type);

-- Update existing records to have proper form_type
UPDATE public.leads_raccordement 
SET form_type = CASE 
  WHEN form_step = 1 THEN 'step1'
  ELSE 'full'
END;