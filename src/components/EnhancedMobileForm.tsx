import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  Zap, 
  Building, 
  User, 
  FileText,
  CreditCard,
  X
} from "lucide-react";
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
  category: "personal" | "location" | "project" | "payment";
}

const MOBILE_FORM_STEPS: MobileFormStep[] = [
  // Personal Information
  {
    id: "client-type",
    title: "Vous êtes ?",
    subtitle: "Sélectionnez votre profil",
    icon: <User className="h-5 w-5" />,
    field: "clientType",
    type: "select",
    options: ["Particulier", "Professionnel", "Collectivité"],
    required: true,
    category: "personal"
  },
  {
    id: "first-name",
    title: "Votre prénom",
    subtitle: "Comment devons-nous vous appeler ?",
    icon: <User className="h-5 w-5" />,
    field: "firstName",
    type: "input",
    placeholder: "Jean",
    required: true,
    category: "personal"
  },
  {
    id: "last-name",
    title: "Votre nom de famille",
    icon: <User className="h-5 w-5" />,
    field: "lastName",
    type: "input",
    placeholder: "Dupont",
    required: true,
    category: "personal"
  },
  {
    id: "email",
    title: "Votre email",
    subtitle: "Pour vous envoyer le devis",
    icon: <Mail className="h-5 w-5" />,
    field: "email",
    type: "email",
    placeholder: "jean.dupont@gmail.com",
    validation: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    required: true,
    category: "personal"
  },
  {
    id: "phone",
    title: "Votre téléphone",
    subtitle: "Pour finaliser votre dossier",
    icon: <Phone className="h-5 w-5" />,
    field: "phone",
    type: "phone",
    placeholder: "06 12 34 56 78",
    validation: (value) => /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(value.replace(/\s/g, "")),
    required: true,
    category: "personal"
  },
  // Location Information
  {
    id: "address",
    title: "Adresse des travaux",
    subtitle: "Où souhaitez-vous le raccordement ?",
    icon: <MapPin className="h-5 w-5" />,
    field: "address",
    type: "input",
    placeholder: "123 rue de la République",
    required: true,
    category: "location"
  },
  {
    id: "postal-code",
    title: "Code postal",
    icon: <MapPin className="h-5 w-5" />,
    field: "postalCode",
    type: "input",
    placeholder: "75001",
    validation: (value) => /^\d{5}$/.test(value),
    required: true,
    category: "location"
  },
  {
    id: "city",
    title: "Ville",
    icon: <MapPin className="h-5 w-5" />,
    field: "city",
    type: "input",
    placeholder: "Paris",
    required: true,
    category: "location"
  },
  // Project Information
  {
    id: "project-type",
    title: "Type de projet",
    subtitle: "Que souhaitez-vous raccorder ?",
    icon: <Building className="h-5 w-5" />,
    field: "projectType",
    type: "select",
    options: ["Maison neuve", "Installation photovoltaïque", "Modification branchement", "Raccordement industriel"],
    required: true,
    category: "project"
  },
  {
    id: "power",
    title: "Puissance souhaitée",
    subtitle: "En kVA (si vous le savez)",
    icon: <Zap className="h-5 w-5" />,
    field: "power",
    type: "select",
    options: ["3 kVA", "6 kVA", "9 kVA", "12 kVA", "15 kVA", "18 kVA", "Plus de 18 kVA", "Je ne sais pas"],
    required: true,
    category: "project"
  },
  {
    id: "comments",
    title: "Informations complémentaires",
    subtitle: "Ajoutez des détails si nécessaire",
    icon: <FileText className="h-5 w-5" />,
    field: "comments",
    type: "textarea",
    placeholder: "Précisions sur votre projet...",
    required: false,
    category: "project"
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

interface EnhancedMobileFormProps {
  onClose?: () => void;
}

const EnhancedMobileForm = ({ onClose }: EnhancedMobileFormProps) => {
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
  const [activeTab, setActiveTab] = useState("personal");

  const progress = ((currentStep + 1) / MOBILE_FORM_STEPS.length) * 100;
  const currentStepData = MOBILE_FORM_STEPS[currentStep];

  // Tab categories
  const categories = [
    { id: "personal", label: "Personnel", steps: MOBILE_FORM_STEPS.filter(s => s.category === "personal").length },
    { id: "location", label: "Adresse", steps: MOBILE_FORM_STEPS.filter(s => s.category === "location").length },
    { id: "project", label: "Projet", steps: MOBILE_FORM_STEPS.filter(s => s.category === "project").length },
  ];

  // Update active tab based on current step
  useEffect(() => {
    if (currentStepData) {
      setActiveTab(currentStepData.category);
    }
  }, [currentStep, currentStepData]);

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

  const handleTabClick = (tabId: string) => {
    const tabSteps = MOBILE_FORM_STEPS.filter(s => s.category === tabId);
    if (tabSteps.length > 0) {
      const firstStepIndex = MOBILE_FORM_STEPS.findIndex(s => s.category === tabId);
      if (firstStepIndex !== -1) {
        setCurrentStep(firstStepIndex);
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create Stripe payment session
      const { data, error } = await supabase.functions.invoke('create-payment-session', {
        body: {
          amount: 99, // €99 for the service
          formData: formData
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No payment URL received');
      }
      
    } catch (error) {
      console.error('Error creating payment session:', error);
      toast.error("Erreur lors de la création du paiement");
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
            <SelectTrigger className={`mobile-input ${hasError ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Sélectionnez une option" />
            </SelectTrigger>
            <SelectContent>
              {currentStepData.options?.map((option) => (
                <SelectItem key={option} value={option} className="text-base py-3">
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
            className={`mobile-input min-h-32 resize-none ${hasError ? 'border-red-500' : ''}`}
          />
        );

      default:
        return (
          <Input
            type={currentStepData.type === "email" ? "email" : currentStepData.type === "phone" ? "tel" : "text"}
            value={currentValue}
            onChange={(e) => handleFieldChange(e.target.value)}
            placeholder={currentStepData.placeholder}
            className={`mobile-input ${hasError ? 'border-red-500' : ''}`}
            autoFocus
          />
        );
    }
  };

  const canProceed = () => {
    const currentValue = formData[currentStepData.field as keyof MobileFormData];
    return currentStepData.required ? currentValue.trim() !== "" : true;
  };

  const getCompletedStepsForCategory = (categoryId: string) => {
    return MOBILE_FORM_STEPS
      .filter(step => step.category === categoryId)
      .filter(step => {
        const value = formData[step.field as keyof MobileFormData];
        return step.required ? value.trim() !== "" : true;
      }).length;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Header with Tabs */}
      <div className="mobile-sticky-header">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
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
            <div className="w-8" />
          </div>
          
          <Progress value={progress} className="h-2 mb-4" />
          
          {/* Navigation Tabs */}
          <Tabs value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              {categories.map((category) => {
                const completed = getCompletedStepsForCategory(category.id);
                const total = category.steps;
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    onClick={() => handleTabClick(category.id)}
                    className="relative text-xs"
                  >
                    <div className="flex items-center gap-1">
                      <span>{category.label}</span>
                      {completed === total && completed > 0 && (
                        <Check className="h-3 w-3 text-green-600" />
                      )}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                    >
                      {completed}/{total}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
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
                <h1 className="mobile-h2 text-gray-900">
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
            <Card className="mobile-card border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium text-gray-700">
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
      <div className="mobile-sticky-footer">
        <Button
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className="mobile-button-primary w-full shadow-lg"
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

export default EnhancedMobileForm;