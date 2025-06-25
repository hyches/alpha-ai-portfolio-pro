
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
    const { action, userId, stockId, alertType, conditionValue, conditionOperator } = await req.json();

    if (action === 'create') {
      // Create new alert
      const { data: alert, error } = await supabase
        .from('user_alerts')
        .insert({
          user_id: userId,
          stock_id: stockId,
          alert_type: alertType,
          condition_value: conditionValue,
          condition_operator: conditionOperator,
          message: `Alert for ${alertType} condition`,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(alert), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'check') {
      // Check and trigger alerts
      const { data: activeAlerts, error: alertsError } = await supabase
        .from('user_alerts')
        .select(`
          *,
          stocks (symbol, name, current_price, volume)
        `)
        .eq('is_active', true)
        .is('triggered_at', null);

      if (alertsError) throw alertsError;

      const triggeredAlerts = [];

      for (const alert of activeAlerts || []) {
        const stock = alert.stocks;
        let shouldTrigger = false;
        let currentValue = 0;

        switch (alert.alert_type) {
          case 'price':
            currentValue = stock.current_price || 0;
            break;
          case 'volume':
            currentValue = stock.volume || 0;
            break;
          default:
            continue;
        }

        // Check condition
        switch (alert.condition_operator) {
          case '>':
            shouldTrigger = currentValue > alert.condition_value;
            break;
          case '<':
            shouldTrigger = currentValue < alert.condition_value;
            break;
          case '>=':
            shouldTrigger = currentValue >= alert.condition_value;
            break;
          case '<=':
            shouldTrigger = currentValue <= alert.condition_value;
            break;
        }

        if (shouldTrigger) {
          // Trigger alert
          await supabase
            .from('user_alerts')
            .update({
              triggered_at: new Date().toISOString(),
              message: `${alert.alert_type.toUpperCase()} Alert: ${stock.name} ${alert.alert_type} is ${currentValue} (condition: ${alert.condition_operator} ${alert.condition_value})`
            })
            .eq('id', alert.id);

          triggeredAlerts.push({
            ...alert,
            current_value: currentValue,
            triggered_at: new Date().toISOString()
          });
        }
      }

      return new Response(JSON.stringify({
        checked_alerts: activeAlerts?.length || 0,
        triggered_alerts: triggeredAlerts
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get user alerts
    const { data: userAlerts, error } = await supabase
      .from('user_alerts')
      .select(`
        *,
        stocks (symbol, name, current_price)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(userAlerts), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in alerts-monitor function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
