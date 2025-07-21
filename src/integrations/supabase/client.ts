import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kstugxtmghinprrpkrud.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzdHVneHRtZ2hpbnBycnBrcnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODM3NjQsImV4cCI6MjA2ODI1OTc2NH0.dJkngRbc-YtglsBZgZFBnlAQdUaX1G3lWwZjyeLivxc'

export const supabase = createClient(supabaseUrl, supabaseKey)