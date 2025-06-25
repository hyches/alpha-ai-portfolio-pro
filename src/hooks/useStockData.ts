
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useStockData = (symbol?: string) => {
  return useQuery({
    queryKey: ['stock-data', symbol],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('stock-data', {
        body: symbol ? { symbol } : {}
      });

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useAIAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ stockSymbol, analysisType, userId }: {
      stockSymbol: string;
      analysisType: string;
      userId: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('ai-analysis', {
        body: { stockSymbol, analysisType, userId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research_reports'] });
    },
  });
};

export const usePortfolioAnalytics = (portfolioId: string, userId: string) => {
  return useQuery({
    queryKey: ['portfolio-analytics', portfolioId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('portfolio-analytics', {
        body: { portfolioId, userId }
      });

      if (error) throw error;
      return data;
    },
    enabled: !!portfolioId,
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useMarketNews = () => {
  return useQuery({
    queryKey: ['market-news'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('market-news', {
        body: { action: 'fetch' }
      });

      if (error) throw error;
      return data;
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });
};

export const useTradingSignals = (stockSymbol?: string) => {
  return useQuery({
    queryKey: ['trading-signals', stockSymbol],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('trading-signals', {
        body: { stockSymbol }
      });

      if (error) throw error;
      return data;
    },
    refetchInterval: 120000, // Refresh every 2 minutes
  });
};

export const useAlertsMonitor = () => {
  const queryClient = useQueryClient();

  return {
    createAlert: useMutation({
      mutationFn: async (alertData: {
        userId: string;
        stockId: string;
        alertType: string;
        conditionValue: number;
        conditionOperator: string;
      }) => {
        const { data, error } = await supabase.functions.invoke('alerts-monitor', {
          body: { action: 'create', ...alertData }
        });

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user-alerts'] });
      },
    }),

    checkAlerts: useMutation({
      mutationFn: async () => {
        const { data, error } = await supabase.functions.invoke('alerts-monitor', {
          body: { action: 'check' }
        });

        if (error) throw error;
        return data;
      },
    }),

    getUserAlerts: (userId: string) => useQuery({
      queryKey: ['user-alerts', userId],
      queryFn: async () => {
        const { data, error } = await supabase.functions.invoke('alerts-monitor', {
          body: { userId }
        });

        if (error) throw error;
        return data;
      },
      enabled: !!userId,
    }),
  };
};
