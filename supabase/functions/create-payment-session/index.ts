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
    const { amount, formData } = await req.json();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Service de raccordement électrique - ${formData.projectType}`,
              description: `Gestion administrative complète pour ${formData.firstName} ${formData.lastName}`,
            },
            unit_amount: amount, // Already in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-cancel`,
      customer_email: formData.email,
      metadata: {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        project_type: formData.projectType,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postalCode,
      },
    });

    // Save form data to Supabase
    const { error: insertError } = await supabase
      .from('form_submissions')
      .insert({
        client_type: formData.clientType || formData.clientType,
        nom: formData.lastName || formData.nom,
        prenom: formData.firstName || formData.prenom,
        email: formData.email,
        telephone: formData.phone || formData.telephone,
        raison_sociale: formData.companyName || formData.raison_sociale,
        siren: formData.siret || formData.siren,
        nom_collectivite: formData.collectivityName || formData.nom_collectivite,
        siren_collectivite: formData.collectivitySiren || formData.siren_collectivite,
        adresse: formData.workStreet || formData.address || formData.adresse,
        complement_adresse: formData.addressComplement || formData.complement_adresse,
        code_postal: formData.postalCode || formData.code_postal,
        ville: formData.city || formData.ville,
        connection_type: formData.connectionType || formData.connection_type,
        project_type: formData.projectType || formData.project_type,
        power_type: formData.powerType || formData.power_type,
        power_kva: formData.powerDemanded || formData.power_kva || formData.power,
        project_status: formData.projectStatus || formData.project_status,
        desired_timeline: formData.desiredTimeline || formData.desired_timeline,
        has_architect: formData.hasArchitect || formData.has_architect || false,
        architect_name: formData.architectName || formData.architect_name,
        architect_phone: formData.architectPhone || formData.architect_phone,
        architect_email: formData.architectEmail || formData.architect_email,
        additional_comments: formData.additionalComments || formData.comments || formData.additional_comments,
        stripe_session_id: session.id,
        total_amount: amount,
        payment_status: 'pending'
      });

    if (insertError) {
      console.error('Error saving form data:', insertError);
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
    console.error('Error creating payment session:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});