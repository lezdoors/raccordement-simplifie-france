-- Disable trigger temporarily to insert admin user
SET session_replication_role = replica;

-- Add missing admin user to admin_users table
INSERT INTO admin_users (email, role, can_see_payments, can_manage_users, can_see_all_leads, is_active)
VALUES ('ryanaoufal@gmail.com', 'superadmin', true, true, true, true);

-- Re-enable trigger
SET session_replication_role = DEFAULT;