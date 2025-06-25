
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Stock = Tables<'stocks'>;

export const useStocks = () => {
  return useQuery({
    queryKey: ['stocks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stocks')
        .select('*')
        .order('market_cap', { ascending: false });

      if (error) throw error;
      return data as Stock[];
    },
  });
};

export const useStock = (symbol: string) => {
  return useQuery({
    queryKey: ['stock', symbol],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stocks')
        .select('*')
        .eq('symbol', symbol)
        .single();

      if (error) throw error;
      return data as Stock;
    },
    enabled: !!symbol,
  });
};
