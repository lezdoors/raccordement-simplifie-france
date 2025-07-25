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
    fields: ['civilite', 'clientType', 'firstName', 'lastName', 'email', 'phone', 'companyName', 'siret']
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Civilité *</Label>
              <Select value={formData.civilite} onValueChange={(value) => handleInputChange('civilite', value)}>
                <SelectTrigger className={`h-14 text-base ${errors.civilite ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner votre civilité" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="monsieur">Monsieur</SelectItem>
                  <SelectItem value="madame">Madame</SelectItem>
                </SelectContent>
              </Select>
              {errors.civilite && <p className="text-red-500 text-sm mt-1">{errors.civilite}</p>}
            </div>

            <div>
              <Label className="text-base font-medium">Type de client *</Label>
              <Select value={formData.clientType} onValueChange={(value) => handleInputChange('clientType', value)}>
                <SelectTrigger className={`h-14 text-base ${errors.clientType ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner le type de client" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="particulier">Particulier</SelectItem>
                  <SelectItem value="professionnel">Professionnel</SelectItem>
                  <SelectItem value="collectivite">Collectivité</SelectItem>
                </SelectContent>
              </Select>
              {errors.clientType && <p className="text-red-500 text-sm mt-1">{errors.clientType}</p>}
            </div>

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
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="postalCode" className="text-base font-medium">Code postal *</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="75001"
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

            <div>
              <Label htmlFor="workStreet" className="text-base font-medium">Adresse des travaux *</Label>
              <Input
                id="workStreet"
                value={formData.workStreet}
                onChange={(e) => handleInputChange('workStreet', e.target.value)}
                placeholder="123 Rue de la Paix"
                className={`h-14 text-base ${errors.workStreet ? 'border-red-500' : ''}`}
              />
              {errors.workStreet && <p className="text-red-500 text-sm mt-1">{errors.workStreet}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Type de raccordement *</Label>
              <Select value={formData.connectionType} onValueChange={(value) => handleInputChange('connectionType', value)}>
                <SelectTrigger className={`h-14 text-base ${errors.connectionType ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="nouveau">Nouveau raccordement</SelectItem>
                  <SelectItem value="modification">Modification</SelectItem>
                  <SelectItem value="augmentation">Augmentation puissance</SelectItem>
                </SelectContent>
              </Select>
              {errors.connectionType && <p className="text-red-500 text-sm mt-1">{errors.connectionType}</p>}
            </div>

            <div>
              <Label className="text-base font-medium">Type de projet *</Label>
              <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                <SelectTrigger className={`h-14 text-base ${errors.projectType ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner le projet" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="maison">Maison individuelle</SelectItem>
                  <SelectItem value="appartement">Appartement</SelectItem>
                  <SelectItem value="commerce">Commerce</SelectItem>
                  <SelectItem value="bureau">Bureau</SelectItem>
                </SelectContent>
              </Select>
              {errors.projectType && <p className="text-red-500 text-sm mt-1">{errors.projectType}</p>}
            </div>

            <div>
              <Label className="text-base font-medium">Type d'alimentation *</Label>
              <Select value={formData.powerType} onValueChange={(value) => handleInputChange('powerType', value)}>
                <SelectTrigger className={`h-14 text-base ${errors.powerType ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="monophase">Monophasé</SelectItem>
                  <SelectItem value="triphase">Triphasé</SelectItem>
                </SelectContent>
              </Select>
              {errors.powerType && <p className="text-red-500 text-sm mt-1">{errors.powerType}</p>}
            </div>

            <div>
              <Label className="text-base font-medium">Puissance demandée *</Label>
              <Select value={formData.powerDemanded} onValueChange={(value) => handleInputChange('powerDemanded', value)}>
                <SelectTrigger className={`h-14 text-base ${errors.powerDemanded ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner la puissance" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="3kva">3 kVA</SelectItem>
                  <SelectItem value="6kva">6 kVA</SelectItem>
                  <SelectItem value="9kva">9 kVA</SelectItem>
                  <SelectItem value="12kva">12 kVA</SelectItem>
                  <SelectItem value="15kva">15 kVA</SelectItem>
                  <SelectItem value="18kva">18 kVA</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              {errors.powerDemanded && <p className="text-red-500 text-sm mt-1">{errors.powerDemanded}</p>}
            </div>

            <div>
              <Label className="text-base font-medium">État du projet *</Label>
              <Select value={formData.projectStatus} onValueChange={(value) => handleInputChange('projectStatus', value)}>
                <SelectTrigger className={`h-14 text-base ${errors.projectStatus ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner l'état" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="etude">En étude</SelectItem>
                  <SelectItem value="permis">Permis déposé</SelectItem>
                  <SelectItem value="construction">En construction</SelectItem>
                  <SelectItem value="fini">Travaux terminés</SelectItem>
                </SelectContent>
              </Select>
              {errors.projectStatus && <p className="text-red-500 text-sm mt-1">{errors.projectStatus}</p>}
            </div>

            <div>
              <Label className="text-base font-medium">Délai souhaité *</Label>
              <Select value={formData.desiredTimeline} onValueChange={(value) => handleInputChange('desiredTimeline', value)}>
                <SelectTrigger className={`h-14 text-base ${errors.desiredTimeline ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner le délai" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="urgent">Urgent (moins de 1 mois)</SelectItem>
                  <SelectItem value="1_mois">1-2 mois</SelectItem>
                  <SelectItem value="3_mois">3-6 mois</SelectItem>
                  <SelectItem value="6_mois">Plus de 6 mois</SelectItem>
                </SelectContent>
              </Select>
              {errors.desiredTimeline && <p className="text-red-500 text-sm mt-1">{errors.desiredTimeline}</p>}
            </div>

            <div>
              <Label htmlFor="additionalComments" className="text-base font-medium">Commentaires additionnels</Label>
              <Textarea
                id="additionalComments"
                value={formData.additionalComments}
                onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                placeholder="Détails supplémentaires sur votre projet..."
                className="min-h-[100px] text-base"
              />
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="consent"
                checked={formData.consent}
                onChange={(e) => handleInputChange('consent', e.target.checked)}
                className="mt-1"
              />
              <Label htmlFor="consent" className="text-sm text-gray-600 leading-relaxed">
                J&apos;accepte d&apos;être contacté par téléphone et email concernant ma demande *
              </Label>
            </div>
            {errors.consent && <p className="text-red-500 text-sm">{errors.consent}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1b2b65] to-[#edc674] text-white px-4 py-3 flex items-center justify-between">
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
          className="text-white hover:bg-white/20 p-2"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {showSuccess ? (
        <div className="flex-1 flex items-center justify-center p-6 bg-green-50">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-green-900">
              Demande envoyée avec succès !
            </h2>
            <p className="text-green-700">
              Redirection vers le paiement sécurisé en cours...
            </p>
            <div className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-green-600" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="bg-white px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Étape {currentStep} sur {STEPS.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / STEPS.length) * 100)}%
              </span>
            </div>
            <Progress value={(currentStep / STEPS.length) * 100} className="h-2" />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 pb-24">
              <div className="max-w-md mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                    {currentStep}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {STEPS.find(s => s.id === currentStep)?.title}
                  </h2>
                  <p className="text-gray-600">
                    {STEPS.find(s => s.id === currentStep)?.subtitle}
                  </p>
                </div>

                {renderStepContent()}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white border-t border-gray-100 p-4">
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
                className="flex-[2] h-12 text-base bg-gradient-to-r from-[#1b2b65] to-[#edc674] hover:from-[#15254b] hover:to-[#d4b666] text-white font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : currentStep === STEPS.length ? (
                  "Finaliser ma demande"
                ) : (
                  <>
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MobileFormFixed;