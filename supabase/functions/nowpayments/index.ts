import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const NOWPAYMENTS_API_KEY = Deno.env.get("NOWPAYMENTS_API_KEY")!;
const NOWPAYMENTS_BASE = "https://api.nowpayments.io/v1";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();

    if (action === "create-payment") {
      // Create a payment via NOWPayments
      const { price_amount, order_id, order_description, pay_currency } = params;

      const res = await fetch(`${NOWPAYMENTS_BASE}/payment`, {
        method: "POST",
        headers: {
          "x-api-key": NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price_amount,
          price_currency: "usd",
          pay_currency: pay_currency || "btc",
          order_id,
          order_description,
        }),
      });

      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: res.ok ? 200 : 400,
      });
    }

    if (action === "payment-status") {
      // Check payment status by payment_id
      const { payment_id } = params;

      const res = await fetch(`${NOWPAYMENTS_BASE}/payment/${payment_id}`, {
        headers: { "x-api-key": NOWPAYMENTS_API_KEY },
      });

      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: res.ok ? 200 : 400,
      });
    }

    if (action === "min-amount") {
      // Get minimum payment amount for a currency pair
      const { currency_from, currency_to } = params;

      const res = await fetch(
        `${NOWPAYMENTS_BASE}/min-amount?currency_from=${currency_from || "btc"}&currency_to=${currency_to || "usd"}`,
        { headers: { "x-api-key": NOWPAYMENTS_API_KEY } }
      );

      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: res.ok ? 200 : 400,
      });
    }

    if (action === "currencies") {
      const res = await fetch(`${NOWPAYMENTS_BASE}/currencies`, {
        headers: { "x-api-key": NOWPAYMENTS_API_KEY },
      });

      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: res.ok ? 200 : 400,
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
