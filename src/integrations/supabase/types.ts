export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      market_news: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          published_at: string | null
          sentiment: string | null
          source: string | null
          title: string
          url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          published_at?: string | null
          sentiment?: string | null
          source?: string | null
          title: string
          url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          published_at?: string | null
          sentiment?: string | null
          source?: string | null
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      portfolio_holdings: {
        Row: {
          average_price: number
          created_at: string | null
          current_value: number | null
          gain_loss: number | null
          gain_loss_percent: number | null
          id: string
          portfolio_id: string | null
          quantity: number
          stock_id: string | null
          updated_at: string | null
        }
        Insert: {
          average_price: number
          created_at?: string | null
          current_value?: number | null
          gain_loss?: number | null
          gain_loss_percent?: number | null
          id?: string
          portfolio_id?: string | null
          quantity: number
          stock_id?: string | null
          updated_at?: string | null
        }
        Update: {
          average_price?: number
          created_at?: string | null
          current_value?: number | null
          gain_loss?: number | null
          gain_loss_percent?: number | null
          id?: string
          portfolio_id?: string | null
          quantity?: number
          stock_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_holdings_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_holdings_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          total_gain_loss: number | null
          total_gain_loss_percent: number | null
          total_value: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          total_gain_loss?: number | null
          total_gain_loss_percent?: number | null
          total_value?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          total_gain_loss?: number | null
          total_gain_loss_percent?: number | null
          total_value?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      research_reports: {
        Row: {
          confidence_score: number | null
          content: Json | null
          created_at: string | null
          generated_at: string | null
          id: string
          recommendation: string | null
          sentiment_score: number | null
          status: Database["public"]["Enums"]["report_status"] | null
          stock_id: string | null
          summary: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          content?: Json | null
          created_at?: string | null
          generated_at?: string | null
          id?: string
          recommendation?: string | null
          sentiment_score?: number | null
          status?: Database["public"]["Enums"]["report_status"] | null
          stock_id?: string | null
          summary?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          content?: Json | null
          created_at?: string | null
          generated_at?: string | null
          id?: string
          recommendation?: string | null
          sentiment_score?: number | null
          status?: Database["public"]["Enums"]["report_status"] | null
          stock_id?: string | null
          summary?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_reports_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "research_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      screener_filters: {
        Row: {
          created_at: string | null
          filters: Json
          id: string
          name: string
          results_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          filters: Json
          id?: string
          name: string
          results_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          filters?: Json
          id?: string
          name?: string
          results_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "screener_filters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_prices: {
        Row: {
          close_price: number | null
          created_at: string | null
          high: number | null
          id: string
          low: number | null
          open_price: number | null
          price: number
          recorded_at: string
          stock_id: string | null
          volume: number | null
        }
        Insert: {
          close_price?: number | null
          created_at?: string | null
          high?: number | null
          id?: string
          low?: number | null
          open_price?: number | null
          price: number
          recorded_at: string
          stock_id?: string | null
          volume?: number | null
        }
        Update: {
          close_price?: number | null
          created_at?: string | null
          high?: number | null
          id?: string
          low?: number | null
          open_price?: number | null
          price?: number
          recorded_at?: string
          stock_id?: string | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_prices_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      stocks: {
        Row: {
          created_at: string | null
          current_price: number | null
          exchange: Database["public"]["Enums"]["stock_exchange"]
          id: string
          industry: string | null
          last_updated: string | null
          market_cap: number | null
          name: string
          price_change: number | null
          price_change_percent: number | null
          sector: string | null
          symbol: string
          volume: number | null
        }
        Insert: {
          created_at?: string | null
          current_price?: number | null
          exchange: Database["public"]["Enums"]["stock_exchange"]
          id?: string
          industry?: string | null
          last_updated?: string | null
          market_cap?: number | null
          name: string
          price_change?: number | null
          price_change_percent?: number | null
          sector?: string | null
          symbol: string
          volume?: number | null
        }
        Update: {
          created_at?: string | null
          current_price?: number | null
          exchange?: Database["public"]["Enums"]["stock_exchange"]
          id?: string
          industry?: string | null
          last_updated?: string | null
          market_cap?: number | null
          name?: string
          price_change?: number | null
          price_change_percent?: number | null
          sector?: string | null
          symbol?: string
          volume?: number | null
        }
        Relationships: []
      }
      trading_signals: {
        Row: {
          action: string
          confidence: number | null
          created_at: string | null
          expiry_date: string | null
          id: string
          is_active: boolean | null
          reasoning: string | null
          signal_type: string
          stock_id: string | null
          stop_loss: number | null
          strike_price: number | null
          target_price: number | null
        }
        Insert: {
          action: string
          confidence?: number | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          reasoning?: string | null
          signal_type: string
          stock_id?: string | null
          stop_loss?: number | null
          strike_price?: number | null
          target_price?: number | null
        }
        Update: {
          action?: string
          confidence?: number | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          reasoning?: string | null
          signal_type?: string
          stock_id?: string | null
          stop_loss?: number | null
          strike_price?: number | null
          target_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trading_signals_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_alerts: {
        Row: {
          alert_type: Database["public"]["Enums"]["alert_type"]
          condition_operator: string | null
          condition_value: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          message: string | null
          stock_id: string | null
          triggered_at: string | null
          user_id: string | null
        }
        Insert: {
          alert_type: Database["public"]["Enums"]["alert_type"]
          condition_operator?: string | null
          condition_value?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string | null
          stock_id?: string | null
          triggered_at?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: Database["public"]["Enums"]["alert_type"]
          condition_operator?: string | null
          condition_value?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string | null
          stock_id?: string | null
          triggered_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_alerts_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_type: "price" | "volume" | "news" | "technical"
      report_status: "pending" | "processing" | "completed" | "failed"
      stock_exchange: "NYSE" | "NASDAQ" | "NSE" | "BSE"
      user_role: "admin" | "user" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_type: ["price", "volume", "news", "technical"],
      report_status: ["pending", "processing", "completed", "failed"],
      stock_exchange: ["NYSE", "NASDAQ", "NSE", "BSE"],
      user_role: ["admin", "user", "premium"],
    },
  },
} as const
