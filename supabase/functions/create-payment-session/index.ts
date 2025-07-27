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
    console.log("🚀 Starting payment session creation");
    
    const { amount, formData } = await req.json();
    console.log("💰 Payment amount:", amount, "Form data received:", !!formData);

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    console.log("✅ Stripe initialized");

    // Create checkout session with enhanced configuration
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Service de raccordement électrique Enedis",
              description: `Dossier personnalisé pour ${formData?.firstName} ${formData?.lastName} - ${formData?.connectionType?.replace('_', ' ')} - ${formData?.projectType?.replace('_', ' ')}`,
              images: ["https://raccordement-elec.fr/logo-payment.png"], // Optional: Add your logo
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/commencer?canceled=true`,
      customer_email: formData?.email,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["FR"],
      },
      phone_number_collection: {
        enabled: true,
      },
      custom_text: {
        submit: {
          message: "Votre dossier sera traité immédiatement après le paiement."
        }
      },
      metadata: {
        customer_name: `${formData?.firstName} ${formData?.lastName}`,
        customer_email: formData?.email,
        connection_type: formData?.connectionType || '',
        project_type: formData?.projectType || '',
        power_type: formData?.powerType || '',
        work_address: formData?.workStreet || '',
        postal_code: formData?.postalCode || '',
        city: formData?.city || '',
        form_submission_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
    });

    console.log("✅ Checkout session created:", session.id);

    // Update the lead with stripe session ID
    if (formData?.email) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      const { error: updateError } = await supabase
        .from('leads_raccordement')
        .update({ 
          stripe_session_id: session.id,
          payment_status: "pending"
        })
        .eq('email', formData.email);

      if (updateError) {
        console.error("❌ Error updating lead with session ID:", updateError);
      } else {
        console.log("✅ Updated lead with Stripe session ID");
      }
    }

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("❌ Payment session creation error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Payment session creation failed" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});