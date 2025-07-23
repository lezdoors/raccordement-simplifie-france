import { useEffect, useState } from "react";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PaymentSuccessOptimized = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Process the completed form submission
    const processFormSubmission = async () => {
      try {
        const savedFormData = localStorage.getItem('raccordement-form-data-payment');
        if (!savedFormData) {
          console.log("No form data found in localStorage");
          setIsProcessing(false);
          return;
        }

        const formData = JSON.parse(savedFormData);
        console.log("Processing form submission:", formData.email);

        // Save to both tables - form_submissions (backup) and leads_raccordement (CRM)
        const [formSubmissionResult, leadResult] = await Promise.all([
          // Save to form_submissions (backup)
          supabase.from('form_submissions').upsert({
            id: formData.email,
            client_type: formData.clientType,
            nom: formData.lastName,
            prenom: formData.firstName,
            email: formData.email,
            telephone: formData.phone,
            raison_sociale: formData.companyName,
            siren: formData.siret,
            nom_collectivite: formData.collectivityName,
            siren_collectivite: formData.collectivitySiren,
            ville: formData.city,
            code_postal: formData.postalCode,
            connection_type: formData.connectionType,
            project_type: formData.projectType,
            power_type: formData.powerType,
            power_kva: formData.powerDemanded,
            adresse: `${formData.workStreet}, ${formData.postalCode} ${formData.city}`,
            complement_adresse: formData.workAddressComplement,
            project_status: formData.projectStatus,
            desired_timeline: formData.desiredTimeline,
            form_status: "completed",
            payment_status: "paid",
            different_billing_address: formData.differentBillingAddress || false,
            billing_address: formData.differentBillingAddress ? 
              `${formData.billingStreet}, ${formData.billingPostalCode} ${formData.billingCity}` : null
          }),

          // Save to leads_raccordement (CRM display)
          supabase.from('leads_raccordement').insert({
            type_client: formData.clientType,
            nom: formData.lastName,
            prenom: formData.firstName,
            email: formData.email,
            telephone: formData.phone,
            raison_sociale: formData.companyName,
            siren: formData.siret,
            ville: formData.city,
            code_postal: formData.postalCode,
            type_raccordement: formData.connectionType,
            type_projet: formData.projectType,
            type_alimentation: formData.powerType,
            puissance: formData.powerDemanded,
            adresse_chantier: `${formData.workStreet}, ${formData.postalCode} ${formData.city}`,
            etat_projet: formData.projectStatus,
            delai_souhaite: formData.desiredTimeline,
            assigned_to_email: null,
            form_step: 6, // Final step
            consent_accepted: true,
            payment_status: 'paid'
          })
        ]);

        if (leadResult.error) {
          console.error("Lead raccordement error:", leadResult.error);
          toast.error("Erreur lors de la sauvegarde. Veuillez contacter le support.");
          return;
        }

        // Send email notification
        try {
          const { error: emailError } = await supabase.functions.invoke('notify-admin', {
            body: { 
              formData,
              isPartial: false
            }
          });

          if (emailError) {
            console.error("Email notification error:", emailError);
            // Don't show error to user as the main submission succeeded
          }
        } catch (emailError) {
          console.error("Email notification error:", emailError);
          // Don't show error to user as the main submission succeeded
        }

        // Clear saved data
        localStorage.removeItem('raccordement-form-data-payment');
        localStorage.removeItem('raccordement-form-data');
        
        setProcessed(true);
        console.log("Form submission processed successfully");
        
      } catch (error) {
        console.error("Error processing form submission:", error);
        toast.error("Erreur lors de la sauvegarde. Votre paiement a été effectué. Veuillez contacter le support.");
      } finally {
        setIsProcessing(false);
      }
    };

    processFormSubmission();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Card className="text-center border-0 shadow-2xl">
          <CardContent className="p-12">
            {/* Success Icon */}
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-8">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Paiement confirmé !
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Merci pour votre confiance. Votre demande de raccordement électrique a été enregistrée 
              et sera traitée par notre équipe dans les plus brefs délais.
            </p>

            {/* Processing Status */}
            {isProcessing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-blue-800">⏳ Finalisation de votre demande en cours...</p>
              </div>
            )}
            
            {!isProcessing && processed && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left mb-8 max-w-lg mx-auto">
                <h3 className="font-semibold text-green-800 mb-2">✅ Demande enregistrée avec succès !</h3>
                <ul className="text-green-700 space-y-1 text-sm">
                  <li>• Votre paiement de 129€ TTC a été traité</li>
                  <li>• Votre demande est maintenant dans notre système</li>
                  <li>• Notre équipe a été notifiée automatiquement</li>
                  <li>• Vous recevrez un email de confirmation sous peu</li>
                  <li>• Un expert vous contactera dans les 48h</li>
                  <li>• Le traitement complet prend généralement 2-4 semaines</li>
                </ul>
              </div>
            )}
            
            {!isProcessing && !processed && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left mb-8 max-w-lg mx-auto">
                <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Attention</h3>
                <p className="text-yellow-700 text-sm">
                  Votre paiement a été effectué mais nous n'avons pas pu finaliser automatiquement votre demande. 
                  Veuillez contacter notre équipe à <strong>bonjour@raccordement-elec.fr</strong> en mentionnant cette page.
                </p>
              </div>
            )}

            {/* Next Steps - Only show when not processing */}
            {!isProcessing && (
              <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left max-w-lg mx-auto">
                <h3 className="font-semibold text-gray-900 mb-4">Prochaines étapes :</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                    <span>Vous recevrez un email de confirmation sous quelques minutes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                    <span>Notre équipe analysera votre dossier sous 24-48h</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                    <span>Vous serez contacté pour finaliser les démarches</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Une question ? Contactez-nous :</p>
              <p className="font-semibold text-gray-900">
                <a href="tel:0977405060" className="text-blue-600 hover:text-blue-700">
                  09 77 40 50 60
                </a>
              </p>
              <p className="text-xs text-gray-500">Du lundi au vendredi de 9h à 19h</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Retour à l'accueil
              </Button>
              
              <Button
                onClick={() => navigate("/contact")}
                className="flex items-center gap-2"
              >
                Nous contacter
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <FooterSection />
    </div>
  );
};

export default PaymentSuccessOptimized;