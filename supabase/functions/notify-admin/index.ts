import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  formData: any;
  isPartial?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData, isPartial = false }: NotificationRequest = await req.json();

    console.log("Sending notification for form data:", { email: formData.email, isPartial });

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

    const htmlContent = `
      <h1>${subject}</h1>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>📋 Informations client</h2>
        <p><strong>Type:</strong> ${clientTypeLabel}</p>
        <p><strong>Nom:</strong> ${formData.civilite === "monsieur" ? "M." : formData.civilite === "madame" ? "Mme" : ""} ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Téléphone:</strong> ${formData.phone}</p>
        <p><strong>Adresse:</strong> ${formData.postalCode} ${formData.city}</p>
        
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
        <p><a href="https://raccordement-elec.fr/admin" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir dans le CRM</a></p>
      </div>

      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 14px;">
        Cette notification a été envoyée automatiquement par le système de demandes de raccordement.<br>
        Email du client: ${formData.email}
      </p>
    `;

    const emailResponse = await resend.emails.send({
      from: "Raccordement Connect <noreply@raccordement-connect.com>",
      to: ["bonjour@raccordement-connect.com"],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending notification:", error);
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