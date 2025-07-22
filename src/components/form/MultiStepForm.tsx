import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StepPersonalInfo } from "./steps/StepPersonalInfo";
import { StepTechnicalDetails } from "./steps/StepTechnicalDetails";
import { StepFinalValidation } from "./steps/StepFinalValidation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Complete form schema according to specifications
const formSchema = z.object({
  // Step 1: Personal Information
  civilite: z.enum(["monsieur", "madame"]),
  clientType: z.enum(["particulier", "professionnel", "collectivite"]),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string()
    .min(10, "Le numéro de téléphone doit contenir 10 chiffres")
    .regex(/^[0-9]{10}$/, "Format de téléphone invalide"),
  postalCode: z.string()
    .min(5, "Le code postal doit contenir 5 chiffres")
    .max(5, "Le code postal doit contenir 5 chiffres")
    .regex(/^[0-9]{5}$/, "Code postal invalide"),
  city: z.string().min(1, "La ville est requise"),
  companyName: z.string().optional(),
  siret: z.string().optional(),
  collectivityName: z.string().optional(),
  collectivitySiren: z.string().optional(),
  
  // Step 2: Technical Details
  connectionType: z.enum([
    "raccordement_enedis_definitif",
    "raccordement_provisoire", 
    "viabilisation_terrain",
    "modification_raccordement",
    "raccordement_collectif",
    "raccordement_photovoltaique"
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
  workAddress: z.string().min(1, "L'adresse complète du chantier est requise"),
  pdlNumber: z.string().optional(),
  
  // Step 3: Final Validation
  projectStatus: z.string().min(1, "L'état du projet est requis"),
  desiredTimeline: z.string().min(1, "Le délai souhaité est requis"),
  billingType: z.enum(["personnel", "societe"]),
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
  const navigate = useNavigate();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      civilite: "monsieur" as const,
      clientType: "particulier" as const,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      postalCode: "",
      city: "",
      connectionType: "raccordement_enedis_definitif" as const,
      projectType: "maison_individuelle" as const,
      powerType: "monophase" as const,
      powerDemanded: "",
      workAddress: "",
      projectStatus: "",
      desiredTimeline: "",
      billingType: "personnel" as const,
      consent: false,
    },
    mode: "onChange",
  });

  const { watch, trigger, getValues } = form;
  const watchedValues = watch();

  // French flag colors for progress bar
  const getStepColor = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      // Completed steps: French flag colors
      switch ((stepIndex - 1) % 3) {
        case 0: return "bg-blue-100"; // Light blue for French blue
        case 1: return "bg-gray-50"; // Light cream for French white  
        case 2: return "bg-red-50"; // Light rose for French red
        default: return "bg-blue-100";
      }
    } else if (stepIndex === currentStep) {
      // Current step: slightly darker version
      switch ((stepIndex - 1) % 3) {
        case 0: return "bg-blue-200 border-blue-300";
        case 1: return "bg-gray-100 border-gray-300";
        case 2: return "bg-red-100 border-red-300";
        default: return "bg-blue-200 border-blue-300";
      }
    } else {
      // Incomplete steps
      return "bg-gray-100";
    }
  };

  const handleNext = async () => {
    const stepFields = getStepFields(currentStep);
    const isValid = await trigger(stepFields);
    
    if (isValid) {
      if (currentStep < STEPS.length) {
        // Auto-save to Supabase on step completion
        await autoSaveToSupabase();
        setCurrentStep(prev => prev + 1);
        localStorage.setItem('raccordement-form-data', JSON.stringify(getValues()));
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const autoSaveToSupabase = async () => {
    try {
      const data = getValues();
      await supabase
        .from('form_submissions')
        .upsert({
          id: data.email, // Use email as unique identifier for upserts
          client_type: data.clientType,
          nom: data.lastName,
          prenom: data.firstName,
          email: data.email,
          telephone: data.phone,
          raison_sociale: data.companyName,
          siren: data.siret,
          nom_collectivite: data.collectivityName,
          siren_collectivite: data.collectivitySiren,
          ville: data.city,
          code_postal: data.postalCode,
          connection_type: data.connectionType,
          project_type: data.projectType,
          power_type: data.powerType,
          power_kva: data.powerDemanded,
          adresse: data.workAddress,
          project_status: data.projectStatus,
          desired_timeline: data.desiredTimeline,
          form_status: "in_progress",
          payment_status: "pending"
        });
    } catch (error) {
      console.error("Auto-save error:", error);
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      // Final save to Supabase
      const { error } = await supabase
        .from('form_submissions')
        .upsert({
          id: data.email,
          client_type: data.clientType,
          nom: data.lastName,
          prenom: data.firstName,
          email: data.email,
          telephone: data.phone,
          raison_sociale: data.companyName,
          siren: data.siret,
          nom_collectivite: data.collectivityName,
          siren_collectivite: data.collectivitySiren,
          ville: data.city,
          code_postal: data.postalCode,
          connection_type: data.connectionType,
          project_type: data.projectType,
          power_type: data.powerType,
          power_kva: data.powerDemanded,
          adresse: data.workAddress,
          project_status: data.projectStatus,
          desired_timeline: data.desiredTimeline,
          form_status: "completed",
          payment_status: "pending"
        });

      if (error) {
        console.error("Supabase error:", error);
        toast.error("Erreur lors de l'envoi de votre demande. Veuillez réessayer.");
        return;
      }

      // Clear saved data
      localStorage.removeItem('raccordement-form-data');
      
      toast.success("Votre demande a été envoyée avec succès !");
      
      // Redirect to thank you page
      navigate("/merci");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const getStepFields = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1:
        const step1Fields: (keyof FormData)[] = ["civilite", "clientType", "firstName", "lastName", "email", "phone", "postalCode", "city"];
        if (watchedValues.clientType === "professionnel") {
          step1Fields.push("companyName", "siret");
        } else if (watchedValues.clientType === "collectivite") {
          step1Fields.push("collectivityName", "collectivitySiren");
        }
        return step1Fields;
      case 2:
        return ["connectionType", "projectType", "powerType", "powerDemanded", "workAddress"];
      case 3:
        return ["projectStatus", "desiredTimeline", "billingType", "consent"];
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
    <Card className="p-6 md:p-8">
      {/* French Flag Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Étape {currentStep} sur {STEPS.length}
          </h2>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% complété
          </span>
        </div>
        
        {/* Custom French Flag Progress Bar */}
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold
                ${getStepColor(step.id)}
                ${step.id === currentStep ? 'ring-2 ring-offset-2 ring-primary' : ''}
              `}>
                <span className="text-white">{step.id}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`
                  h-1 w-16 mx-2
                  ${step.id < currentStep ? getStepColor(step.id).replace('bg-', 'bg-').replace('-100', '-300') : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        
        <p className="text-sm text-muted-foreground text-center">
          {STEPS[currentStep - 1].title}
        </p>
      </div>

      {/* Step Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="min-h-[400px]">
            {getCurrentComponent()}
          </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </Button>

          {isLastStep ? (
            <Button
              type="submit"
              className="flex items-center gap-2"
              disabled={!form.formState.isValid}
            >
              Envoyer ma demande
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
        </form>
      </Form>
    </Card>
  );
};