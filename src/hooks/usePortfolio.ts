
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/components/auth/AuthProvider';

type Portfolio = Tables<'portfolios'>;
type PortfolioHolding = Tables<'portfolio_holdings'> & {
  stocks: Tables<'stocks'>;
};

export const useUserPortfolios = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['portfolios', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Portfolio[];
    },
    enabled: !!user,
  });
};

export const usePortfolioHoldings = (portfolioId: string) => {
  return useQuery({
    queryKey: ['portfolio-holdings', portfolioId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_holdings')
        .select(`
          *,
          stocks (*)
        `)
        .eq('portfolio_id', portfolioId);

      if (error) throw error;
      return data as PortfolioHolding[];
    },
    enabled: !!portfolioId,
  });
};

export const useAddHolding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      portfolioId,
      stockId,
      quantity,
      averagePrice,
    }: {
      portfolioId: string;
      stockId: string;
      quantity: number;
      averagePrice: number;
    }) => {
      // First, get current stock price to calculate current value
      const { data: stock } = await supabase
        .from('stocks')
        .select('current_price')
        .eq('id', stockId)
        .single();

      const currentValue = quantity * (stock?.current_price || averagePrice);
      const gainLoss = currentValue - (quantity * averagePrice);
      const gainLossPercent = ((gainLoss / (quantity * averagePrice)) * 100);

      const { data, error } = await supabase
        .from('portfolio_holdings')
        .insert({
          portfolio_id: portfolioId,
          stock_id: stockId,
          quantity,
          average_price: averagePrice,
          current_value: currentValue,
          gain_loss: gainLoss,
          gain_loss_percent: gainLossPercent,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-holdings', variables.portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};
