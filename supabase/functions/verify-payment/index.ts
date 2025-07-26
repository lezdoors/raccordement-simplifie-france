import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    console.log("🔍 Verifying payment for session:", sessionId);

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("✅ Session retrieved:", session.payment_status);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Update payment status in database
    if (session.payment_status === "paid") {
      // Update lead payment status
      const { error: leadError } = await supabase
        .from('leads_raccordement')
        .update({ 
          payment_status: "paid",
          updated_at: new Date().toISOString()
        })
        .eq('stripe_session_id', sessionId);

      if (leadError) {
        console.error("❌ Error updating lead payment status:", leadError);
      }

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          stripe_session_id: sessionId,
          stripe_payment_intent_id: session.payment_intent as string,
          amount: (session.amount_total || 0) / 100, // Convert from cents
          currency: session.currency || "eur",
          status: "paid",
          customer_email: session.customer_email,
          customer_name: session.metadata?.customer_name,
          paid_at: new Date().toISOString(),
        });

      if (paymentError) {
        console.error("❌ Error creating payment record:", paymentError);
      } else {
        console.log("✅ Payment record created successfully");
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        paymentStatus: session.payment_status,
        amount: session.amount_total,
        currency: session.currency
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("❌ Payment verification error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Payment verification failed" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});