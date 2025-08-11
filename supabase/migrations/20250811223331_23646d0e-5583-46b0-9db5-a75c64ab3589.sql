-- Tighten data access based on security findings

-- 1) Ensure RLS is enabled on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 2) Replace permissive SELECT policy on messages with admin-only
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'messages' AND policyname = 'Allow authenticated users to read messages'
  ) THEN
    DROP POLICY "Allow authenticated users to read messages" ON public.messages;
  END IF;
END$$;

CREATE POLICY "Only admins can read messages"
ON public.messages
FOR SELECT
TO authenticated
USING (is_current_user_admin());

-- 3) Keep anonymous INSERT for messages (contact form submissions)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'messages' AND policyname = 'Allow anonymous message submissions'
  ) THEN
    CREATE POLICY "Allow anonymous message submissions"
    ON public.messages
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
  END IF;
END$$;

-- 4) Optional: service role can fully manage messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'messages' AND policyname = 'Service role can manage messages'
  ) THEN
    CREATE POLICY "Service role can manage messages"
    ON public.messages
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  END IF;
END$$;

-- Note on leads_raccordement: existing policies already restrict SELECT to admins and assigned users.
-- No changes applied to avoid disrupting anonymous lead submissions (INSERT only).