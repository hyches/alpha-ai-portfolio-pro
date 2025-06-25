
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.user_role AS ENUM ('admin', 'user', 'premium');
CREATE TYPE public.stock_exchange AS ENUM ('NYSE', 'NASDAQ', 'NSE', 'BSE');
CREATE TYPE public.report_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE public.alert_type AS ENUM ('price', 'volume', 'news', 'technical');

-- User profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    subscription_tier TEXT DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stocks table
CREATE TABLE public.stocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    exchange stock_exchange NOT NULL,
    sector TEXT,
    industry TEXT,
    market_cap BIGINT,
    current_price DECIMAL(10,2),
    price_change DECIMAL(10,2),
    price_change_percent DECIMAL(5,2),
    volume BIGINT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock price history
CREATE TABLE public.stock_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_id UUID REFERENCES public.stocks(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    volume BIGINT,
    high DECIMAL(10,2),
    low DECIMAL(10,2),
    open_price DECIMAL(10,2),
    close_price DECIMAL(10,2),
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User portfolios
CREATE TABLE public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'My Portfolio',
    description TEXT,
    total_value DECIMAL(15,2) DEFAULT 0,
    total_gain_loss DECIMAL(15,2) DEFAULT 0,
    total_gain_loss_percent DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio holdings
CREATE TABLE public.portfolio_holdings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    stock_id UUID REFERENCES public.stocks(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    average_price DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(15,2),
    gain_loss DECIMAL(15,2),
    gain_loss_percent DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(portfolio_id, stock_id)
);

-- AI research reports
CREATE TABLE public.research_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    stock_id UUID REFERENCES public.stocks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT,
    content JSONB,
    sentiment_score DECIMAL(3,2), -- -1 to 1
    recommendation TEXT, -- 'buy', 'sell', 'hold'
    confidence_score DECIMAL(3,2), -- 0 to 1
    status report_status DEFAULT 'pending',
    generated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock screener saved filters
CREATE TABLE public.screener_filters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    filters JSONB NOT NULL,
    results_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User alerts
CREATE TABLE public.user_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    stock_id UUID REFERENCES public.stocks(id) ON DELETE CASCADE,
    alert_type alert_type NOT NULL,
    condition_value DECIMAL(10,2),
    condition_operator TEXT, -- '>', '<', '>=', '<='
    message TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    triggered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trading signals (F&O)
CREATE TABLE public.trading_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_id UUID REFERENCES public.stocks(id) ON DELETE CASCADE,
    signal_type TEXT NOT NULL, -- 'call', 'put', 'future'
    action TEXT NOT NULL, -- 'buy', 'sell'
    strike_price DECIMAL(10,2),
    expiry_date DATE,
    target_price DECIMAL(10,2),
    stop_loss DECIMAL(10,2),
    confidence DECIMAL(3,2),
    reasoning TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market news
CREATE TABLE public.market_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    source TEXT,
    url TEXT,
    sentiment TEXT, -- 'positive', 'negative', 'neutral'
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_stocks_symbol ON public.stocks(symbol);
CREATE INDEX idx_stock_prices_stock_id ON public.stock_prices(stock_id);
CREATE INDEX idx_stock_prices_recorded_at ON public.stock_prices(recorded_at);
CREATE INDEX idx_portfolio_holdings_portfolio_id ON public.portfolio_holdings(portfolio_id);
CREATE INDEX idx_research_reports_user_id ON public.research_reports(user_id);
CREATE INDEX idx_research_reports_stock_id ON public.research_reports(stock_id);
CREATE INDEX idx_user_alerts_user_id ON public.user_alerts(user_id);
CREATE INDEX idx_trading_signals_stock_id ON public.trading_signals(stock_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screener_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for portfolios
CREATE POLICY "Users can view own portfolios" ON public.portfolios
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for portfolio holdings
CREATE POLICY "Users can view own holdings" ON public.portfolio_holdings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.portfolios 
            WHERE portfolios.id = portfolio_holdings.portfolio_id 
            AND portfolios.user_id = auth.uid()
        )
    );

-- RLS Policies for research reports
CREATE POLICY "Users can view own reports" ON public.research_reports
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for screener filters
CREATE POLICY "Users can manage own filters" ON public.screener_filters
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user alerts
CREATE POLICY "Users can manage own alerts" ON public.user_alerts
    FOR ALL USING (auth.uid() = user_id);

-- Public read access for stocks, stock prices, trading signals, and market news
CREATE POLICY "Anyone can view stocks" ON public.stocks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view stock prices" ON public.stock_prices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view trading signals" ON public.trading_signals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view market news" ON public.market_news FOR SELECT TO authenticated USING (true);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    
    -- Create default portfolio for new user
    INSERT INTO public.portfolios (user_id, name, description)
    VALUES (NEW.id, 'My Portfolio', 'Default portfolio');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update portfolio values
CREATE OR REPLACE FUNCTION public.update_portfolio_values()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.portfolios 
    SET 
        total_value = (
            SELECT COALESCE(SUM(current_value), 0)
            FROM public.portfolio_holdings 
            WHERE portfolio_id = NEW.portfolio_id
        ),
        updated_at = NOW()
    WHERE id = NEW.portfolio_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update portfolio values when holdings change
CREATE TRIGGER update_portfolio_on_holding_change
    AFTER INSERT OR UPDATE OR DELETE ON public.portfolio_holdings
    FOR EACH ROW EXECUTE FUNCTION public.update_portfolio_values();
