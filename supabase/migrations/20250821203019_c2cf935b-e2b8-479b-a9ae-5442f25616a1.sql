
-- Create lead_notes table
CREATE TABLE public.lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads_raccordement(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for lead_notes
-- Superadmin can read/write all notes
CREATE POLICY "Superadmin full access to notes" ON public.lead_notes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (auth.jwt() ->> 'email') 
      AND role = 'superadmin' 
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (auth.jwt() ->> 'email') 
      AND role = 'superadmin' 
      AND is_active = true
    )
  );

-- Manager/Traiteur can read/write notes for leads assigned to them
CREATE POLICY "Assigned users can manage notes" ON public.lead_notes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      JOIN public.leads_raccordement l ON l.assigned_to_email = au.email
      WHERE au.email = (auth.jwt() ->> 'email') 
      AND au.is_active = true
      AND l.id = lead_notes.lead_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      JOIN public.leads_raccordement l ON l.assigned_to_email = au.email
      WHERE au.email = (auth.jwt() ->> 'email') 
      AND au.is_active = true
      AND l.id = lead_notes.lead_id
    )
  );

-- Traiteur cannot delete notes (only superadmin and manager can delete)
CREATE POLICY "Prevent traiteur from deleting notes" ON public.lead_notes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (auth.jwt() ->> 'email') 
      AND role IN ('superadmin', 'manager') 
      AND is_active = true
    )
  );

-- Create indexes for performance
CREATE INDEX idx_lead_notes_lead_id ON public.lead_notes(lead_id);
CREATE INDEX idx_lead_notes_created_at ON public.lead_notes(created_at DESC);
CREATE INDEX idx_lead_notes_pinned ON public.lead_notes(is_pinned, created_at DESC);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_lead_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_notes_updated_at
  BEFORE UPDATE ON public.lead_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lead_notes_updated_at();

-- Insert demo notes for testing
INSERT INTO public.lead_notes (lead_id, author_id, body, is_pinned) VALUES
(
  (SELECT id FROM public.leads_raccordement LIMIT 1),
  (SELECT id FROM auth.users LIMIT 1),
  'Premier contact avec le client. Documents de base reçus, en attente du plan de situation.',
  true
),
(
  (SELECT id FROM public.leads_raccordement LIMIT 1),
  (SELECT id FROM auth.users LIMIT 1),
  'Appel téléphonique effectué. Client souhaite accélérer la procédure pour une mise en service avant fin décembre.',
  false
);
