import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("notify-admin function called");
    
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { type, data } = await req.json();
    console.log("Notification type:", type, "Data:", data);

    let title = "";
    let message = "";
    let notificationData = data;

    switch (type) {
      case 'new_submission':
        title = "Nouvelle demande de raccordement";
        message = `Nouvelle demande de ${data.nom} ${data.prenom} pour un projet ${data.project_type}`;
        break;
      case 'new_message':
        title = "Nouveau message de contact";
        message = `Message de ${data.name} (${data.email})`;
        break;
      case 'new_payment':
        title = "Nouveau paiement reçu";
        message = `Paiement de ${data.amount / 100}€ reçu de ${data.customer_name || data.customer_email}`;
        break;
      default:
        title = "Notification";
        message = "Une nouvelle notification est disponible";
    }

    // Insert notification into database
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        type,
        title,
        message,
        data: notificationData,
        email_sent: false
      });

    if (notificationError) {
      console.error('Error inserting notification:', notificationError);
      throw notificationError;
    }

    console.log("Notification inserted successfully");

    // Optional: Send email notification to admins
    // You can implement this using Resend API or other email service
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in notify-admin function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Error occurred in notify-admin function'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});