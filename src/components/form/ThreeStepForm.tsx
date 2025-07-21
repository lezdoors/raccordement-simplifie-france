import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Schéma de validation avec messages en français
const formSchema = z.object({
  prenom: z.string().min(1, "Le prénom est obligatoire"),
  nom: z.string().min(1, "Le nom est obligatoire"),
  email: z.string().email("Email invalide"),
  telephone: z.string()
    .regex(/^(06|07)\d{8}$/, "Le numéro doit commencer par 06 ou 07 et contenir 10 chiffres"),
  codePostal: z.string()
    .regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres"),
  ville: z.string().min(1, "La ville est obligatoire"),
  typeRaccordement: z.enum(["provisoire", "definitif", "collectif"], {
    message: "Veuillez sélectionner un type de raccordement"
  }),
  typeCourant: z.enum(["monophase", "triphase"], {
    message: "Veuillez sélectionner un type de courant"
  }),
  puissance: z.string().min(1, "Veuillez sélectionner une puissance"),
  adresseFacturationDifferente: z.boolean(),
  adresseFacturation: z.string().optional(),
  codePostalFacturation: z.string().optional(),
  villeFacturation: z.string().optional(),
}).refine((data) => {
  if (data.adresseFacturationDifferente) {
    return data.adresseFacturation && data.codePostalFacturation && data.villeFacturation;
  }
  return true;
}, {
  message: "L'adresse de facturation est obligatoire",
  path: ["adresseFacturation"]
});

type FormData = z.infer<typeof formSchema>;

interface ThreeStepFormProps {
  initialData?: Partial<FormData>;
}

const puissancesMonophase = [
  { value: "3kva", label: "3 kVA" },
  { value: "6kva", label: "6 kVA" },
  { value: "9kva", label: "9 kVA" },
  { value: "12kva", label: "12 kVA" }
];

const puissancesTriphase = [
  { value: "12kva", label: "12 kVA" },
  { value: "18kva", label: "18 kVA" },
  { value: "24kva", label: "24 kVA" },
  { value: "36kva", label: "36 kVA" },
  { value: "tarif-jaune", label: "Tarif Jaune" }
];

export const ThreeStepForm = ({ initialData }: ThreeStepFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoadingCity, setIsLoadingCity] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prenom: initialData?.prenom || "",
      nom: initialData?.nom || "",
      email: initialData?.email || "",
      telephone: initialData?.telephone || "",
      codePostal: initialData?.codePostal || "",
      ville: initialData?.ville || "",
      typeRaccordement: initialData?.typeRaccordement || "definitif",
      typeCourant: initialData?.typeCourant || "monophase",
      puissance: initialData?.puissance || "",
      adresseFacturationDifferente: initialData?.adresseFacturationDifferente || false,
      adresseFacturation: initialData?.adresseFacturation || "",
      codePostalFacturation: initialData?.codePostalFacturation || "",
      villeFacturation: initialData?.villeFacturation || "",
    },
    mode: "onChange",
  });

  const { watch, setValue, trigger, getValues, formState: { errors } } = form;
  const watchedValues = watch();

  // Auto-complétion de la ville avec l'API Geo Gouv
  const fetchCity = async (codePostal: string) => {
    if (codePostal.length === 5) {
      setIsLoadingCity(true);
      try {
        const response = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}&fields=nom`);
        const data = await response.json();
        if (data.length > 0) {
          setValue("ville", data[0].nom);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la ville:", error);
      } finally {
        setIsLoadingCity(false);
      }
    }
  };

  // Surveiller les changements de code postal
  useEffect(() => {
    const codePostal = watchedValues.codePostal;
    if (codePostal && codePostal.length === 5) {
      fetchCity(codePostal);
    }
  }, [watchedValues.codePostal]);

  // Réinitialiser la puissance quand le type de courant change
  useEffect(() => {
    setValue("puissance", "");
  }, [watchedValues.typeCourant, setValue]);

  // Sauvegarde partielle après l'étape 1
  const savePartialData = async (data: Partial<FormData>) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .insert({
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          telephone: data.telephone,
          code_postal: data.codePostal,
          ville: data.ville,
          form_status: 'partial',
          client_type: 'particulier',
          project_type: 'raccordement',
          connection_type: 'definitif',
          power_kva: '6kva'
        });

      if (error) {
        console.error("Erreur sauvegarde partielle:", error);
      }
    } catch (error) {
      console.error("Erreur sauvegarde partielle:", error);
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["prenom", "nom", "email", "telephone", "codePostal", "ville"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["typeRaccordement", "typeCourant", "puissance"];
      if (watchedValues.adresseFacturationDifferente) {
        fieldsToValidate.push("adresseFacturation", "codePostalFacturation", "villeFacturation");
      }
    }
    
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      if (currentStep === 1) {
        // Sauvegarde partielle après l'étape 1
        await savePartialData(getValues());
      }
      
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      toast.error("Veuillez corriger les erreurs avant de continuer");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      // Sauvegarder les données complètes
      const { error } = await supabase
        .from('form_submissions')
        .insert({
          client_type: 'particulier',
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          telephone: data.telephone,
          adresse: `${data.codePostal} ${data.ville}`,
          code_postal: data.codePostal,
          ville: data.ville,
          connection_type: data.typeRaccordement,
          power_type: data.typeCourant,
          power_kva: data.puissance,
          different_billing_address: data.adresseFacturationDifferente,
          billing_address: data.adresseFacturation,
          billing_postal_code: data.codePostalFacturation,
          billing_city: data.villeFacturation,
          project_type: data.typeRaccordement,
          project_status: 'submitted',
          form_status: 'completed',
          payment_status: 'pending'
        });

      if (error) {
        console.error("Erreur Supabase:", error);
        toast.error("Erreur lors de l'envoi de votre demande");
        return;
      }

      // Redirection vers Stripe (pour l'instant vers page de remerciement)
      toast.success("Votre demande a été enregistrée !");
      navigate("/merci");
      
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const progress = (currentStep / 3) * 100;
  const puissances = watchedValues.typeCourant === "monophase" ? puissancesMonophase : puissancesTriphase;

  return (
    <Card className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-foreground">
            Étape {currentStep} sur 3
          </h2>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% complété
          </span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* ÉTAPE 1: Informations de base */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Informations de base</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  {...form.register("prenom")}
                  className="mt-1"
                  placeholder="Votre prénom"
                />
                {errors.prenom && <p className="text-sm text-red-500 mt-1">{errors.prenom.message}</p>}
              </div>

              <div>
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  {...form.register("nom")}
                  className="mt-1"
                  placeholder="Votre nom"
                />
                {errors.nom && <p className="text-sm text-red-500 mt-1">{errors.nom.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                className="mt-1"
                placeholder="votre@email.com"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input
                id="telephone"
                {...form.register("telephone")}
                className="mt-1"
                placeholder="06 12 34 56 78"
              />
              {errors.telephone && <p className="text-sm text-red-500 mt-1">{errors.telephone.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codePostal">Code postal *</Label>
                <Input
                  id="codePostal"
                  {...form.register("codePostal")}
                  className="mt-1"
                  placeholder="75001"
                  maxLength={5}
                />
                {errors.codePostal && <p className="text-sm text-red-500 mt-1">{errors.codePostal.message}</p>}
              </div>

              <div>
                <Label htmlFor="ville">Ville *</Label>
                <Input
                  id="ville"
                  {...form.register("ville")}
                  className="mt-1"
                  placeholder="Votre ville"
                  disabled={isLoadingCity}
                />
                {isLoadingCity && <p className="text-sm text-muted-foreground mt-1">Recherche de la ville...</p>}
                {errors.ville && <p className="text-sm text-red-500 mt-1">{errors.ville.message}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2: Détails techniques */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Détails techniques</h3>
            
            <div>
              <Label>Type de raccordement *</Label>
              <RadioGroup
                value={watchedValues.typeRaccordement}
                onValueChange={(value) => setValue("typeRaccordement", value as any)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="provisoire" id="provisoire" />
                  <Label htmlFor="provisoire">Raccordement provisoire</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="definitif" id="definitif" />
                  <Label htmlFor="definitif">Raccordement définitif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="collectif" id="collectif" />
                  <Label htmlFor="collectif">Raccordement collectif</Label>
                </div>
              </RadioGroup>
              {errors.typeRaccordement && <p className="text-sm text-red-500 mt-1">{errors.typeRaccordement.message}</p>}
            </div>

            <div>
              <Label>Type de courant *</Label>
              <RadioGroup
                value={watchedValues.typeCourant}
                onValueChange={(value) => setValue("typeCourant", value as any)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monophase" id="monophase" />
                  <Label htmlFor="monophase">Monophasé</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="triphase" id="triphase" />
                  <Label htmlFor="triphase">Triphasé</Label>
                </div>
              </RadioGroup>
              {errors.typeCourant && <p className="text-sm text-red-500 mt-1">{errors.typeCourant.message}</p>}
            </div>

            <div>
              <Label htmlFor="puissance">Puissance *</Label>
              <Select value={watchedValues.puissance} onValueChange={(value) => setValue("puissance", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez une puissance" />
                </SelectTrigger>
                <SelectContent>
                  {puissances.map((puissance) => (
                    <SelectItem key={puissance.value} value={puissance.value}>
                      {puissance.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.puissance && <p className="text-sm text-red-500 mt-1">{errors.puissance.message}</p>}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="adresseFacturationDifferente"
                  checked={watchedValues.adresseFacturationDifferente}
                  onCheckedChange={(checked) => setValue("adresseFacturationDifferente", !!checked)}
                />
                <Label htmlFor="adresseFacturationDifferente">Adresse de facturation différente</Label>
              </div>

              {watchedValues.adresseFacturationDifferente && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                  <div>
                    <Label htmlFor="adresseFacturation">Adresse de facturation *</Label>
                    <Input
                      id="adresseFacturation"
                      {...form.register("adresseFacturation")}
                      className="mt-1"
                      placeholder="Adresse complète"
                    />
                    {errors.adresseFacturation && <p className="text-sm text-red-500 mt-1">{errors.adresseFacturation.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="codePostalFacturation">Code postal *</Label>
                      <Input
                        id="codePostalFacturation"
                        {...form.register("codePostalFacturation")}
                        className="mt-1"
                        placeholder="75001"
                        maxLength={5}
                      />
                      {errors.codePostalFacturation && <p className="text-sm text-red-500 mt-1">{errors.codePostalFacturation.message}</p>}
                    </div>

                    <div>
                      <Label htmlFor="villeFacturation">Ville *</Label>
                      <Input
                        id="villeFacturation"
                        {...form.register("villeFacturation")}
                        className="mt-1"
                        placeholder="Ville de facturation"
                      />
                      {errors.villeFacturation && <p className="text-sm text-red-500 mt-1">{errors.villeFacturation.message}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ÉTAPE 3: Récapitulatif */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Récapitulatif</h3>
            
            <div className="bg-muted/20 p-6 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-foreground">Informations personnelles</h4>
                  <p><strong>Nom :</strong> {watchedValues.prenom} {watchedValues.nom}</p>
                  <p><strong>Email :</strong> {watchedValues.email}</p>
                  <p><strong>Téléphone :</strong> {watchedValues.telephone}</p>
                  <p><strong>Adresse :</strong> {watchedValues.codePostal} {watchedValues.ville}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground">Détails techniques</h4>
                  <p><strong>Type de raccordement :</strong> {watchedValues.typeRaccordement}</p>
                  <p><strong>Type de courant :</strong> {watchedValues.typeCourant}</p>
                  <p><strong>Puissance :</strong> {puissances.find(p => p.value === watchedValues.puissance)?.label}</p>
                  
                  {watchedValues.adresseFacturationDifferente && (
                    <div className="mt-4">
                      <h5 className="font-medium">Adresse de facturation</h5>
                      <p>{watchedValues.adresseFacturation}</p>
                      <p>{watchedValues.codePostalFacturation} {watchedValues.villeFacturation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Boutons de navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            size="lg"
            className="flex items-center gap-2 min-h-[48px] touch-target"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour
          </Button>

          {currentStep === 3 ? (
            <Button
              type="submit"
              size="lg"
              className="flex items-center gap-2 min-h-[48px] touch-target bg-primary hover:bg-primary/90"
            >
              Valider et Payer
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              size="lg"
              className="flex items-center gap-2 min-h-[48px] touch-target"
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