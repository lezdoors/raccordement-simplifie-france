import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
  const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return new Response("Missing Stripe secrets", { status: 500, headers: corsHeaders });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

  let event: Stripe.Event;
  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();

  try {
    event = stripe.webhooks.constructEvent(payload, signature!, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("❌ Webhook signature verification failed.", err);
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const leadId = (session.metadata?.lead_id as string) || null;

      // Update lead payment status by session id (primary) or lead id (fallback)
      if (session.id) {
        await supabase
          .from("leads_raccordement")
          .update({ payment_status: "paid", status: "submitted", updated_at: new Date().toISOString() })
          .eq("stripe_session_id", session.id);
      } else if (leadId) {
        await supabase
          .from("leads_raccordement")
          .update({ payment_status: "paid", status: "submitted", updated_at: new Date().toISOString() })
          .eq("id", leadId);
      }

      // Create a payment record
      await supabase.from("payments").insert({
        stripe_session_id: session.id,
        stripe_payment_intent_id: (session.payment_intent as string) || null,
        amount: ((session.amount_total || 0) / 100) as unknown as number,
        currency: session.currency || "EUR",
        status: "paid",
        customer_email: session.customer_email || undefined,
        customer_name: (session.metadata?.customer_name as string) || undefined,
        paid_at: new Date().toISOString(),
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Webhook handler error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
