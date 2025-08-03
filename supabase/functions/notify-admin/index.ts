import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  formData: any;
  isPartial?: boolean;
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
      console.log(`📧 Email sending attempt ${attempt}/${maxRetries}`);
      
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
      
      console.log(`✅ Email sent successfully on attempt ${attempt}`);
      return { success: true, attempt };
      
    } catch (error) {
      console.error(`❌ Email sending failed on attempt ${attempt}:`, error);
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to send email after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Exponential backoff
      const delayMs = Math.pow(2, attempt - 1) * 1000;
      console.log(`⏱️ Retrying in ${delayMs}ms...`);
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
    const { formData, isPartial = false }: NotificationRequest = await req.json();
    const emailConfig = getEmailConfig();

    console.log("📨 Processing email notification for:", { email: formData.email, isPartial });

    const subject = isPartial 
      ? `🔄 Demande de raccordement partielle - ${formData.firstName} ${formData.lastName}`
      : `✅ Nouvelle demande de raccordement - ${formData.firstName} ${formData.lastName}`;

    const clientTypeLabel = {
      particulier: "Particulier",
      professionnel: "Professionnel", 
      collectivite: "Collectivité"
    }[formData.clientType] || formData.clientType;

    const connectionTypeLabel = {
      nouveau_raccordement: "Nouveau raccordement",
      augmentation_puissance: "Augmentation de puissance",
      raccordement_provisoire: "Raccordement provisoire",
      deplacement_compteur: "Déplacement de compteur",
      autre_demande: "Autre demande"
    }[formData.connectionType] || formData.connectionType;

    const projectTypeLabel = {
      maison_individuelle: "Maison individuelle",
      immeuble_collectif: "Immeuble collectif",
      local_commercial: "Local commercial", 
      batiment_industriel: "Bâtiment industriel",
      terrain_nu: "Terrain nu"
    }[formData.projectType] || formData.projectType;

    const powerTypeLabel = {
      monophase: "Monophasé",
      triphase: "Triphasé",
      je_ne_sais_pas: "Je ne sais pas"
    }[formData.powerType] || formData.powerType;

    const submissionTime = new Date().toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const htmlContent = `
      <h1>${subject}</h1>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>📋 Informations client</h2>
        <p><strong>Type:</strong> ${clientTypeLabel}</p>
        <p><strong>Nom:</strong> ${formData.civilite === "monsieur" ? "M." : formData.civilite === "madame" ? "Mme" : ""} ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Téléphone:</strong> ${formData.phone}</p>
        <p><strong>Adresse:</strong> ${formData.postalCode} ${formData.city}</p>
        <p><strong>Soumission:</strong> ${submissionTime}</p>
        
        ${formData.companyName ? `<p><strong>Entreprise:</strong> ${formData.companyName} (${formData.siret})</p>` : ''}
        ${formData.collectivityName ? `<p><strong>Collectivité:</strong> ${formData.collectivityName} (${formData.collectivitySiren})</p>` : ''}
      </div>

      ${!isPartial ? `
      <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>⚡ Détails techniques</h2>
        <p><strong>Type de raccordement:</strong> ${connectionTypeLabel}</p>
        <p><strong>Type de projet:</strong> ${projectTypeLabel}</p>
        <p><strong>Adresse du projet:</strong> ${formData.workStreet}, ${formData.postalCode} ${formData.city}</p>
        ${formData.workAddressComplement ? `<p><strong>Complément d'adresse:</strong> ${formData.workAddressComplement}</p>` : ''}
        <p><strong>Type d'alimentation:</strong> ${powerTypeLabel}</p>
        <p><strong>Puissance demandée:</strong> ${formData.powerDemanded} ${formData.powerType !== "je_ne_sais_pas" ? "kVA" : ""}</p>
        
        ${formData.differentBillingAddress ? `
        <div style="background: #fff; padding: 15px; border-radius: 5px; margin-top: 10px;">
          <h3>📍 Adresse de facturation différente</h3>
          <p>${formData.billingStreet}, ${formData.billingPostalCode} ${formData.billingCity}</p>
        </div>
        ` : ''}
        
        <p><strong>État du projet:</strong> ${formData.projectStatus}</p>
        <p><strong>Délai souhaité:</strong> ${formData.desiredTimeline}</p>
        
        ${formData.additionalInfo ? `
        <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin-top: 10px;">
          <h3>💬 Message complémentaire</h3>
          <p>${formData.additionalInfo}</p>
        </div>
        ` : ''}
      </div>
      ` : `
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>⚠️ Demande partielle</h2>
        <p>Cette demande n'a été que partiellement complétée (étape 1 seulement).</p>
        <p>Le client peut revenir terminer sa demande plus tard.</p>
      </div>
      `}

      ${!isPartial ? `
      <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>💳 Statut du paiement</h2>
        <p style="color: #155724;"><strong>✅ Paiement effectué - 129€ TTC</strong></p>
        <p>La demande est prête à être traitée.</p>
      </div>
      ` : ''}

      <div style="background: #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>🔗 Actions</h2>
        <p><a href="https://raccordement-connect.com/admin" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir dans le CRM</a></p>
      </div>

      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 14px;">
        Cette notification a été envoyée automatiquement par le système de demandes de raccordement.<br>
        Email du client: ${formData.email}<br>
        Horodatage: ${submissionTime}
      </p>
    `;

    const emailData = {
      to: emailConfig.recipients,
      cc: emailConfig.ccRecipients,
      bcc: emailConfig.bccRecipients,
      subject: subject,
      html: htmlContent,
    };

    const result = await sendEmailWithRetry(emailData);

    console.log("📧 Email sent successfully:", result);

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
    console.error("💥 Error sending notification:", error);
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