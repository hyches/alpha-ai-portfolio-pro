
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useRealTimeStocks = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('stocks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stocks'
        },
        (payload) => {
          console.log('Stock data updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['stocks'] });
          queryClient.invalidateQueries({ queryKey: ['stock-data'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};

export const useRealTimePortfolio = (portfolioId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!portfolioId) return;

    const channel = supabase
      .channel('portfolio-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolio_holdings'
        },
        (payload) => {
          console.log('Portfolio updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['portfolio-holdings', portfolioId] });
          queryClient.invalidateQueries({ queryKey: ['portfolio-analytics', portfolioId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [portfolioId, queryClient]);
};

export const useRealTimeAlerts = (userId: string) => {
  const [newAlerts, setNewAlerts] = useState<any[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('alerts-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_alerts',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Alert triggered:', payload);
          if (payload.new.triggered_at && !payload.old.triggered_at) {
            setNewAlerts(prev => [...prev, payload.new]);
          }
          queryClient.invalidateQueries({ queryKey: ['user-alerts', userId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  const clearNewAlerts = () => setNewAlerts([]);

  return { newAlerts, clearNewAlerts };
};
