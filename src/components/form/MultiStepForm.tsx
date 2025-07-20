import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StepClientType } from "./steps/StepClientType";
import { StepPersonalInfo } from "./steps/StepPersonalInfo";
import { StepWorkAddress } from "./steps/StepWorkAddress";
import { StepBillingAddress } from "./steps/StepBillingAddress";
import { StepAdditionalInfo } from "./steps/StepAdditionalInfo";
import { StepSummary } from "./steps/StepSummary";

// Form schema
const formSchema = z.object({
  // Step 1: Client Type
  clientType: z.enum(["particulier", "professionnel", "collectivite"]),
  
  // Step 2: Personal/Company Info
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  companyName: z.string().optional(),
  siret: z.string().optional(),
  
  // Step 3: Work Address
  workAddress: z.string().min(1, "L'adresse du chantier est requise"),
  workCity: z.string().min(1, "La ville est requise"),
  workPostalCode: z.string().min(5, "Code postal invalide"),
  
  // Step 4: Billing Address
  sameAsBilling: z.boolean(),
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingPostalCode: z.string().optional(),
  
  // Step 5: Additional Info
  connectionType: z.enum(["definitif", "provisoire", "augmentation", "collectif"]),
  power: z.string().min(1, "La puissance est requise"),
  dwellings: z.string().optional(),
  urgent: z.boolean(),
  comments: z.string().optional(),
  
  // RGPD
  rgpdConsent: z.boolean().refine(val => val === true, "Vous devez accepter le traitement de vos données"),
});

type FormData = z.infer<typeof formSchema>;

const STEPS = [
  { id: 1, title: "Type de demandeur", component: StepClientType },
  { id: 2, title: "Informations personnelles", component: StepPersonalInfo },
  { id: 3, title: "Adresse du chantier", component: StepWorkAddress },
  { id: 4, title: "Adresse de facturation", component: StepBillingAddress },
  { id: 5, title: "Informations complémentaires", component: StepAdditionalInfo },
  { id: 6, title: "Résumé et validation", component: StepSummary },
];

export const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientType: "particulier" as const,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      workAddress: "",
      workCity: "",
      workPostalCode: "",
      sameAsBilling: true,
      connectionType: "definitif" as const,
      power: "",
      urgent: false,
      rgpdConsent: false,
    },
    mode: "onChange",
  });

  const { watch, trigger, getValues } = form;
  const watchedValues = watch();

  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = async () => {
    const stepFields = getStepFields(currentStep);
    const isValid = await trigger(stepFields);
    
    if (isValid) {
      if (currentStep < STEPS.length) {
        setCurrentStep(prev => prev + 1);
        // Auto-save to localStorage
        localStorage.setItem('raccordement-form-data', JSON.stringify(getValues()));
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      // TODO: Send to Supabase when connected
      console.log("Form submitted:", data);
      
      // Clear saved data
      localStorage.removeItem('raccordement-form-data');
      
      // Redirect to thank you page
      navigate("/merci");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const getStepFields = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1:
        return ["clientType"];
      case 2:
        const fields: (keyof FormData)[] = ["firstName", "lastName", "email", "phone"];
        if (watchedValues.clientType === "professionnel") {
          fields.push("companyName", "siret");
        }
        return fields;
      case 3:
        return ["workAddress", "workCity", "workPostalCode"];
      case 4:
        return watchedValues.sameAsBilling 
          ? ["sameAsBilling"] 
          : ["sameAsBilling", "billingAddress", "billingCity", "billingPostalCode"];
      case 5:
        const step5Fields: (keyof FormData)[] = ["connectionType", "power"];
        if (watchedValues.connectionType === "collectif") {
          step5Fields.push("dwellings");
        }
        return step5Fields;
      case 6:
        return ["rgpdConsent"];
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

  return (
    <Card className="p-6 md:p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-foreground">
            Étape {currentStep} sur {STEPS.length}
          </h2>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% complété
          </span>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground mt-2">
          {STEPS[currentStep - 1].title}
        </p>
      </div>

      {/* Step Content */}
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
    </Card>
  );
};