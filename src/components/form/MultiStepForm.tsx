import { useEffect, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAnalytics } from "@/hooks/use-analytics";
// import { useSwipeNavigation } from "@/hooks/use-swipe-navigation";
// import { MobileFormProgressIndicator } from "@/components/mobile/MobileFormProgressIndicator";

import { StepClientType } from "./steps/StepClientType";
import { StepPersonalInfo } from "./steps/StepPersonalInfo";
import { StepWorkAddress } from "./steps/StepWorkAddress";
import { StepBillingAddress } from "./steps/StepBillingAddress";
import { StepTechnicalDetails } from "./steps/StepTechnicalDetails";
import { StepAdditionalInfo } from "./steps/StepAdditionalInfo";
import { StepFinalValidation } from "./steps/StepFinalValidation";
import { supabase } from "@/integrations/supabase/client";

// Complete form schema according to updated specifications
const formSchema = z.object({
  // Step 1: Personal Information
  civilite: z.enum(["monsieur", "madame", "autre"]),
  clientType: z.enum(["particulier", "professionnel", "collectivite"]),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string()
    .min(10, "Le numéro de téléphone doit contenir 10 chiffres")
    .regex(/^0[1-9][0-9]{8}$/, "Format de téléphone français invalide (ex: 0123456789)"),
  postalCode: z.string()
    .min(5, "Le code postal doit contenir 5 chiffres")
    .max(5, "Le code postal doit contenir 5 chiffres")
    .regex(/^[0-9]{5}$/, "Code postal invalide"),
  city: z.string().min(1, "La ville est requise"),
  companyName: z.string().optional(),
  siret: z.string().optional(),
  collectivityName: z.string().optional(),
  collectivitySiren: z.string().optional(),
  
  // Step 2: Technical Details - Updated address structure
  connectionType: z.enum([
    "nouveau_raccordement",
    "augmentation_puissance",
    "raccordement_provisoire",
    "deplacement_compteur",
    "autre_demande"
  ]),
  projectType: z.enum([
    "maison_individuelle",
    "immeuble_collectif", 
    "local_commercial",
    "batiment_industriel",
    "terrain_nu"
  ]),
  powerType: z.enum(["monophase", "triphase", "je_ne_sais_pas"]),
  powerDemanded: z.string().min(1, "La puissance demandée est requise"),
  workStreet: z.string().min(1, "L'adresse de la rue est requise"),
  workAddressComplement: z.string().optional(),
  // Billing address fields
  differentBillingAddress: z.boolean().optional(),
  billingStreet: z.string().optional(),
  billingPostalCode: z.string().optional(),
  billingCity: z.string().optional(),
  // Work address uses the same postal code and city from step 1
  
  // Step 3: Final Validation - Removed billingType
  projectStatus: z.string().min(1, "L'état du projet est requis"),
  desiredTimeline: z.string().min(1, "Le délai souhaité est requis"),
  consent: z.boolean().refine(val => val === true, "Vous devez accepter les conditions"),
}).refine((data) => {
  // Conditional validation for professional fields
  if (data.clientType === "professionnel") {
    return !!data.companyName && !!data.siret;
  }
  return true;
}, {
  message: "La raison sociale et le SIREN sont requis pour les professionnels",
  path: ["companyName"],
}).refine((data) => {
  // Conditional validation for collectivity fields
  if (data.clientType === "collectivite") {
    return !!data.collectivityName && !!data.collectivitySiren;
  }
  return true;
}, {
  message: "Le nom de la collectivité et le SIREN sont requis",
  path: ["collectivityName"],
});

type FormData = z.infer<typeof formSchema>;

const STEPS = [
  { id: 1, title: "Informations personnelles", component: StepPersonalInfo },
  { id: 2, title: "Détails techniques", component: StepTechnicalDetails },
  { id: 3, title: "Validation finale", component: StepFinalValidation },
];

export const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedData, setSavedData] = useState<Partial<FormData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasTrackedFormStart, setHasTrackedFormStart] = useState(false);
  const isMobile = useIsMobile();
  const { trackFormStart, trackFormSubmit } = useAnalytics();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      civilite: "" as any,
      clientType: "" as any,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      postalCode: "",
      city: "",
      connectionType: "" as any,
      projectType: "" as any,
      powerType: "" as any,
      powerDemanded: "",
      workStreet: "",
      workAddressComplement: "",
      differentBillingAddress: false,
      billingStreet: "",
      billingPostalCode: "",
      billingCity: "",
      projectStatus: "",
      desiredTimeline: "",
      consent: false,
    },
    mode: "onChange",
  });


  const { watch, trigger, getValues } = form;
  const watchedValues = watch();

  // Load saved data on component mount
  useEffect(() => {
    const saved = localStorage.getItem('raccordement-form-data');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setSavedData(parsedData);
        form.reset(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, [form]);

  // Auto-save form data
  const autoSave = useCallback(() => {
    const data = getValues();
    localStorage.setItem('raccordement-form-data', JSON.stringify(data));
  }, [getValues]);

  // Auto-save on form changes
  useEffect(() => {
    const subscription = watch(() => autoSave());
    return () => subscription.unsubscribe();
  }, [watch, autoSave]);

  const autoSaveToSupabase = async () => {
    try {
      const data = getValues();
      
      // Check for existing record in leads_raccordement table (what CRM uses)
      const { data: existingRecord, error: selectError } = await supabase
        .from('leads_raccordement')
        .select('id')
        .eq('email', data.email)
        .maybeSingle();

      const submissionData = {
        civilite: data.civilite || '',
        type_client: data.clientType,
        nom: data.lastName,
        prenom: data.firstName,
        email: data.email,
        telephone: data.phone,
        raison_sociale: data.companyName || null,
        siren: data.siret || data.collectivitySiren || null,
        code_postal: data.postalCode || '',
        ville: data.city || '',
        type_raccordement: data.connectionType || null,
        type_projet: data.projectType || null,
        type_alimentation: data.powerType || null,
        puissance: data.powerDemanded || null,
        adresse_chantier: data.workStreet ? `${data.workStreet}, ${data.postalCode || ''} ${data.city || ''}` : `${data.postalCode || ''} ${data.city || ''}`,
        etat_projet: data.projectStatus || 'nouveau',
        delai_souhaite: data.desiredTimeline || null,
        commentaires: null,
        consent_accepted: data.consent || false,
        form_step: currentStep,
        form_type: currentStep === 1 ? 'step1' : 'full',
        amount: 12980, // €129.80 in cents - CORRECTED PRICE
        payment_status: "pending",
        updated_at: new Date().toISOString()
      };

      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('leads_raccordement')
          .update(submissionData)
          .eq('id', existingRecord.id);
          
        if (updateError) {
          console.error("Update error:", updateError);
        } else {
          console.log("Successfully updated existing lead");
        }
      } else {
        // Insert new record
        const { data: insertResult, error: insertError } = await supabase
          .from('leads_raccordement')
          .insert(submissionData)
          .select('id')
          .single();
          
        if (insertError) {
          console.error("Insert error:", insertError);
        } else {
          console.log("Successfully created new lead:", insertResult.id);
        }
      }

      // Send notification email for all step 1 submissions and full submissions
      if (currentStep === 1 || currentStep === STEPS.length) {
        try {
          await supabase.functions.invoke('notify-team-message', {
            body: {
              name: `${data.firstName} ${data.lastName}`,
              email: data.email,
              phone: data.phone,
              message: currentStep === 1 ? 
                `Demande partielle (Étape 1) - Type: ${data.clientType || 'Non spécifié'}, Raccordement: ${data.connectionType || 'Non spécifié'}` :
                `Demande complète - Type: ${data.clientType}, Raccordement: ${data.connectionType}, Projet: ${data.projectType}`,
              request_type: currentStep === 1 ? 'step1' : 'full'
            }
          });
        } catch (emailError) {
          console.error("Email notification error:", emailError);
        }
      }
    } catch (error) {
      console.error("Auto-save error:", error);
    }
  };

  const handleNext = async () => {
    const stepFields = getStepFields(currentStep);
    const isValid = await trigger(stepFields);
    
    if (isValid) {
      setIsLoading(true);
      
      // Track Google Ads "Form Started" conversion only after step 1 completion (once per session)
      if (currentStep === 1 && !hasTrackedFormStart) {
        trackFormStart();
        setHasTrackedFormStart(true);
      }
      
      if (currentStep < STEPS.length) {
        // Save locally immediately for fast navigation
        localStorage.setItem('raccordement-form-data', JSON.stringify(getValues()));
        
        // Auto-save to Supabase in background (non-blocking)
        autoSaveToSupabase().catch(error => 
          console.warn('Background save failed:', error)
        );
        
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setIsLoading(false);
        }, 300); // Small delay for better UX
      }
    } else {
      toast.error("Veuillez corriger les erreurs avant de continuer");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsLoading(false);
      }, 200);
    }
  };

  // TEMPORARILY DISABLED - Swipe navigation (might be causing freezing)
  // const swipeRef = useSwipeNavigation({
  //   onSwipeLeft: () => {
  //     if (currentStep < STEPS.length) handleNext();
  //   },
  //   onSwipeRight: () => {
  //     if (currentStep > 1) handlePrevious();
  //   },
  //   disabled: isSubmitting || isLoading
  // });

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      console.log("🚀 Starting form submission...", data);
      
      // Validate all required fields are present
      if (!data.consent) {
        toast.error("Vous devez accepter les conditions pour continuer");
        setIsSubmitting(false);
        return;
      }
      
      if (!data.email || !data.firstName || !data.lastName) {
        toast.error("Les informations personnelles sont incomplètes");
        setIsSubmitting(false);
        return;
      }
      
      // First save the data to Supabase
      await autoSaveToSupabase();
      
      console.log("📤 Creating payment session...");
      
      // Track Google Ads "Form Submit" conversion before Stripe redirect
      trackFormSubmit();
      
      // Create payment session and redirect directly to Stripe
      const { data: paymentData, error } = await supabase.functions.invoke('create-payment-session', {
        body: { 
          amount: 12980, // €129.80 in cents - CORRECTED PRICE
          formData: data
        }
      });

      if (error) {
        console.error("❌ Payment session error:", error);
        throw new Error(`Erreur de paiement: ${error.message || 'Problème de connexion'}`);
      }
      
      if (!paymentData?.url) {
        throw new Error("URL de paiement non reçue");
      }

      console.log("✅ Payment session created, redirecting to Stripe...");

      // Save form data one more time with stripe session
      localStorage.setItem('form-submission-data', JSON.stringify({
        ...data,
        stripeSessionId: paymentData.sessionId,
        timestamp: new Date().toISOString()
      }));
      
      // Clear the form data from localStorage since we're redirecting
      localStorage.removeItem('raccordement-form-data');
      
      // Show success message briefly before redirect
      toast.success("Redirection vers le paiement...");
      
      // Small delay to ensure data is saved
      setTimeout(() => {
        window.location.href = paymentData.url;
      }, 500);
      
    } catch (error) {
      console.error("❌ Form submission error:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Une erreur inattendue s'est produite";
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };


  const getStepFields = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1:
        const step1Fields: (keyof FormData)[] = ["civilite", "clientType", "firstName", "lastName", "email", "phone"];
        if (watchedValues.clientType === "professionnel") {
          step1Fields.push("companyName", "siret");
        } else if (watchedValues.clientType === "collectivite") {
          step1Fields.push("collectivityName", "collectivitySiren");
        }
        return step1Fields;
      case 2:
        const step2Fields: (keyof FormData)[] = ["connectionType", "projectType", "powerType", "powerDemanded", "workStreet", "postalCode", "city"];
        if (watchedValues.differentBillingAddress) {
          step2Fields.push("billingStreet", "billingPostalCode", "billingCity");
        }
        return step2Fields;
      case 3:
        return ["projectStatus", "desiredTimeline", "consent"];
      default:
        return [];
    }
  };

  const getCurrentComponent = () => {
    const StepComponent = STEPS[currentStep - 1].component;
    return <StepComponent form={form} />;
  };

  const isLastStep = currentStep === STEPS.length;
  const isFirstStep = currentStep === 1;

  const progress = (currentStep / STEPS.length) * 100;


  return (
    <div className="min-h-screen bg-background">
      {/* Simple Mobile Progress Bar - Fixed top positioning */}
      <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b shadow-sm">
        <div className="px-4 py-4 safe-area-top">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">
              Étape {currentStep} sur {STEPS.length}
            </span>
            <span className="text-xs text-muted-foreground">
              {Math.round(progress)}% complété
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 progress-animated" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {STEPS[currentStep - 1]?.title}
          </p>
        </div>
      </div>

      {/* Add padding for mobile CTA */}
      <div className="container mx-auto px-4 py-4 md:py-8 pb-32 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-4 md:p-6 lg:p-8">
            {/* Desktop Progress Indicator */}
            <div className="hidden md:block mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Étape {currentStep} sur {STEPS.length}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}% complété
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`
                      w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold
                      ${step.id <= currentStep 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-muted text-muted-foreground border-muted'
                      }
                      ${step.id === currentStep ? 'ring-2 ring-offset-2 ring-primary' : ''}
                    `}>
                      {step.id}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={`
                        h-1 w-16 mx-2
                        ${step.id < currentStep ? 'bg-primary' : 'bg-muted'}
                      `} />
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground text-center">
                {STEPS[currentStep - 1].title}
              </p>
            </div>

            {/* Step Content - Simplified */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 md:space-y-8">
                <div className="min-h-[400px] px-2 md:px-0 relative">
                  <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                    {getCurrentComponent()}
                  </div>
                  
                  {/* Simple loading overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                      <div className="text-primary text-sm">Chargement...</div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons - Mobile optimized */}
                <div className="flex flex-col md:flex-row justify-between gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isFirstStep}
                    className="flex items-center justify-center gap-2 w-full md:w-auto order-2 md:order-1 h-12 mobile-button"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>

                  {isLastStep ? (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto order-1 md:order-2 h-12 mobile-button font-semibold"
                      style={{ background: 'linear-gradient(90deg, #FFD77A 0%, #F2B736 100%)', color: '#1E1E1E' }}
                    >
                      {isSubmitting ? 'Finalisation...' : 'Finaliser ma demande'}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={isLoading}
                      className="w-full md:w-auto order-1 md:order-2 h-12 mobile-button font-semibold"
                      style={{ background: 'linear-gradient(90deg, #FFD77A 0%, #F2B736 100%)', color: '#1E1E1E' }}
                    >
                      {isLoading ? 'Chargement...' : 'Continuer'}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};