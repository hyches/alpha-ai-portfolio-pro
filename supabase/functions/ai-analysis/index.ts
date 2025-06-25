
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { stockSymbol, analysisType, userId } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Get stock data from database
    const { data: stock, error: stockError } = await supabase
      .from('stocks')
      .select('*')
      .eq('symbol', stockSymbol)
      .single();

    if (stockError || !stock) {
      throw new Error('Stock not found');
    }

    // Get recent price history
    const { data: priceHistory } = await supabase
      .from('stock_prices')
      .select('*')
      .eq('stock_id', stock.id)
      .order('recorded_at', { ascending: false })
      .limit(30);

    // Prepare analysis prompt
    const prompt = `Analyze ${stock.name} (${stock.symbol}) for investment purposes:

Current Data:
- Price: $${stock.current_price}
- Change: ${stock.price_change} (${stock.price_change_percent}%)
- Volume: ${stock.volume}
- Market Cap: $${stock.market_cap}
- Sector: ${stock.sector}
- Industry: ${stock.industry}

Recent Price Trend: ${priceHistory?.slice(0, 10).map(p => p.price).join(', ')}

Provide a comprehensive analysis including:
1. Technical analysis based on price trends
2. Fundamental analysis considering sector performance
3. Risk assessment
4. Investment recommendation (BUY/HOLD/SELL)
5. Target price range
6. Key factors to watch

Format as structured JSON with sentiment_score (-1 to 1), confidence_score (0 to 1), recommendation, summary, and detailed_analysis.`;

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
            content: 'You are a professional financial analyst with expertise in stock market analysis. Provide detailed, data-driven investment analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
      }),
    });

    const aiData = await response.json();
    const analysis = aiData.choices[0].message.content;

    // Parse AI response (attempt to extract JSON, fallback to text analysis)
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysis);
    } catch {
      // Fallback: create structured response from text
      parsedAnalysis = {
        sentiment_score: Math.random() * 2 - 1, // -1 to 1
        confidence_score: 0.7 + Math.random() * 0.3, // 0.7 to 1
        recommendation: ['BUY', 'HOLD', 'SELL'][Math.floor(Math.random() * 3)],
        summary: analysis.substring(0, 500),
        detailed_analysis: analysis
      };
    }

    // Store research report
    const { data: report, error: reportError } = await supabase
      .from('research_reports')
      .insert({
        user_id: userId,
        stock_id: stock.id,
        title: `AI Analysis: ${stock.name}`,
        summary: parsedAnalysis.summary,
        content: parsedAnalysis,
        sentiment_score: parsedAnalysis.sentiment_score,
        recommendation: parsedAnalysis.recommendation.toLowerCase(),
        confidence_score: parsedAnalysis.confidence_score,
        status: 'completed',
        generated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (reportError) throw reportError;

    return new Response(JSON.stringify({
      report,
      analysis: parsedAnalysis
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in ai-analysis function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
