-- Create admins table for whitelisted email addresses
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'admin',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT
);

-- Enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read admins (for verification)
CREATE POLICY "Allow authenticated users to read admins" 
ON admins 
FOR SELECT 
TO authenticated 
USING (true);

-- Insert initial admin emails
INSERT INTO public.admins (email, name, role, created_by) VALUES
('admin@raccordement.net', 'Administrator', 'super_admin', 'system'),
('ryan@raccordement.net', 'Ryan', 'admin', 'system'),
('hossam@raccordement.net', 'Hossam', 'admin', 'system'),
('oussama@raccordement.net', 'Oussama', 'admin', 'system'),
('farah@raccordement.net', 'Farah', 'admin', 'system'),
('rania@raccordement.net', 'Rania', 'admin', 'system'),
('contact@raccordement.net', 'Contact Admin', 'admin', 'system');

-- Create security function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin_email(email_to_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins 
    WHERE email = email_to_check AND active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;