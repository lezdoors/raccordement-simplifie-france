import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kstugxtmghinprrpkrud.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzdHVneHRtZ2hpbnBycnBrcnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODM3NjQsImV4cCI6MjA2ODI1OTc2NH0.dJkngRbc-YtglsBZgZFBnlAQdUaX1G3lWwZjyeLivxc'

// Enhanced client with error logging
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Log connection status for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth state change:', event, session?.user?.email || 'No session');
});

// Test connection function for debugging
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('admins').select('count').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    console.log('Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
};