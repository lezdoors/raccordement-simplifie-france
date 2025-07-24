-- =============================================
-- FIX DATABASE STRUCTURE ISSUES
-- Add missing columns and fix errors
-- =============================================

-- Step 1: Check current structure of leads_raccordement table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'leads_raccordement' 
ORDER BY ordinal_position;

-- Step 2: Add missing columns to leads_raccordement table
ALTER TABLE leads_raccordement 
ADD COLUMN IF NOT EXISTS assigned_to UUID;

ALTER TABLE leads_raccordement 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'nouveau';

ALTER TABLE leads_raccordement 
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 3;

-- Step 3: Check current structure of admins table  
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'admins' 
ORDER BY ordinal_position;

-- Step 4: Add missing columns to admins table
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Step 5: Create foreign key relationship (if not exists)
DO $$ 
BEGIN
    -- Add foreign key constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'leads_raccordement_assigned_to_fkey'
    ) THEN
        ALTER TABLE leads_raccordement 
        ADD CONSTRAINT leads_raccordement_assigned_to_fkey 
        FOREIGN KEY (assigned_to) REFERENCES admins(id);
    END IF;
END $$;

-- Step 6: Update your admin user
UPDATE admins 
SET 
    role = 'superadmin',
    is_active = true,
    phone = '+33123456789'
WHERE email = 'ryanaoufal@gmail.com';

-- Step 7: Fix RLS policies (simplified)
DROP POLICY IF EXISTS "Admins can view all data" ON leads_raccordement;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON leads_raccordement;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON leads_raccordement;

-- Create simple policy for authenticated users
CREATE POLICY "authenticated_users_all_access" ON leads_raccordement
    FOR ALL USING (auth.role() = 'authenticated');

-- Same for admins table
DROP POLICY IF EXISTS "Enable admin access" ON admins;
CREATE POLICY "authenticated_admin_access" ON admins
    FOR ALL USING (auth.role() = 'authenticated');

-- Step 8: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads_raccordement(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads_raccordement(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads_raccordement(created_at);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- Step 9: Test data access
SELECT 
    'leads_raccordement' as table_name,
    COUNT(*) as record_count
FROM leads_raccordement
UNION ALL
SELECT 
    'admins' as table_name,
    COUNT(*) as record_count
FROM admins;

-- Step 10: Show sample data to verify structure
SELECT 
    id,
    nom,
    email,
    telephone,
    assigned_to,
    status,
    created_at
FROM leads_raccordement 
ORDER BY created_at DESC 
LIMIT 3;

-- Step 11: Verify admin user
SELECT 
    id,
    email,
    name,
    role,
    is_active,
    CASE WHEN password_hash IS NOT NULL THEN 'Password Set' ELSE 'No Password' END as password_status
FROM admins 
WHERE email = 'ryanaoufal@gmail.com';