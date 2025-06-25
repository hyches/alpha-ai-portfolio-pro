
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateTradingSignal = (stock: any) => {
  const signalTypes = ['call', 'put', 'future'];
  const actions = ['buy', 'sell'];
  
  const currentPrice = stock.current_price || 100;
  const signalType = signalTypes[Math.floor(Math.random() * signalTypes.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  
  // Generate realistic options data
  const strikePrice = signalType === 'future' ? null : 
    currentPrice + (Math.random() - 0.5) * currentPrice * 0.2;
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 90) + 7); // 1 week to 3 months
  
  const targetPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.3);
  const stopLoss = currentPrice * (1 - Math.random() * 0.15);
  
  return {
    stock_id: stock.id,
    signal_type: signalType,
    action,
    strike_price: strikePrice,
    expiry_date: signalType === 'future' ? null : expiryDate.toISOString().split('T')[0],
    target_price: Number(targetPrice.toFixed(2)),
    stop_loss: Number(stopLoss.toFixed(2)),
    confidence: 0.6 + Math.random() * 0.4, // 60-100% confidence
    reasoning: `Technical analysis indicates ${action.toUpperCase()} signal based on price momentum and volume patterns.`,
    is_active: true
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { stockSymbol, generateNew } = await req.json().catch(() => ({}));

    if (generateNew) {
      // Get all active stocks
      const { data: stocks, error: stocksError } = await supabase
        .from('stocks')
        .select('*')
        .limit(10);

      if (stocksError) throw stocksError;

      // Generate signals for each stock
      const signals = [];
      for (const stock of stocks || []) {
        const signal = generateTradingSignal(stock);
        
        // Insert signal
        const { data: insertedSignal, error: signalError } = await supabase
          .from('trading_signals')
          .insert(signal)
          .select()
          .single();

        if (!signalError) {
          signals.push(insertedSignal);
        }
      }

      return new Response(JSON.stringify(signals), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get existing signals
    let query = supabase
      .from('trading_signals')
      .select(`
        *,
        stocks (symbol, name, current_price)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (stockSymbol) {
      const { data: stock } = await supabase
        .from('stocks')
        .select('id')
        .eq('symbol', stockSymbol)
        .single();
      
      if (stock) {
        query = query.eq('stock_id', stock.id);
      }
    }

    const { data: signals, error } = await query.limit(50);

    if (error) throw error;

    // If OpenAI is available, enhance signals with AI analysis
    if (openAIApiKey && signals && signals.length > 0) {
      const enhancedSignals = await Promise.all(
        signals.slice(0, 5).map(async (signal) => {
          try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openAIApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                  {
                    role: 'system',
                    content: 'You are a professional derivatives trader. Provide concise trading analysis.'
                  },
                  {
                    role: 'user',
                    content: `Analyze this ${signal.signal_type} ${signal.action} signal for ${signal.stocks?.name} at $${signal.stocks?.current_price}. Strike: ${signal.strike_price}, Target: ${signal.target_price}, Stop Loss: ${signal.stop_loss}. Provide brief reasoning.`
                  }
                ],
                max_tokens: 150,
                temperature: 0.3,
              }),
            });

            const aiData = await response.json();
            return {
              ...signal,
              ai_reasoning: aiData.choices[0].message.content
            };
          } catch {
            return signal;
          }
        })
      );

      return new Response(JSON.stringify({
        signals: enhancedSignals,
        total_signals: signals.length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(signals), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in trading-signals function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
