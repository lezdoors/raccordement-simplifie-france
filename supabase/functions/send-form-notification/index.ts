import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'mini-form' | 'full-form';
  data: {
    email: string;
    phone: string;
    projectType: string;
    city?: string;
    firstName?: string;
    lastName?: string;
    timestamp: string;
    [key: string]: any;
  };
}

const getProjectTypeLabel = (type: string): string => {
  const types: Record<string, string> = {
    definitif: "Raccordement définitif",
    provisoire: "Raccordement provisoire", 
    augmentation: "Modification de puissance",
    collectif: "Raccordement collectif",
    photovoltaique: "Raccordement photovoltaïque"
  };
  return types[type] || type;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: NotificationRequest = await req.json();
    
    console.log("Processing notification request:", { type, data });

    const projectTypeLabel = getProjectTypeLabel(data.projectType);
    const formattedDate = new Date(data.timestamp).toLocaleString('fr-FR');
    
    // Email content based on form type
    let subject: string;
    let htmlContent: string;
    
    if (type === 'mini-form') {
      subject = `🔌 Nouvelle demande mini-formulaire - ${projectTypeLabel}`;
      htmlContent = `
        <h2>Nouvelle demande via le mini-formulaire</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Détails du contact:</h3>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Téléphone:</strong> ${data.phone}</p>
          <p><strong>Type de projet:</strong> ${projectTypeLabel}</p>
          <p><strong>Ville:</strong> ${data.city || 'Non spécifiée'}</p>
          <p><strong>Date de soumission:</strong> ${formattedDate}</p>
        </div>
        <p>Le client a commencé sa demande via le mini-formulaire et va être redirigé vers le formulaire principal.</p>
        <p style="color: #e74c3c;"><strong>Action requise:</strong> Suivre le client pour finaliser sa demande.</p>
      `;
    } else {
      subject = `📋 Demande complète soumise - ${projectTypeLabel}`;
      htmlContent = `
        <h2>Nouvelle demande complète reçue</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Informations client:</h3>
          <p><strong>Nom:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Téléphone:</strong> ${data.phone}</p>
          <p><strong>Type de projet:</strong> ${projectTypeLabel}</p>
          <p><strong>Ville:</strong> ${data.city || 'Non spécifiée'}</p>
          <p><strong>Date de soumission:</strong> ${formattedDate}</p>
        </div>
        <p>Une demande complète a été soumise et enregistrée dans la base de données.</p>
        <p style="color: #27ae60;"><strong>Action requise:</strong> Traiter la demande et contacter le client.</p>
      `;
    }

    // Send notification email to admin
    const emailResponse = await resend.emails.send({
      from: "Raccordement.com <notifications@raccordement.com>",
      to: ["admin@raccordement.com"], // Replace with your admin email
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
    console.error("Error in send-form-notification function:", error);
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