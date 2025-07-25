import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Check, Phone, Mail, MapPin, Zap, Building, User, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MobileFormStep {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  field: string;
  type: "input" | "select" | "textarea" | "phone" | "email";
  placeholder?: string;
  options?: string[];
  validation?: (value: string) => boolean;
  required?: boolean;
}

const MOBILE_FORM_STEPS: MobileFormStep[] = [
  {
    id: "client-type",
    title: "Vous êtes ?",
    subtitle: "Sélectionnez votre profil",
    icon: <User className="h-6 w-6" />,
    field: "clientType",
    type: "select",
    options: ["Particulier", "Professionnel", "Collectivité"],
    required: true
  },
  {
    id: "first-name",
    title: "Votre prénom",
    subtitle: "Comment devons-nous vous appeler ?",
    icon: <User className="h-6 w-6" />,
    field: "firstName",
    type: "input",
    placeholder: "Jean",
    required: true
  },
  {
    id: "last-name",
    title: "Votre nom de famille",
    icon: <User className="h-6 w-6" />,
    field: "lastName",
    type: "input",
    placeholder: "Dupont",
    required: true
  },
  {
    id: "email",
    title: "Votre email",
    subtitle: "Pour vous envoyer le devis",
    icon: <Mail className="h-6 w-6" />,
    field: "email",
    type: "email",
    placeholder: "jean.dupont@gmail.com",
    validation: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    required: true
  },
  {
    id: "phone",
    title: "Votre téléphone",
    subtitle: "Pour finaliser votre dossier",
    icon: <Phone className="h-6 w-6" />,
    field: "phone",
    type: "phone",
    placeholder: "06 12 34 56 78",
    validation: (value) => /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(value.replace(/\s/g, "")),
    required: true
  },
  {
    id: "address",
    title: "Adresse des travaux",
    subtitle: "Où souhaitez-vous le raccordement ?",
    icon: <MapPin className="h-6 w-6" />,
    field: "address",
    type: "input",
    placeholder: "123 rue de la République",
    required: true
  },
  {
    id: "postal-code",
    title: "Code postal",
    icon: <MapPin className="h-6 w-6" />,
    field: "postalCode",
    type: "input",
    placeholder: "75001",
    validation: (value) => /^\d{5}$/.test(value),
    required: true
  },
  {
    id: "city",
    title: "Ville",
    icon: <MapPin className="h-6 w-6" />,
    field: "city",
    type: "input",
    placeholder: "Paris",
    required: true
  },
  {
    id: "project-type",
    title: "Type de projet",
    subtitle: "Que souhaitez-vous raccorder ?",
    icon: <Building className="h-6 w-6" />,
    field: "projectType",
    type: "select",
    options: ["Maison neuve", "Installation photovoltaïque", "Modification branchement", "Raccordement industriel"],
    required: true
  },
  {
    id: "power",
    title: "Puissance souhaitée",
    subtitle: "En kVA (si vous le savez)",
    icon: <Zap className="h-6 w-6" />,
    field: "power",
    type: "select",
    options: ["3 kVA", "6 kVA", "9 kVA", "12 kVA", "15 kVA", "18 kVA", "Plus de 18 kVA", "Je ne sais pas"],
    required: true
  },
  {
    id: "comments",
    title: "Informations complémentaires",
    subtitle: "Ajoutez des détails si nécessaire",
    icon: <FileText className="h-6 w-6" />,
    field: "comments",
    type: "textarea",
    placeholder: "Précisions sur votre projet...",
    required: false
  }
];

interface MobileFormData {
  clientType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  projectType: string;
  power: string;
  comments: string;
}

const MobileMultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<MobileFormData>({
    clientType: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    projectType: "",
    power: "",
    comments: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const progress = ((currentStep + 1) / MOBILE_FORM_STEPS.length) * 100;
  const currentStepData = MOBILE_FORM_STEPS[currentStep];

  const validateStep = (step: MobileFormStep, value: string): boolean => {
    if (step.required && !value.trim()) {
      setErrors({ [step.field]: "Ce champ est requis" });
      return false;
    }

    if (step.validation && value && !step.validation(value)) {
      setErrors({ 
        [step.field]: step.type === "email" 
          ? "Email invalide" 
          : step.type === "phone" 
          ? "Numéro de téléphone invalide"
          : "Format invalide"
      });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    const currentValue = formData[currentStepData.field as keyof MobileFormData];
    
    if (!validateStep(currentStepData, currentValue)) {
      return;
    }

    // Trigger Google Ads conversion tracking only on first step
    if (currentStep === 0 && typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
      (window as any).gtag_report_conversion();
    }

    if (currentStep < MOBILE_FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFieldChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [currentStepData.field]: value
    }));
    setErrors({});
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Trigger Google Ads form_submit conversion tracking
      if (typeof window !== 'undefined' && (window as any).gtag_report_form_submit_conversion) {
        (window as any).gtag_report_form_submit_conversion();
      }
      
      // Save to leads_raccordement for CRM
      const { error: crmError } = await supabase
        .from('leads_raccordement')
        .insert({
          type_client: formData.clientType,
          nom: formData.lastName,
          prenom: formData.firstName,
          email: formData.email,
          telephone: formData.phone,
          code_postal: formData.postalCode,
          ville: formData.city,
          adresse_chantier: `${formData.address}, ${formData.postalCode} ${formData.city}`,
          type_projet: formData.projectType,
          puissance: formData.power,
          commentaires: formData.comments || null,
          consent_accepted: true,
          payment_status: "pending"
        });

      if (crmError) {
        console.error('Error saving to CRM:', crmError);
        throw crmError;
      }

      toast.success("Demande envoyée avec succès !");
      
      // Reset form or redirect
      setCurrentStep(0);
      setFormData({
        clientType: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        postalCode: "",
        city: "",
        projectType: "",
        power: "",
        comments: ""
      });
    } catch (error) {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = () => {
    const currentValue = formData[currentStepData.field as keyof MobileFormData];
    const hasError = errors[currentStepData.field];

    switch (currentStepData.type) {
      case "select":
        return (
          <Select value={currentValue} onValueChange={handleFieldChange}>
            <SelectTrigger className={`h-14 text-lg ${hasError ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Sélectionnez une option" />
            </SelectTrigger>
            <SelectContent>
              {currentStepData.options?.map((option) => (
                <SelectItem key={option} value={option} className="text-lg py-3">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "textarea":
        return (
          <Textarea
            value={currentValue}
            onChange={(e) => handleFieldChange(e.target.value)}
            placeholder={currentStepData.placeholder}
            className={`min-h-32 text-lg resize-none ${hasError ? 'border-red-500' : ''}`}
          />
        );

      default:
        return (
          <Input
            type={currentStepData.type === "email" ? "email" : currentStepData.type === "phone" ? "tel" : "text"}
            value={currentValue}
            onChange={(e) => handleFieldChange(e.target.value)}
            placeholder={currentStepData.placeholder}
            className={`h-14 text-lg ${hasError ? 'border-red-500' : ''}`}
            autoFocus
          />
        );
    }
  };

  const canProceed = () => {
    const currentValue = formData[currentStepData.field as keyof MobileFormData];
    return currentStepData.required ? currentValue.trim() !== "" : true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Progress Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-gray-600">
              {currentStep + 1} sur {MOBILE_FORM_STEPS.length}
            </span>
            <div className="w-8" /> {/* Spacer */}
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Step Icon & Title */}
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                {currentStepData.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentStepData.title}
                </h1>
                {currentStepData.subtitle && (
                  <p className="text-gray-600 mt-2">
                    {currentStepData.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Form Field */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Label className="text-lg font-medium text-gray-700">
                    {currentStepData.title}
                    {currentStepData.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </Label>
                  {renderField()}
                  {errors[currentStepData.field] && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors[currentStepData.field]}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Form Summary Preview */}
            {currentStep > 2 && (
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-700 mb-3">Récapitulatif</h3>
                  <div className="space-y-2 text-sm">
                    {formData.firstName && formData.lastName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nom :</span>
                        <span>{formData.firstName} {formData.lastName}</span>
                      </div>
                    )}
                    {formData.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email :</span>
                        <span>{formData.email}</span>
                      </div>
                    )}
                    {formData.projectType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Projet :</span>
                        <span>{formData.projectType}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
        <Button
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className="w-full h-14 text-lg font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Envoi en cours...
            </div>
          ) : currentStep === MOBILE_FORM_STEPS.length - 1 ? (
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Envoyer ma demande
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Continuer
              <ChevronRight className="h-5 w-5" />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MobileMultiStepForm;