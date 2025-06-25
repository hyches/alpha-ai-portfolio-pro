
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { portfolioId, userId } = await req.json();

    // Get portfolio holdings with stock data
    const { data: holdings, error: holdingsError } = await supabase
      .from('portfolio_holdings')
      .select(`
        *,
        stocks (*)
      `)
      .eq('portfolio_id', portfolioId);

    if (holdingsError) throw holdingsError;

    // Calculate portfolio analytics
    let totalValue = 0;
    let totalCost = 0;
    let totalGainLoss = 0;
    const holdingsAnalytics = [];

    for (const holding of holdings || []) {
      const currentValue = holding.quantity * (holding.stocks.current_price || 0);
      const costBasis = holding.quantity * holding.average_price;
      const gainLoss = currentValue - costBasis;
      const gainLossPercent = costBasis !== 0 ? (gainLoss / costBasis) * 100 : 0;

      // Update holding with calculated values
      await supabase
        .from('portfolio_holdings')
        .update({
          current_value: currentValue,
          gain_loss: gainLoss,
          gain_loss_percent: gainLossPercent
        })
        .eq('id', holding.id);

      totalValue += currentValue;
      totalCost += costBasis;
      totalGainLoss += gainLoss;

      holdingsAnalytics.push({
        ...holding,
        current_value: currentValue,
        gain_loss: gainLoss,
        gain_loss_percent: gainLossPercent,
        weight: 0 // Will be calculated after total
      });
    }

    // Calculate weights
    holdingsAnalytics.forEach(holding => {
      holding.weight = totalValue !== 0 ? (holding.current_value / totalValue) * 100 : 0;
    });

    const totalGainLossPercent = totalCost !== 0 ? (totalGainLoss / totalCost) * 100 : 0;

    // Update portfolio totals
    await supabase
      .from('portfolios')
      .update({
        total_value: totalValue,
        total_gain_loss: totalGainLoss,
        total_gain_loss_percent: totalGainLossPercent,
        updated_at: new Date().toISOString()
      })
      .eq('id', portfolioId);

    // Calculate sector allocation
    const sectorAllocation: Record<string, number> = {};
    holdingsAnalytics.forEach(holding => {
      const sector = holding.stocks.sector || 'Unknown';
      sectorAllocation[sector] = (sectorAllocation[sector] || 0) + holding.current_value;
    });

    // Calculate portfolio metrics
    const analytics = {
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
      holdingsCount: holdings?.length || 0,
      sectorAllocation,
      topHoldings: holdingsAnalytics
        .sort((a, b) => b.current_value - a.current_value)
        .slice(0, 5),
      riskMetrics: {
        diversificationScore: Math.min(100, (holdings?.length || 0) * 10),
        volatilityScore: Math.random() * 100, // In production, calculate actual volatility
        betaScore: 0.8 + Math.random() * 0.4 // Simulated beta
      }
    };

    return new Response(JSON.stringify(analytics), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in portfolio-analytics function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
