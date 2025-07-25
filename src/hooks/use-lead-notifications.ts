import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useLeadNotifications = () => {
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  useEffect(() => {
    // Subscribe to new leads
    const channel = supabase
      .channel('new-leads')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads_raccordement'
        },
        (payload) => {
          console.log('New lead received:', payload);
          setNewLeadsCount(prev => prev + 1);
          
          toast.success(
            `Nouveau lead reçu de ${payload.new.prenom} ${payload.new.nom}`,
            {
              description: `Email: ${payload.new.email}`,
              duration: 5000,
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const clearNotifications = () => {
    setNewLeadsCount(0);
  };

  return {
    newLeadsCount,
    clearNotifications
  };
};