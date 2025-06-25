
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface StockData {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  industry: string;
}

// Simulated real-time stock data (in production, connect to real APIs like Alpha Vantage, Yahoo Finance, etc.)
const generateStockData = (symbol: string, name: string): StockData => {
  const basePrice = Math.random() * 1000 + 50;
  const change = (Math.random() - 0.5) * 20;
  const changePercent = (change / basePrice) * 100;
  
  return {
    symbol,
    name,
    currentPrice: Number(basePrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 10000000),
    marketCap: Math.floor(Math.random() * 500000000000),
    sector: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer'][Math.floor(Math.random() * 5)],
    industry: ['Software', 'Biotechnology', 'Banking', 'Oil & Gas', 'Retail'][Math.floor(Math.random() * 5)]
  };
};

const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'ADBE', name: 'Adobe Inc.' },
  { symbol: 'CRM', name: 'Salesforce Inc.' }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol } = await req.json().catch(() => ({}));
    
    if (symbol) {
      // Get specific stock data
      const stockInfo = popularStocks.find(s => s.symbol === symbol) || { symbol, name: `${symbol} Corp` };
      const stockData = generateStockData(stockInfo.symbol, stockInfo.name);
      
      // Update or insert stock data
      const { error } = await supabase
        .from('stocks')
        .upsert({
          symbol: stockData.symbol,
          name: stockData.name,
          exchange: 'NASDAQ',
          current_price: stockData.currentPrice,
          price_change: stockData.change,
          price_change_percent: stockData.changePercent,
          volume: stockData.volume,
          market_cap: stockData.marketCap,
          sector: stockData.sector,
          industry: stockData.industry,
          last_updated: new Date().toISOString()
        });

      if (error) throw error;

      // Insert price history
      await supabase
        .from('stock_prices')
        .insert({
          stock_id: (await supabase.from('stocks').select('id').eq('symbol', symbol).single()).data?.id,
          price: stockData.currentPrice,
          volume: stockData.volume,
          high: stockData.currentPrice * 1.05,
          low: stockData.currentPrice * 0.95,
          open_price: stockData.currentPrice * 0.98,
          close_price: stockData.currentPrice,
          recorded_at: new Date().toISOString()
        });

      return new Response(JSON.stringify(stockData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      // Get all popular stocks data
      const allStocksData = popularStocks.map(stock => generateStockData(stock.symbol, stock.name));
      
      // Batch update stocks
      for (const stockData of allStocksData) {
        await supabase
          .from('stocks')
          .upsert({
            symbol: stockData.symbol,
            name: stockData.name,
            exchange: 'NASDAQ',
            current_price: stockData.currentPrice,
            price_change: stockData.change,
            price_change_percent: stockData.changePercent,
            volume: stockData.volume,
            market_cap: stockData.marketCap,
            sector: stockData.sector,
            industry: stockData.industry,
            last_updated: new Date().toISOString()
          });
      }

      return new Response(JSON.stringify(allStocksData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error in stock-data function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
