import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Zap,
  CreditCard,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SimplifiedFormData {
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
  workAddressComplement?: string;
  
  // Project Information
  connectionType: string;
  projectType: string;
  powerType: string;
  powerDemanded: string;
  projectStatus: string;
  desiredTimeline: string;
  
  // Additional Information
  additionalComments?: string;
  consent: boolean;
}

interface SimplifiedMobileFormProps {
  onClose?: () => void;
}

const SimplifiedMobileForm = ({ onClose }: SimplifiedMobileFormProps) => {
  const [formData, setFormData] = useState<SimplifiedFormData>({
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
    workAddressComplement: "",
    connectionType: "",
    projectType: "",
    powerType: "",
    powerDemanded: "",
    projectStatus: "",
    desiredTimeline: "",
    additionalComments: "",
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    if (!formData.civilite) newErrors.civilite = "Civilité requise";
    if (!formData.clientType) newErrors.clientType = "Type de client requis";
    if (!formData.firstName) newErrors.firstName = "Prénom requis";
    if (!formData.lastName) newErrors.lastName = "Nom requis";
    if (!formData.email) newErrors.email = "Email requis";
    if (!formData.phone) newErrors.phone = "Téléphone requis";
    if (!formData.postalCode) newErrors.postalCode = "Code postal requis";
    if (!formData.city) newErrors.city = "Ville requise";
    if (!formData.workStreet) newErrors.workStreet = "Adresse des travaux requise";
    if (!formData.connectionType) newErrors.connectionType = "Type de raccordement requis";
    if (!formData.projectType) newErrors.projectType = "Type de projet requis";
    if (!formData.powerType) newErrors.powerType = "Type d'alimentation requis";
    if (!formData.powerDemanded) newErrors.powerDemanded = "Puissance requise";
    if (!formData.projectStatus) newErrors.projectStatus = "État du projet requis";
    if (!formData.desiredTimeline) newErrors.desiredTimeline = "Délai souhaité requis";
    if (!formData.consent) newErrors.consent = "Vous devez accepter les conditions";

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    // Phone validation
    if (formData.phone && !/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Numéro de téléphone invalide";
    }

    // Postal code validation
    if (formData.postalCode && !/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = "Code postal invalide (5 chiffres)";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SimplifiedFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setIsSubmitting(true);

    try {
      // Trigger Google Ads conversion tracking
      if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
        (window as any).gtag_report_conversion();
      }

      // Submit to Supabase and create payment session
      const { data, error } = await supabase.functions.invoke('create-payment-session', {
        body: {
          amount: 12900, // €129 in cents
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
      toast.error("Une erreur s'est produite lors de la création du paiement");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold text-gray-900">
            Démarrer ma demande
          </h1>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6 pb-20">
        {/* Personal Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="civilite">Civilité *</Label>
                <Select value={formData.civilite} onValueChange={(value) => handleInputChange('civilite', value)}>
                  <SelectTrigger className={errors.civilite ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monsieur">Monsieur</SelectItem>
                    <SelectItem value="madame">Madame</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                {errors.civilite && <p className="text-red-500 text-sm mt-1">{errors.civilite}</p>}
              </div>

              <div>
                <Label htmlFor="clientType">Type de client *</Label>
                <Select value={formData.clientType} onValueChange={(value) => handleInputChange('clientType', value)}>
                  <SelectTrigger className={errors.clientType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="particulier">Particulier</SelectItem>
                    <SelectItem value="professionnel">Professionnel</SelectItem>
                    <SelectItem value="collectivite">Collectivité</SelectItem>
                  </SelectContent>
                </Select>
                {errors.clientType && <p className="text-red-500 text-sm mt-1">{errors.clientType}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Jean"
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Dupont"
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="jean.dupont@gmail.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="06 12 34 56 78"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Professional fields */}
            {formData.clientType === "professionnel" && (
              <>
                <div>
                  <Label htmlFor="companyName">Raison sociale *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Nom de l'entreprise"
                    className={errors.companyName ? 'border-red-500' : ''}
                  />
                  {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <Label htmlFor="siret">SIRET *</Label>
                  <Input
                    id="siret"
                    value={formData.siret}
                    onChange={(e) => handleInputChange('siret', e.target.value)}
                    placeholder="12345678901234"
                    className={errors.siret ? 'border-red-500' : ''}
                  />
                  {errors.siret && <p className="text-red-500 text-sm mt-1">{errors.siret}</p>}
                </div>
              </>
            )}

            {/* Collectivity fields */}
            {formData.clientType === "collectivite" && (
              <>
                <div>
                  <Label htmlFor="collectivityName">Nom de la collectivité *</Label>
                  <Input
                    id="collectivityName"
                    value={formData.collectivityName}
                    onChange={(e) => handleInputChange('collectivityName', e.target.value)}
                    placeholder="Nom de la collectivité"
                    className={errors.collectivityName ? 'border-red-500' : ''}
                  />
                  {errors.collectivityName && <p className="text-red-500 text-sm mt-1">{errors.collectivityName}</p>}
                </div>

                <div>
                  <Label htmlFor="collectivitySiren">SIREN *</Label>
                  <Input
                    id="collectivitySiren"
                    value={formData.collectivitySiren}
                    onChange={(e) => handleInputChange('collectivitySiren', e.target.value)}
                    placeholder="123456789"
                    className={errors.collectivitySiren ? 'border-red-500' : ''}
                  />
                  {errors.collectivitySiren && <p className="text-red-500 text-sm mt-1">{errors.collectivitySiren}</p>}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Address Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Adresse des travaux
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="workStreet">Adresse *</Label>
              <Input
                id="workStreet"
                value={formData.workStreet}
                onChange={(e) => handleInputChange('workStreet', e.target.value)}
                placeholder="123 rue de la République"
                className={errors.workStreet ? 'border-red-500' : ''}
              />
              {errors.workStreet && <p className="text-red-500 text-sm mt-1">{errors.workStreet}</p>}
            </div>

            <div>
              <Label htmlFor="workAddressComplement">Complément d'adresse</Label>
              <Input
                id="workAddressComplement"
                value={formData.workAddressComplement}
                onChange={(e) => handleInputChange('workAddressComplement', e.target.value)}
                placeholder="Bâtiment, étage, appartement..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">Code postal *</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="75001"
                  className={errors.postalCode ? 'border-red-500' : ''}
                />
                {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
              </div>

              <div>
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Paris"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Détails du projet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="connectionType">Type de raccordement *</Label>
              <Select value={formData.connectionType} onValueChange={(value) => handleInputChange('connectionType', value)}>
                <SelectTrigger className={errors.connectionType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionner le type de raccordement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nouveau_raccordement">Nouveau raccordement</SelectItem>
                  <SelectItem value="augmentation_puissance">Augmentation de puissance</SelectItem>
                  <SelectItem value="raccordement_provisoire">Raccordement provisoire</SelectItem>
                  <SelectItem value="deplacement_compteur">Déplacement de compteur</SelectItem>
                  <SelectItem value="autre_demande">Autre demande</SelectItem>
                </SelectContent>
              </Select>
              {errors.connectionType && <p className="text-red-500 text-sm mt-1">{errors.connectionType}</p>}
            </div>

            <div>
              <Label htmlFor="projectType">Type de projet *</Label>
              <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                <SelectTrigger className={errors.projectType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionner le type de projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maison_individuelle">Maison individuelle</SelectItem>
                  <SelectItem value="immeuble_collectif">Immeuble collectif</SelectItem>
                  <SelectItem value="local_commercial">Local commercial</SelectItem>
                  <SelectItem value="batiment_industriel">Bâtiment industriel</SelectItem>
                  <SelectItem value="terrain_nu">Terrain nu</SelectItem>
                </SelectContent>
              </Select>
              {errors.projectType && <p className="text-red-500 text-sm mt-1">{errors.projectType}</p>}
            </div>

            <div>
              <Label htmlFor="powerType">Type d'alimentation *</Label>
              <Select value={formData.powerType} onValueChange={(value) => handleInputChange('powerType', value)}>
                <SelectTrigger className={errors.powerType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionner le type d'alimentation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monophase">Monophasé</SelectItem>
                  <SelectItem value="triphase">Triphasé</SelectItem>
                  <SelectItem value="je_ne_sais_pas">Je ne sais pas</SelectItem>
                </SelectContent>
              </Select>
              {errors.powerType && <p className="text-red-500 text-sm mt-1">{errors.powerType}</p>}
            </div>

            <div>
              <Label htmlFor="powerDemanded">Puissance demandée *</Label>
              <Select value={formData.powerDemanded} onValueChange={(value) => handleInputChange('powerDemanded', value)}>
                <SelectTrigger className={errors.powerDemanded ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionner la puissance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 kVA</SelectItem>
                  <SelectItem value="6">6 kVA</SelectItem>
                  <SelectItem value="9">9 kVA</SelectItem>
                  <SelectItem value="12">12 kVA</SelectItem>
                  <SelectItem value="15">15 kVA</SelectItem>
                  <SelectItem value="18">18 kVA</SelectItem>
                  <SelectItem value="24">24 kVA</SelectItem>
                  <SelectItem value="36">36 kVA</SelectItem>
                  <SelectItem value="autre">Autre puissance</SelectItem>
                </SelectContent>
              </Select>
              {errors.powerDemanded && <p className="text-red-500 text-sm mt-1">{errors.powerDemanded}</p>}
            </div>

            <div>
              <Label htmlFor="projectStatus">État du projet *</Label>
              <Select value={formData.projectStatus} onValueChange={(value) => handleInputChange('projectStatus', value)}>
                <SelectTrigger className={errors.projectStatus ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionner l'état du projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en_reflexion">En réflexion</SelectItem>
                  <SelectItem value="permis_depose">Permis déposé</SelectItem>
                  <SelectItem value="permis_obtenu">Permis obtenu</SelectItem>
                  <SelectItem value="travaux_en_cours">Travaux en cours</SelectItem>
                  <SelectItem value="travaux_termines">Travaux terminés</SelectItem>
                </SelectContent>
              </Select>
              {errors.projectStatus && <p className="text-red-500 text-sm mt-1">{errors.projectStatus}</p>}
            </div>

            <div>
              <Label htmlFor="desiredTimeline">Délai souhaité *</Label>
              <Select value={formData.desiredTimeline} onValueChange={(value) => handleInputChange('desiredTimeline', value)}>
                <SelectTrigger className={errors.desiredTimeline ? 'border-red-500' : ''}>
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

            <div>
              <Label htmlFor="additionalComments">Informations complémentaires</Label>
              <Textarea
                id="additionalComments"
                value={formData.additionalComments}
                onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                placeholder="Ajoutez des détails sur votre projet si nécessaire..."
                className="min-h-20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Consent Section */}
        <Card>
          <CardContent className="pt-6">
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
                J'autorise Raccordement Connect à traiter mes données personnelles pour traiter ma demande de raccordement électrique.
              </Label>
            </div>
            {errors.consent && <p className="text-red-500 text-sm mt-1">{errors.consent}</p>}
          </CardContent>
        </Card>
      </form>

      {/* Fixed Bottom Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-30">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Traitement en cours...
            </>
          ) : (
            "Soumettre ma demande"
          )}
        </Button>
      </div>
    </div>
  );
};

export default SimplifiedMobileForm;