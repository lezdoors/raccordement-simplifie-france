import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MessageNotificationRequest {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  request_type: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message, request_type }: MessageNotificationRequest = await req.json();

    // Send notification email to the team
    const emailResponse = await resend.emails.send({
      from: "Raccordement Connect <noreply@raccordement-connect.com>",
      to: ["bonjour@raccordement-connect.com"],
      subject: `🔔 Nouveau message - ${request_type === 'callback' ? 'Demande de rappel' : 'Contact'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            📧 Nouveau message reçu
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Type de demande</h3>
            <p style="background-color: #3b82f6; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 0;">
              ${request_type === 'callback' ? '📞 Demande de rappel' : '💬 Message de contact'}
            </p>
          </div>

          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Informations du contact</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 10px;"><strong>👤 Nom:</strong> ${name}</li>
              <li style="margin-bottom: 10px;"><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #3b82f6;">${email}</a></li>
              ${phone ? `<li style="margin-bottom: 10px;"><strong>📱 Téléphone:</strong> <a href="tel:${phone}" style="color: #3b82f6;">${phone}</a></li>` : ''}
            </ul>
          </div>

          ${message ? `
          <div style="background-color: #f0f9ff; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">💬 Message</h3>
            <p style="color: #4b5563; line-height: 1.6; margin: 0;">${message}</p>
          </div>
          ` : ''}

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="color: #92400e; margin: 0; font-weight: 500;">
              ⚡ Action requise: Contactez ce prospect dans les plus brefs délais
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <a href="https://kstugxtmghinprrpkrud.supabase.co/project/kstugxtmghinprrpkrud" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
              📊 Voir dans le CRM
            </a>
          </div>

          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">
            Raccordement Connect - Notification automatique
          </p>
        </div>
      `,
    });

    console.log("Team notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in notify-team-message function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);