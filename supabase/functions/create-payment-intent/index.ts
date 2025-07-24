import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

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
    console.log("Payment intent function started");
    
    const { amount, description, formData } = await req.json();
    console.log("Request data:", { amount, description });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create a payment intent with optimized metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
      description: description || "Demande de raccordement Enedis",
      receipt_email: formData?.email,
      metadata: {
        client_type: formData?.clientType || '',
        email: formData?.email || '',
        first_name: formData?.firstName || '',
        last_name: formData?.lastName || '',
        connection_type: formData?.connectionType || '',
        project_type: formData?.projectType || '',
        power_demanded: formData?.powerDemanded || '',
        postal_code: formData?.postalCode || '',
        city: formData?.city || ''
      }
    });

    console.log("Payment intent created:", paymentIntent.id);

    return new Response(JSON.stringify({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment intent error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});