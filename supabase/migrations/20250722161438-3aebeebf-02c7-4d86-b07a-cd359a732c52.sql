-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users table
CREATE POLICY "Allow authenticated users to read admin_users for verification" 
ON public.admin_users 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow service role to manage admin users
CREATE POLICY "Service role can manage admin_users" 
ON public.admin_users 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Enable RLS on leads_raccordement table
ALTER TABLE public.leads_raccordement ENABLE ROW LEVEL SECURITY;

-- Create policies for leads_raccordement table
CREATE POLICY "Allow anonymous lead submission" 
ON public.leads_raccordement 
FOR INSERT 
WITH CHECK (true);

-- Allow authenticated users to read leads
CREATE POLICY "Allow authenticated users to read leads" 
ON public.leads_raccordement 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow service role to manage leads
CREATE POLICY "Service role can manage leads" 
ON public.leads_raccordement 
FOR ALL 
USING (true) 
WITH CHECK (true);