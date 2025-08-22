
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMessageStats = () => {
  const [inboundMessageCount, setInboundMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchMessageStats = async () => {
    try {
      const { count, error } = await supabase
        .from('lead_emails_internal')
        .select('*', { count: 'exact', head: true })
        .eq('direction', 'inbound');

      if (error) throw error;
      setInboundMessageCount(count || 0);
    } catch (error) {
      console.error('Error fetching message stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessageStats();
  }, []);

  return {
    inboundMessageCount,
    loading,
    refetch: fetchMessageStats
  };
};
