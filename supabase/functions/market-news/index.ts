
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

// Simulated news data (in production, integrate with real news APIs)
const generateMarketNews = () => {
  const newsTemplates = [
    { title: "Tech Stocks Rally on AI Optimism", sentiment: "positive" },
    { title: "Federal Reserve Signals Interest Rate Stability", sentiment: "neutral" },
    { title: "Energy Sector Faces Headwinds Amid Policy Changes", sentiment: "negative" },
    { title: "Healthcare Innovation Drives Sector Growth", sentiment: "positive" },
    { title: "Market Volatility Expected Following Economic Data", sentiment: "neutral" },
    { title: "Cryptocurrency Market Shows Signs of Recovery", sentiment: "positive" },
    { title: "Supply Chain Disruptions Impact Manufacturing", sentiment: "negative" },
    { title: "Green Energy Investments Reach Record Highs", sentiment: "positive" }
  ];

  return newsTemplates.map((template, index) => ({
    id: `news_${Date.now()}_${index}`,
    title: template.title,
    content: `Market analysis shows significant developments in ${template.title.toLowerCase()}. Industry experts are closely monitoring the situation as it unfolds across major market segments.`,
    source: ['Reuters', 'Bloomberg', 'CNBC', 'MarketWatch'][Math.floor(Math.random() * 4)],
    url: `https://example.com/news/${index}`,
    sentiment: template.sentiment,
    published_at: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString() // Random time within last week
  }));
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action } = await req.json().catch(() => ({ action: 'fetch' }));

    if (action === 'analyze' && openAIApiKey) {
      // Get recent news for sentiment analysis
      const { data: recentNews } = await supabase
        .from('market_news')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(10);

      if (recentNews && recentNews.length > 0) {
        // Analyze sentiment using AI
        const newsText = recentNews.map(news => `${news.title}: ${news.content}`).join('\n\n');
        
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
                content: 'You are a financial news analyst. Analyze the overall market sentiment from the provided news articles and provide a summary with sentiment score from -1 (very negative) to 1 (very positive).'
              },
              {
                role: 'user',
                content: `Analyze the market sentiment from these news articles:\n\n${newsText}`
              }
            ],
            temperature: 0.3,
          }),
        });

        const aiData = await response.json();
        const analysis = aiData.choices[0].message.content;

        return new Response(JSON.stringify({
          sentiment_analysis: analysis,
          news_count: recentNews.length,
          latest_news: recentNews
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Generate and store new market news
    const newsData = generateMarketNews();
    
    // Insert news into database
    for (const news of newsData) {
      await supabase
        .from('market_news')
        .upsert({
          title: news.title,
          content: news.content,
          source: news.source,
          url: news.url,
          sentiment: news.sentiment,
          published_at: news.published_at
        });
    }

    // Return latest news
    const { data: latestNews, error } = await supabase
      .from('market_news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return new Response(JSON.stringify(latestNews), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in market-news function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
