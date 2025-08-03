import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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

interface EmailConfig {
  recipients: string[];
  ccRecipients?: string[];
  bccRecipients?: string[];
}

// Future-proof email configuration
const getEmailConfig = (): EmailConfig => {
  return {
    recipients: ["bonjour@raccordement-connect.com"],
    // Future expansion ready
    ccRecipients: [],
    bccRecipients: []
  };
};

const sendEmailWithRetry = async (emailData: any, maxRetries = 3): Promise<any> => {
  const smtpConfig = {
    hostname: "s1097.can1.mysecurecloudhost.com",
    port: 465,
    username: "bonjour@raccordement-connect.com",
    password: Deno.env.get("SMTP_PASSWORD")!,
    secure: true, // SSL
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📧 Contact email sending attempt ${attempt}/${maxRetries}`);
      
      const client = new SmtpClient();
      await client.connectTLS(smtpConfig);
      
      await client.send({
        from: "bonjour@raccordement-connect.com",
        to: emailData.to,
        cc: emailData.cc,
        bcc: emailData.bcc,
        subject: emailData.subject,
        content: emailData.html,
        html: emailData.html,
      });
      
      await client.close();
      
      console.log(`✅ Contact email sent successfully on attempt ${attempt}`);
      return { success: true, attempt };
      
    } catch (error) {
      console.error(`❌ Contact email sending failed on attempt ${attempt}:`, error);
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to send contact email after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Exponential backoff
      const delayMs = Math.pow(2, attempt - 1) * 1000;
      console.log(`⏱️ Retrying contact email in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message, request_type }: MessageNotificationRequest = await req.json();
    const emailConfig = getEmailConfig();

    console.log("📨 Processing contact notification for:", { name, email, request_type });

    const submissionTime = new Date().toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const emailData = {
      to: emailConfig.recipients,
      cc: emailConfig.ccRecipients,
      bcc: emailConfig.bccRecipients,
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
              <li style="margin-bottom: 10px;"><strong>🕐 Soumission:</strong> ${submissionTime}</li>
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
            <a href="https://raccordement-connect.com/admin" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
              📊 Voir dans le CRM
            </a>
          </div>

          <hr style="margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">
            Raccordement Connect - Notification automatique<br>
            Horodatage: ${submissionTime}
          </p>
        </div>
      `,
    };

    const result = await sendEmailWithRetry(emailData);

    console.log("📧 Contact notification sent successfully:", result);

    return new Response(JSON.stringify({ 
      success: true, 
      attempt: result.attempt,
      timestamp: submissionTime 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("💥 Error in notify-team-message function:", error);
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