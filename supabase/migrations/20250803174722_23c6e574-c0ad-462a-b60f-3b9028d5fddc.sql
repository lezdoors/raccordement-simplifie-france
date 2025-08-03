-- Task 1: Clean up invalid users (already completed above, but ensuring it worked)
-- Task 2: Ethan's permissions updated (already completed above)

-- Task 3: Enable Supabase Realtime for tables (skip leads_raccordement as it's already added)
-- Enable replica identity for real-time updates
ALTER TABLE public.admin_users REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add remaining tables to realtime publication
DO $$ 
BEGIN
    -- Try to add admin_users, ignore if already exists
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_users;
    EXCEPTION WHEN duplicate_object THEN
        NULL; -- Do nothing if already exists
    END;
    
    -- Try to add messages, ignore if already exists
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
    EXCEPTION WHEN duplicate_object THEN
        NULL; -- Do nothing if already exists
    END;
END $$;