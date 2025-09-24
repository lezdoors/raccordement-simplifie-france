import { useState, useEffect } from 'react';

export interface MessageStats {
  totalMessages: number;
  unreadMessages: number;
  todayMessages: number;
  weekMessages: number;
  inboundMessageCount: number;
}

export const useMessageStats = () => {
  const [stats, setStats] = useState<MessageStats>({
    totalMessages: 0,
    unreadMessages: 0,
    todayMessages: 0,
    weekMessages: 0,
    inboundMessageCount: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    console.log('Message stats disabled - schema not ready');
    setStats({
      totalMessages: 0,
      unreadMessages: 0,
      todayMessages: 0,
      weekMessages: 0,
      inboundMessageCount: 0
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    refetch: fetchStats
  };
};