import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, CheckCircle, Loader2, X, User, MapPin, FileText, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MobileOptimizedInput } from "@/components/ui/mobile-optimized-input";

interface FormData {
  civilite: string;
  clientType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  siret?: string;
  postalCode: string;
  city: string;
  workStreet: string;
  connectionType: string;
  projectType: string;
  powerType: string;
  powerDemanded: string;
  projectStatus: string;
  desiredTimeline: string;
  additionalComments?: string;
  consent: boolean;
}

interface MobileFormFixedProps {
  onClose?: () => void;
}

const STEPS = [
  {
    id: 1,
    title: "Informations personnelles",
    subtitle: "Qui êtes-vous ?",
    icon: User,
    fields: ['civilite', 'clientType', 'firstName', 'lastName', 'email', 'phone', 'companyName', 'siret']
  },
  {
    id: 2, 
    title: "Adresse des travaux",
    subtitle: "Où se situent vos travaux ?",
    icon: MapPin,
    fields: ['postalCode', 'city', 'workStreet']
  },
  {
    id: 3,
    title: "Détails du projet", 
    subtitle: "Parlez-nous de votre projet",
    icon: FileText,
    fields: ['connectionType', 'projectType', 'powerType', 'powerDemanded', 'projectStatus', 'desiredTimeline', 'additionalComments', 'consent']
  }
];

const MobileFormFixed = ({ onClose }: MobileFormFixedProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    civilite: "",
    clientType: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    siret: "",
    postalCode: "",
    city: "",
    workStreet: "",
    connectionType: "",
    projectType: "",
    powerType: "",
    powerDemanded: "",
    projectStatus: "",
    desiredTimeline: "",
    additionalComments: "",
    consent: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Auto-complete city when postal code is entered
  useEffect(() => {
    const fetchCity = async () => {
      if (formData.postalCode && formData.postalCode.length === 5) {
        try {
          const response = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${formData.postalCode}`);
          const data = await response.json();
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, city: data[0].nom }));
          }
        } catch (error) {
          console.error('Erreur récupération ville:', error);
        }
      }
    };
    fetchCity();
  }, [formData.postalCode]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.civilite) newErrors.civilite = "Civilité requise";
      if (!formData.clientType) newErrors.clientType = "Type de client requis";
      if (!formData.firstName) newErrors.firstName = "Prénom requis";
      if (!formData.lastName) newErrors.lastName = "Nom requis";
      if (!formData.email) newErrors.email = "Email requis";
      if (!formData.phone) newErrors.phone = "Téléphone requis";

      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Email invalide";
      }

      if (formData.phone && !/^((\+33|0)[1-9])(\d{2}){4}$/.test(formData.phone.replace(/\s/g, ""))) {
        newErrors.phone = "Numéro de téléphone invalide";
      }

      if (formData.clientType === "professionnel") {
        if (!formData.companyName) newErrors.companyName = "Raison sociale requise";
        if (!formData.siret) newErrors.siret = "SIRET requis";
      }
    }

    if (step === 2) {
      if (!formData.postalCode) newErrors.postalCode = "Code postal requis";
      if (!formData.city) newErrors.city = "Ville requise";
      if (!formData.workStreet) newErrors.workStreet = "Adresse des travaux requise";

      if (formData.postalCode && !/^\d{5}$/.test(formData.postalCode)) {
        newErrors.postalCode = "Code postal invalide (5 chiffres)";
      }
    }

    if (step === 3) {
      if (!formData.connectionType) newErrors.connectionType = "Type de raccordement requis";
      if (!formData.projectType) newErrors.projectType = "Type de projet requis";
      if (!formData.powerType) newErrors.powerType = "Type d'alimentation requis";
      if (!formData.powerDemanded) newErrors.powerDemanded = "Puissance requise";
      if (!formData.projectStatus) newErrors.projectStatus = "État du projet requis";
      if (!formData.desiredTimeline) newErrors.desiredTimeline = "Délai souhaité requis";
      if (!formData.consent) newErrors.consent = "Vous devez accepter les conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      const errorCount = Object.keys(errors).length;
      toast.error(`Veuillez corriger ${errorCount} erreur${errorCount > 1 ? 's' : ''}`);
      return;
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setShowSuccess(true);

    try {
      await supabase.from('leads_raccordement').upsert({
        email: formData.email,
        civilite: formData.civilite,
        type_client: formData.clientType,
        nom: formData.lastName,
        prenom: formData.firstName,
        telephone: formData.phone,
        raison_sociale: formData.companyName || null,
        siren: formData.siret || null,
        code_postal: formData.postalCode,
        ville: formData.city,
        adresse_chantier: `${formData.workStreet}, ${formData.postalCode} ${formData.city}`,
        type_raccordement: formData.connectionType,
        type_projet: formData.projectType,
        type_alimentation: formData.powerType,
        puissance: formData.powerDemanded,
        etat_projet: formData.projectStatus,
        delai_souhaite: formData.desiredTimeline,
        commentaires: formData.additionalComments || null,
        consent_accepted: formData.consent,
        form_step: 3,
        payment_status: "pending"
      }, { onConflict: 'email' });

      toast.success("✅ Votre demande a bien été soumise. Redirection vers le paiement en cours...");

      const { data, error } = await supabase.functions.invoke('create-payment-session', {
        body: {
          amount: 12900,
          formData: formData
        }
      });

      if (error) throw error;

      if (data?.url) {
        setTimeout(() => {
          window.location.href = data.url;
        }, 1500);
      } else {
        throw new Error('No payment URL received');
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Une erreur s'est produite lors de la soumission");
      setIsSubmitting(false);
      setShowSuccess(false);
    }
  };

  const getStepProgress = () => {
    const currentStepData = STEPS.find(s => s.id === currentStep);
    if (!currentStepData) return { filled: 0, total: 0 };
    
    const requiredFields = currentStepData.fields.filter(field => {
      if (currentStep === 1 && formData.clientType !== "professionnel" && (field === 'companyName' || field === 'siret')) {
        return false;
      }
      if (field === 'additionalComments') return false;
      return true;
    });
    
    const filledFields = requiredFields.filter(field => {
      const value = formData[field as keyof FormData];
      return field === 'consent' ? value === true : value && value.toString().length > 0;
    });
    
    return { filled: filledFields.length, total: requiredFields.length };
  };

  const renderStepContent = () => {
    const currentStepData = STEPS.find(s => s.id === currentStep);
    if (!currentStepData) return null;
    
    const IconComponent = currentStepData.icon;
    const progress = getStepProgress();

    return (
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Step Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto shadow-lg">
            <IconComponent className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {currentStepData.title}
            </h2>
            <p className="text-muted-foreground mt-1">
              {currentStepData.subtitle}
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <span>{progress.filled}/{progress.total} champs remplis</span>
            <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(progress.filled / progress.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-6">
            {currentStep === 1 && (
              <>
                <div>
                  <Label className="text-base font-medium">Civilité *</Label>
                  <Select value={formData.civilite} onValueChange={(value) => handleInputChange('civilite', value)}>
                    <SelectTrigger className={`h-14 text-base ${errors.civilite ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Sélectionner votre civilité" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="monsieur">Monsieur</SelectItem>
                      <SelectItem value="madame">Madame</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.civilite && <p className="text-destructive text-sm mt-1">{errors.civilite}</p>}
                </div>

                <div>
                  <Label className="text-base font-medium">Type de client *</Label>
                  <Select value={formData.clientType} onValueChange={(value) => handleInputChange('clientType', value)}>
                    <SelectTrigger className={`h-14 text-base ${errors.clientType ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Sélectionner le type de client" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="particulier">Particulier</SelectItem>
                      <SelectItem value="professionnel">Professionnel</SelectItem>
                      <SelectItem value="collectivite">Collectivité</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.clientType && <p className="text-destructive text-sm mt-1">{errors.clientType}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <MobileOptimizedInput
                    label="Prénom *"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Jean"
                    error={errors.firstName}
                    touched={touchedFields.firstName}
                    required
                  />
                  <MobileOptimizedInput
                    label="Nom *"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Dupont"
                    error={errors.lastName}
                    touched={touchedFields.lastName}
                    required
                  />
                </div>

                <MobileOptimizedInput
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="jean.dupont@email.com"
                  error={errors.email}
                  touched={touchedFields.email}
                  required
                />

                <MobileOptimizedInput
                  label="Téléphone *"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="06 12 34 56 78"
                  error={errors.phone}
                  touched={touchedFields.phone}
                  required
                />

                <AnimatePresence>
                  {formData.clientType === "professionnel" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6"
                    >
                      <MobileOptimizedInput
                        label="Raison sociale *"
                        value={formData.companyName || ""}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Nom de l'entreprise"
                        error={errors.companyName}
                        touched={touchedFields.companyName}
                        required
                      />
                      <MobileOptimizedInput
                        label="SIRET *"
                        value={formData.siret || ""}
                        onChange={(e) => handleInputChange('siret', e.target.value)}
                        placeholder="12345678901234"
                        error={errors.siret}
                        touched={touchedFields.siret}
                        required
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {currentStep === 2 && (
              <>
                <MobileOptimizedInput
                  label="Code postal *"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="75001"
                  error={errors.postalCode}
                  touched={touchedFields.postalCode}
                  required
                />

                <MobileOptimizedInput
                  label="Ville *"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Paris"
                  error={errors.city}
                  touched={touchedFields.city}
                  required
                />

                <MobileOptimizedInput
                  label="Adresse des travaux *"
                  value={formData.workStreet}
                  onChange={(e) => handleInputChange('workStreet', e.target.value)}
                  placeholder="123 rue de la République"
                  error={errors.workStreet}
                  touched={touchedFields.workStreet}
                  required
                />
              </>
            )}

            {currentStep === 3 && (
              <>
                <div>
                  <Label className="text-base font-medium">Type de raccordement *</Label>
                  <Select value={formData.connectionType} onValueChange={(value) => handleInputChange('connectionType', value)}>
                    <SelectTrigger className={`h-14 text-base ${errors.connectionType ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="nouveau">Nouveau raccordement</SelectItem>
                      <SelectItem value="modification">Modification</SelectItem>
                      <SelectItem value="augmentation">Augmentation puissance</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.connectionType && <p className="text-destructive text-sm mt-1">{errors.connectionType}</p>}
                </div>

                <div>
                  <Label className="text-base font-medium">Type de projet *</Label>
                  <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                    <SelectTrigger className={`h-14 text-base ${errors.projectType ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Sélectionner le projet" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="maison">Maison individuelle</SelectItem>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="commerce">Commerce</SelectItem>
                      <SelectItem value="bureau">Bureau</SelectItem>
                      <SelectItem value="photovoltaique">Installation photovoltaïque</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.projectType && <p className="text-destructive text-sm mt-1">{errors.projectType}</p>}
                </div>

                <div>
                  <Label className="text-base font-medium">Type d'alimentation *</Label>
                  <Select value={formData.powerType} onValueChange={(value) => handleInputChange('powerType', value)}>
                    <SelectTrigger className={`h-14 text-base ${errors.powerType ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="monophase">Monophasé</SelectItem>
                      <SelectItem value="triphase">Triphasé</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.powerType && <p className="text-destructive text-sm mt-1">{errors.powerType}</p>}
                </div>

                <div>
                  <Label className="text-base font-medium">Puissance demandée *</Label>
                  <Select value={formData.powerDemanded} onValueChange={(value) => handleInputChange('powerDemanded', value)}>
                    <SelectTrigger className={`h-14 text-base ${errors.powerDemanded ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Sélectionner la puissance" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="3kva">3 kVA</SelectItem>
                      <SelectItem value="6kva">6 kVA</SelectItem>
                      <SelectItem value="9kva">9 kVA</SelectItem>
                      <SelectItem value="12kva">12 kVA</SelectItem>
                      <SelectItem value="15kva">15 kVA</SelectItem>
                      <SelectItem value="18kva">18 kVA</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.powerDemanded && <p className="text-destructive text-sm mt-1">{errors.powerDemanded}</p>}
                </div>

                <div>
                  <Label className="text-base font-medium">État du projet *</Label>
                  <Select value={formData.projectStatus} onValueChange={(value) => handleInputChange('projectStatus', value)}>
                    <SelectTrigger className={`h-14 text-base ${errors.projectStatus ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Sélectionner l'état" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="etude">En étude</SelectItem>
                      <SelectItem value="permis">Permis déposé</SelectItem>
                      <SelectItem value="construction">En construction</SelectItem>
                      <SelectItem value="fini">Travaux terminés</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.projectStatus && <p className="text-destructive text-sm mt-1">{errors.projectStatus}</p>}
                </div>

                <div>
                  <Label className="text-base font-medium">Délai souhaité *</Label>
                  <Select value={formData.desiredTimeline} onValueChange={(value) => handleInputChange('desiredTimeline', value)}>
                    <SelectTrigger className={`h-14 text-base ${errors.desiredTimeline ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Sélectionner le délai" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="urgent">Urgent (moins de 1 mois)</SelectItem>
                      <SelectItem value="1_mois">1-2 mois</SelectItem>
                      <SelectItem value="3_mois">3-6 mois</SelectItem>
                      <SelectItem value="6_mois">Plus de 6 mois</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.desiredTimeline && <p className="text-destructive text-sm mt-1">{errors.desiredTimeline}</p>}
                </div>

                <div>
                  <Label htmlFor="additionalComments" className="text-base font-medium">Informations complémentaires</Label>
                  <Textarea
                    id="additionalComments"
                    value={formData.additionalComments}
                    onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                    placeholder="Précisions sur votre projet..."
                    className="min-h-[100px] text-base mt-2"
                  />
                </div>

                <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={formData.consent}
                    onChange={(e) => handleInputChange('consent', e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <Label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed">
                    J&apos;accepte d&apos;être contacté par téléphone et email concernant ma demande et accepte les conditions générales *
                  </Label>
                </div>
                {errors.consent && <p className="text-destructive text-sm">{errors.consent}</p>}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              Demande envoyée !
            </h2>
            <p className="text-green-700 mb-4">
              Redirection vers le paiement sécurisé en cours...
            </p>
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <img 
            src="https://kstugxtmghinprrpkrud.supabase.co/storage/v1/object/public/logo//Votre%20Partenaire%20(Logo)-3.png" 
            alt="Logo" 
            className="h-8 w-auto filter brightness-110"
          />
          <h1 className="text-lg font-semibold">Démarrer ma demande</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-primary-foreground hover:bg-primary-foreground/20 p-2"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Step Progress */}
      <div className="bg-background px-4 py-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">
            Étape {currentStep} sur {STEPS.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round((currentStep / STEPS.length) * 100)}%
          </span>
        </div>
        <Progress value={(currentStep / STEPS.length) * 100} className="h-2" />
        
        {/* Step Indicators */}
        <div className="flex items-center justify-between mt-4">
          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center space-y-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                step.id < currentStep ? 'bg-primary text-primary-foreground' :
                step.id === currentStep ? 'bg-primary text-primary-foreground' : 
                'bg-muted text-muted-foreground'
              }`}>
                {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span className="text-xs text-muted-foreground text-center max-w-[80px] leading-tight">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-24">
          <div className="max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-background border-t p-4 shadow-2xl">
        <div className="max-w-md mx-auto flex gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex-1 h-12 text-base"
              disabled={isSubmitting}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>
          )}
          
          <Button
            onClick={currentStep === STEPS.length ? handleSubmit : handleNext}
            disabled={isSubmitting}
            className="flex-[2] h-12 text-base bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Traitement...
              </>
            ) : currentStep === STEPS.length ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Envoyer ma demande
              </>
            ) : (
              <>
                Continuer
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileFormFixed;