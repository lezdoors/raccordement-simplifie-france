
-- Create lead_files table for tracking file attachments
CREATE TABLE IF NOT EXISTS public.lead_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads_raccordement(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by UUID,
  description TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create storage bucket for lead files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('lead-files', 'lead-files', false)
ON CONFLICT (id) DO NOTHING;

-- Add RLS policies for lead_files table
ALTER TABLE public.lead_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Superadmin full access to lead files" ON public.lead_files
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND role = 'superadmin' 
      AND is_active = true
    )
  );

CREATE POLICY "Assigned users can manage lead files" ON public.lead_files
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      JOIN leads_raccordement l ON l.assigned_to_email = au.email
      WHERE au.email = auth.jwt() ->> 'email' 
      AND au.is_active = true 
      AND l.id = lead_files.lead_id
    )
  );

-- Add RLS policies for storage bucket
CREATE POLICY "Superadmin can manage all lead files" ON storage.objects
  FOR ALL USING (
    bucket_id = 'lead-files' AND
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND role = 'superadmin' 
      AND is_active = true
    )
  );

CREATE POLICY "Assigned users can access lead files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'lead-files' AND
    EXISTS (
      SELECT 1 FROM admin_users au
      JOIN leads_raccordement l ON l.assigned_to_email = au.email
      JOIN lead_files lf ON lf.lead_id = l.id
      WHERE au.email = auth.jwt() ->> 'email' 
      AND au.is_active = true 
      AND lf.file_path = objects.name
    )
  );

CREATE POLICY "Assigned users can upload lead files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'lead-files' AND
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_active = true
    )
  );

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_lead_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_files_updated_at
  BEFORE UPDATE ON public.lead_files
  FOR EACH ROW EXECUTE FUNCTION update_lead_files_updated_at();
