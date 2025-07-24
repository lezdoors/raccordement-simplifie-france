-- Fix 1: Verify and standardize the lead tables
-- Check current data distribution
SELECT 'leads_raccordement' as table_name, COUNT(*) as lead_count FROM leads_raccordement
UNION ALL
SELECT 'connection_requests' as table_name, COUNT(*) as lead_count FROM connection_requests
UNION ALL  
SELECT 'form_submissions' as table_name, COUNT(*) as lead_count FROM form_submissions;

-- Fix 2: Ensure admin table has required columns for CRM
ALTER TABLE admins ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Fix 3: Add foreign key relationships for lead assignment
ALTER TABLE leads_raccordement 
ADD COLUMN IF NOT EXISTS assigned_to_email TEXT;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads_raccordement(assigned_to_email);

-- Fix 4: Create missing CRM tables for better lead management
CREATE TABLE IF NOT EXISTS lead_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads_raccordement(id) ON DELETE CASCADE,
    admin_email TEXT REFERENCES admin_users(email),
    note TEXT NOT NULL,
    note_type VARCHAR(50) CHECK (note_type IN ('note', 'email', 'call', 'meeting', 'status_change')) DEFAULT 'note',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead status history for tracking changes
CREATE TABLE IF NOT EXISTS lead_status_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads_raccordement(id) ON DELETE CASCADE,
    admin_email TEXT REFERENCES admin_users(email),
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_admin ON lead_notes(admin_email);
CREATE INDEX IF NOT EXISTS idx_lead_status_history_lead_id ON lead_status_history(lead_id);

-- Fix 5: Ensure admin_audit_log table has proper structure
ALTER TABLE admin_audit_log ADD COLUMN IF NOT EXISTS admin_email TEXT;
ALTER TABLE admin_audit_log ADD COLUMN IF NOT EXISTS resource_type TEXT;
ALTER TABLE admin_audit_log ADD COLUMN IF NOT EXISTS old_values JSONB;
ALTER TABLE admin_audit_log ADD COLUMN IF NOT EXISTS new_values JSONB;

-- Fix 6: Create audit logging function
CREATE OR REPLACE FUNCTION log_lead_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin_audit_log (
        admin_email,
        action,
        resource,
        resource_id,
        old_values,
        new_values,
        details,
        created_at
    ) VALUES (
        COALESCE(NEW.assigned_to_email, OLD.assigned_to_email),
        TG_OP,
        'leads_raccordement',
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
        jsonb_build_object(
            'trigger', 'lead_audit',
            'timestamp', NOW()
        ),
        NOW()
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Add trigger for audit logging on leads
DROP TRIGGER IF EXISTS audit_leads_changes ON leads_raccordement;
CREATE TRIGGER audit_leads_changes
    AFTER INSERT OR UPDATE OR DELETE ON leads_raccordement
    FOR EACH ROW EXECUTE FUNCTION log_lead_activity();

-- Fix 7: Assign unassigned leads to main admin
UPDATE leads_raccordement 
SET assigned_to_email = 'ryanaoufal@gmail.com'
WHERE assigned_to_email IS NULL OR assigned_to_email = '';

-- Fix 8: Add RLS policies for new tables
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_status_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for lead_notes
CREATE POLICY "Admins can manage lead notes" ON lead_notes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_active = true
    )
  );

-- RLS policies for lead_status_history  
CREATE POLICY "Admins can view lead status history" ON lead_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_active = true
    )
  );