import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lead_id, customer_email, price_id, success_url, cancel_url } = await req.json();

    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    const origin = req.headers.get("origin") || "https://www.raccordement-connect.com";
    const siteUrl = Deno.env.get("SITE_URL") || origin;

    // Build line items: prefer a recurring/price-based item if provided, otherwise fallback to fixed amount
    const lineItems = price_id
      ? [{ price: price_id, quantity: 1 }]
      : [
          {
            price_data: {
              currency: "eur",
              product_data: { name: "Raccordement électrique Enedis" },
              unit_amount: 12980,
            },
            quantity: 1,
          },
        ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email,
      metadata: {
        lead_id: lead_id || "",
      },
      success_url:
        success_url || `${siteUrl}/merci?lead_id=${lead_id || ""}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        cancel_url || `${siteUrl}/annule?lead_id=${lead_id || ""}`,
    });

    // Update the lead with stripe session ID and mark ready_for_payment
    if (lead_id) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      await supabase
        .from("leads_raccordement")
        .update({ stripe_session_id: session.id, status: "ready_for_payment", payment_status: "pending" })
        .eq("id", lead_id);
    }

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("create-checkout-session error", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
