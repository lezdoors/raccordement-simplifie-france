import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, CheckCircle, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  // Personal Information
  civilite: string;
  clientType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  siret?: string;
  collectivityName?: string;
  collectivitySiren?: string;
  
  // Address Information  
  postalCode: string;
  city: string;
  workStreet: string;
  
  // Project Information
  connectionType: string;
  projectType: string;
  powerType: string;
  powerDemanded: string;
  projectStatus: string;
  desiredTimeline: string;
  additionalComments?: string;
  consent: boolean;
}

interface OptimizedMobileFormProps {
  onClose?: () => void;
}

interface Step {
  id: number;
  title: string;
  subtitle: string;
  fields: (keyof FormData)[];
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "Informations personnelles",
    subtitle: "Qui êtes-vous ?",
    fields: ['civilite', 'clientType', 'firstName', 'lastName', 'email', 'phone', 'companyName', 'siret', 'collectivityName', 'collectivitySiren']
  },
  {
    id: 2, 
    title: "Adresse des travaux",
    subtitle: "Où se situent vos travaux ?",
    fields: ['postalCode', 'city', 'workStreet']
  },
  {
    id: 3,
    title: "Détails du projet", 
    subtitle: "Parlez-nous de votre projet",
    fields: ['connectionType', 'projectType', 'powerType', 'powerDemanded', 'projectStatus', 'desiredTimeline', 'additionalComments', 'consent']
  }
];

const OptimizedMobileForm = ({ onClose }: OptimizedMobileFormProps) => {
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
    collectivityName: "",
    collectivitySiren: "",
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
    const currentStepData = STEPS.find(s => s.id === step);
    
    if (!currentStepData) return true;

    const requiredFields = currentStepData.fields;

    // Step 1 validations
    if (step === 1) {
      if (!formData.civilite) newErrors.civilite = "Civilité requise";
      if (!formData.clientType) newErrors.clientType = "Type de client requis";
      if (!formData.firstName) newErrors.firstName = "Prénom requis";
      if (!formData.lastName) newErrors.lastName = "Nom requis";
      if (!formData.email) newErrors.email = "Email requis";
      if (!formData.phone) newErrors.phone = "Téléphone requis";

      // Email validation
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Email invalide";
      }

      // Phone validation (French format)
      if (formData.phone && !/^((\+33|0)[1-9])(\d{2}){4}$/.test(formData.phone.replace(/\s/g, ""))) {
        newErrors.phone = "Numéro de téléphone invalide";
      }

      // Professional fields validation
      if (formData.clientType === "professionnel") {
        if (!formData.companyName) newErrors.companyName = "Raison sociale requise";
        if (!formData.siret) newErrors.siret = "SIRET requis";
      }

      // Collectivity fields validation
      if (formData.clientType === "collectivite") {
        if (!formData.collectivityName) newErrors.collectivityName = "Nom de la collectivité requis";
        if (!formData.collectivitySiren) newErrors.collectivitySiren = "SIREN requis";
      }
    }

    // Step 2 validations
    if (step === 2) {
      if (!formData.postalCode) newErrors.postalCode = "Code postal requis";
      if (!formData.city) newErrors.city = "Ville requise";
      if (!formData.workStreet) newErrors.workStreet = "Adresse des travaux requise";

      // Postal code validation
      if (formData.postalCode && !/^\d{5}$/.test(formData.postalCode)) {
        newErrors.postalCode = "Code postal invalide (5 chiffres)";
      }
    }

    // Step 3 validations
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
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      const errorCount = Object.keys(errors).length;
      toast.error(`Veuillez corriger ${errorCount} erreur${errorCount > 1 ? 's' : ''}`);
      
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => errorElement.focus(), 100);
      }
      return;
    }

    // Save partial data after step 1
    if (currentStep === 1) {
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
          nom_collectivite: formData.collectivityName || null,
          siren_collectivite: formData.collectivitySiren || null,
          form_step: currentStep + 1,
          payment_status: "pending"
        }, { onConflict: 'email' });
      } catch (error) {
        console.warn('Error saving partial data:', error);
      }
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
      // First save to leads_raccordement for CRM
      await supabase.from('leads_raccordement').upsert({
        email: formData.email,
        civilite: formData.civilite,
        type_client: formData.clientType,
        nom: formData.lastName,
        prenom: formData.firstName,
        telephone: formData.phone,
        raison_sociale: formData.companyName || null,
        siren: formData.siret || null,
        nom_collectivite: formData.collectivityName || null,
        siren_collectivite: formData.collectivitySiren || null,
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

      // Show success message
      toast.success("✅ Votre demande a bien été soumise. Redirection vers le paiement en cours...");

      // Create payment session
      const { data, error } = await supabase.functions.invoke('create-payment-session', {
        body: {
          amount: 12900, // €129 in cents
          formData: formData
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Small delay for better UX
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

  const renderStepContent = () => {
    const step = STEPS.find(s => s.id === currentStep);
    if (!step) return null;

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Civilité */}
            <div>
              <Label className="text-base font-medium">Civilité *</Label>
              <Select value={formData.civilite} onValueChange={(value) => handleInputChange('civilite', value)}>
                <SelectTrigger className={`h-14 text-base ${errors.civilite ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner votre civilité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monsieur">Monsieur</SelectItem>
                  <SelectItem value="madame">Madame</SelectItem>
                </SelectContent>
              </Select>
              {errors.civilite && <p className="text-red-500 text-sm mt-1">{errors.civilite}</p>}
            </div>

            {/* Type de client */}
            <div>
              <Label className="text-base font-medium">Type de client *</Label>
              <Select value={formData.clientType} onValueChange={(value) => handleInputChange('clientType', value)}>
                <SelectTrigger className={`h-14 text-base ${errors.clientType ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner le type de client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="particulier">Particulier</SelectItem>
                  <SelectItem value="professionnel">Professionnel</SelectItem>
                  <SelectItem value="collectivite">Collectivité</SelectItem>
                </SelectContent>
              </Select>
              {errors.clientType && <p className="text-red-500 text-sm mt-1">{errors.clientType}</p>}
            </div>

            {/* Nom et Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-base font-medium">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Jean"
                  className={`h-14 text-base ${errors.firstName ? 'border-red-500' : ''}`}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="lastName" className="text-base font-medium">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Dupont"
                  className={`h-14 text-base ${errors.lastName ? 'border-red-500' : ''}`}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-base font-medium">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="jean.dupont@email.com"
                className={`h-14 text-base ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Téléphone */}
            <div>
              <Label htmlFor="phone" className="text-base font-medium">Téléphone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="0123456789"
                className={`h-14 text-base ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Professional fields */}
            {formData.clientType === "professionnel" && (
              <>
                <div>
                  <Label htmlFor="companyName" className="text-base font-medium">Raison sociale *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Nom de l'entreprise"
                    className={`h-14 text-base ${errors.companyName ? 'border-red-500' : ''}`}
                  />
                  {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                </div>
                <div>
                  <Label htmlFor="siret" className="text-base font-medium">SIRET *</Label>
                  <Input
                    id="siret"
                    value={formData.siret}
                    onChange={(e) => handleInputChange('siret', e.target.value)}
                    placeholder="12345678901234"
                    className={`h-14 text-base ${errors.siret ? 'border-red-500' : ''}`}
                  />
                  {errors.siret && <p className="text-red-500 text-sm mt-1">{errors.siret}</p>}
                </div>
              </>
            )}

            {/* Collectivity fields */}
            {formData.clientType === "collectivite" && (
              <>
                <div>
                  <Label htmlFor="collectivityName" className="text-base font-medium">Nom de la collectivité *</Label>
                  <Input
                    id="collectivityName"
                    value={formData.collectivityName}
                    onChange={(e) => handleInputChange('collectivityName', e.target.value)}
                    placeholder="Nom de la collectivité"
                    className={`h-14 text-base ${errors.collectivityName ? 'border-red-500' : ''}`}
                  />
                  {errors.collectivityName && <p className="text-red-500 text-sm mt-1">{errors.collectivityName}</p>}
                </div>
                <div>
                  <Label htmlFor="collectivitySiren" className="text-base font-medium">SIREN *</Label>
                  <Input
                    id="collectivitySiren"
                    value={formData.collectivitySiren}
                    onChange={(e) => handleInputChange('collectivitySiren', e.target.value)}
                    placeholder="123456789"
                    className={`h-14 text-base ${errors.collectivitySiren ? 'border-red-500' : ''}`}
                  />
                  {errors.collectivitySiren && <p className="text-red-500 text-sm mt-1">{errors.collectivitySiren}</p>}
                </div>
              </>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode" className="text-base font-medium">Code postal *</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="75001"
                  maxLength={5}
                  className={`h-14 text-base ${errors.postalCode ? 'border-red-500' : ''}`}
                />
                {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
              </div>
              <div>
                <Label htmlFor="city" className="text-base font-medium">Ville *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Paris"
                  className={`h-14 text-base ${errors.city ? 'border-red-500' : ''}`}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="workStreet" className="text-base font-medium">Adresse des travaux *</Label>
              <Input
                id="workStreet"
                value={formData.workStreet}
                onChange={(e) => handleInputChange('workStreet', e.target.value)}
                placeholder="123 rue de la Paix"
                className={`h-14 text-base ${errors.workStreet ? 'border-red-500' : ''}`}
              />
              {errors.workStreet && <p className="text-red-500 text-sm mt-1">{errors.workStreet}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Type de raccordement */}
            <div>
              <Label className="text-base font-medium">Type de raccordement *</Label>
              <Select value={formData.connectionType} onValueChange={(value) => handleInputChange('connectionType', value)}>
                <SelectTrigger className={`h-14 text-base ${errors.connectionType ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner le type de raccordement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nouveau_raccordement">Nouveau raccordement</SelectItem>
                  <SelectItem value="modification_raccordement">Modification de raccordement</SelectItem>
                  <SelectItem value="remise_en_service">Remise en service</SelectItem>
                </SelectContent>
              </Select>
              {errors.connectionType && <p className="text-red-500 text-sm mt-1">{errors.connectionType}</p>}
            </div>

            {/* Type de projet */}
            <div>
              <Label className="text-base font-medium">Type de projet *</Label>
              <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                <SelectTrigger className={`h-14 text-base ${errors.projectType ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner le type de projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maison_individuelle">Maison individuelle</SelectItem>
                  <SelectItem value="appartement">Appartement</SelectItem>
                  <SelectItem value="local_commercial">Local commercial</SelectItem>
                  <SelectItem value="bureau">Bureau</SelectItem>
                  <SelectItem value="industrie">Industrie</SelectItem>
                </SelectContent>
              </Select>
              {errors.projectType && <p className="text-red-500 text-sm mt-1">{errors.projectType}</p>}
            </div>

            {/* Type d'alimentation */}
            <div>
              <Label className="text-base font-medium">Type d'alimentation *</Label>
              <Select value={formData.powerType} onValueChange={(value) => handleInputChange('powerType', value)}>
                <SelectTrigger className={`h-14 text-base ${errors.powerType ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner le type d'alimentation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monophase">Monophasé</SelectItem>
                  <SelectItem value="triphase">Triphasé</SelectItem>
                </SelectContent>
              </Select>
              {errors.powerType && <p className="text-red-500 text-sm mt-1">{errors.powerType}</p>}
            </div>

            {/* Puissance */}
            <div>
              <Label className="text-base font-medium">Puissance demandée *</Label>
              <Select value={formData.powerDemanded} onValueChange={(value) => handleInputChange('powerDemanded', value)}>
                <SelectTrigger className={`h-14 text-base ${errors.powerDemanded ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner la puissance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3kva">3 kVA</SelectItem>
                  <SelectItem value="6kva">6 kVA</SelectItem>
                  <SelectItem value="9kva">9 kVA</SelectItem>
                  <SelectItem value="12kva">12 kVA</SelectItem>
                  <SelectItem value="15kva">15 kVA</SelectItem>
                  <SelectItem value="18kva">18 kVA</SelectItem>
                  <SelectItem value="24kva">24 kVA</SelectItem>
                  <SelectItem value="36kva">36 kVA</SelectItem>
                </SelectContent>
              </Select>
              {errors.powerDemanded && <p className="text-red-500 text-sm mt-1">{errors.powerDemanded}</p>}
            </div>

            {/* État du projet */}
            <div>
              <Label className="text-base font-medium">État du projet *</Label>
              <Select value={formData.projectStatus} onValueChange={(value) => handleInputChange('projectStatus', value)}>
                <SelectTrigger className={`h-14 text-base ${errors.projectStatus ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner l'état du projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nouveau">Nouveau projet</SelectItem>
                  <SelectItem value="permis_depose">Permis déposé</SelectItem>
                  <SelectItem value="en_cours">Travaux en cours</SelectItem>
                  <SelectItem value="travaux_termines">Travaux terminés</SelectItem>
                </SelectContent>
              </Select>
              {errors.projectStatus && <p className="text-red-500 text-sm mt-1">{errors.projectStatus}</p>}
            </div>

            {/* Délai souhaité */}
            <div>
              <Label className="text-base font-medium">Délai souhaité *</Label>
              <Select value={formData.desiredTimeline} onValueChange={(value) => handleInputChange('desiredTimeline', value)}>
                <SelectTrigger className={`h-14 text-base ${errors.desiredTimeline ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner le délai souhaité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moins_1_mois">Moins d'1 mois</SelectItem>
                  <SelectItem value="1_3_mois">1 à 3 mois</SelectItem>
                  <SelectItem value="3_6_mois">3 à 6 mois</SelectItem>
                  <SelectItem value="plus_6_mois">Plus de 6 mois</SelectItem>
                  <SelectItem value="pas_urgent">Pas urgent</SelectItem>
                </SelectContent>
              </Select>
              {errors.desiredTimeline && <p className="text-red-500 text-sm mt-1">{errors.desiredTimeline}</p>}
            </div>

            {/* Commentaires */}
            <div>
              <Label htmlFor="additionalComments" className="text-base font-medium">Informations complémentaires</Label>
              <Textarea
                id="additionalComments"
                value={formData.additionalComments}
                onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                placeholder="Ajoutez des détails sur votre projet si nécessaire..."
                className="min-h-20 text-base"
              />
            </div>

            {/* Consent */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="consent"
                checked={formData.consent}
                onChange={(e) => handleInputChange('consent', e.target.checked)}
                className="mt-1"
              />
              <Label htmlFor="consent" className="text-sm text-gray-600 leading-relaxed">
                J'accepte les <a href="/cgu" className="text-blue-600 hover:underline">conditions générales d'utilisation</a> et 
                la <a href="/confidentialite" className="text-blue-600 hover:underline">politique de confidentialité</a>. 
                J'autorise Raccordement Connect à traiter mes données personnelles pour traiter ma demande de raccordement électrique. *
              </Label>
            </div>
            {errors.consent && <p className="text-red-500 text-sm mt-1">{errors.consent}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-6">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ✅ Demande soumise avec succès !
                </h3>
                <p className="text-gray-600 mb-4">
                  Redirection vers le paiement en cours...
                </p>
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2 text-blue-600" />
                  <span className="text-sm text-gray-500">Traitement en cours</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec progress */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Demande de raccordement</h1>
              <p className="text-sm text-gray-500">
                Étape {currentStep} sur {STEPS.length}
              </p>
            </div>
          </div>
          
          {currentStep === 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep(1)}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Modifier mes informations
            </Button>
          )}
        </div>
        
        <Progress value={progress} className="h-1" />
      </div>

      {/* Step indicators */}
      <div className="bg-white border-b p-4">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300
                ${step.id < currentStep 
                  ? 'bg-blue-100 text-blue-600 border-blue-200' 
                  : step.id === currentStep 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-gray-100 text-gray-400 border-gray-200'
                }
              `}>
                {step.id < currentStep ? '✓' : step.id}
              </div>
              <span className={`text-xs mt-1 ${step.id === currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">{STEPS[currentStep - 1]?.title}</CardTitle>
            <p className="text-gray-600">{STEPS[currentStep - 1]?.subtitle}</p>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-30">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex-1 h-12"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>
          
          {currentStep < STEPS.length ? (
            <Button
              onClick={handleNext}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 via-blue-700 to-yellow-600 hover:from-blue-700 hover:via-blue-800 hover:to-yellow-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Traitement...
                </>
              ) : (
                "Soumettre ma demande"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptimizedMobileForm;