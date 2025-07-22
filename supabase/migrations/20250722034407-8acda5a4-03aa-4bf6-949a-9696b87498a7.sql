-- Update RLS policies to allow authenticated users to read data for admin dashboard

-- Allow authenticated users to select from form_submissions
CREATE POLICY "Allow authenticated users to read form_submissions" 
ON form_submissions 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users to select from messages
CREATE POLICY "Allow authenticated users to read messages" 
ON messages 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users to select from payments
CREATE POLICY "Allow authenticated users to read payments" 
ON payments 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users to select from lead_tracking
CREATE POLICY "Allow authenticated users to read lead_tracking" 
ON lead_tracking 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users to select from demandes
CREATE POLICY "Allow authenticated users to read demandes" 
ON demandes 
FOR SELECT 
TO authenticated 
USING (true);