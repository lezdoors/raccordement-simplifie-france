import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StepFinalValidationProps {
  form: UseFormReturn<any>;
}

export const StepFinalValidation = ({ form }: StepFinalValidationProps) => {
  const formData = form.watch();

  const getConnectionTypeLabel = (type: string) => {
    const types = {
      nouveau_raccordement: "Nouveau raccordement",
      augmentation_puissance: "Augmentation de puissance",
      raccordement_provisoire: "Raccordement provisoire",
      deplacement_compteur: "Déplacement de compteur",
      autre_demande: "Autre demande"
    };
    return types[type as keyof typeof types] || type;
  };

  const getProjectTypeLabel = (type: string) => {
    const types = {
      maison_individuelle: "Maison individuelle",
      immeuble_collectif: "Immeuble collectif", 
      local_commercial: "Local commercial",
      batiment_industriel: "Bâtiment industriel",
      terrain_nu: "Terrain nu"
    };
    return types[type as keyof typeof types] || type;
  };

  const getPowerTypeLabel = (type: string) => {
    const types = {
      monophase: "Monophasé",
      triphase: "Triphasé",
      je_ne_sais_pas: "Je ne sais pas"
    };
    return types[type as keyof typeof types] || type;
  };

  const handleStripePayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          amount: 12900, // €129 TTC in cents
          description: "Demande de raccordement Enedis",
          formData 
        }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Erreur lors de l'ouverture du paiement. Veuillez réessayer.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Validation finale
        </h2>
        <p className="text-muted-foreground">
          Vérifiez vos informations et complétez votre demande
        </p>
      </div>

      {/* Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Résumé de votre demande</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Type de client:</span>
            <Badge variant="secondary">
              {formData.clientType === "particulier" ? "Particulier" : 
               formData.clientType === "professionnel" ? "Professionnel" : "Collectivité"}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Contact:</span>
            <span>{formData.civilite === "monsieur" ? "M." : "Mme"} {formData.firstName} {formData.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Téléphone:</span>
            <span>{formData.phone}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-medium">Type de raccordement:</span>
            <span>{getConnectionTypeLabel(formData.connectionType)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Type de projet:</span>
            <span>{getProjectTypeLabel(formData.projectType)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Alimentation:</span>
            <span>{getPowerTypeLabel(formData.powerType)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Puissance:</span>
            <span>{formData.powerDemanded} {formData.powerType !== "je_ne_sais_pas" ? "kVA" : ""}</span>
          </div>
        </div>
      </Card>

      {/* Final form fields */}
      <div className="grid grid-cols-1 gap-6">
        {/* État du projet */}
        <FormField
          control={form.control}
          name="projectStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">État du projet *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionnez l'état de votre projet" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="en_reflexion">En réflexion</SelectItem>
                  <SelectItem value="permis_depose">Permis déposé</SelectItem>
                  <SelectItem value="permis_accorde">Permis accordé</SelectItem>
                  <SelectItem value="travaux_commences">Travaux commencés</SelectItem>
                  <SelectItem value="travaux_termines">Travaux terminés</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Délai souhaité */}
        <FormField
          control={form.control}
          name="desiredTimeline"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Délai souhaité *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Quand souhaitez-vous être raccordé ?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="urgent">Dans les plus brefs délais</SelectItem>
                  <SelectItem value="1_mois">Dans le mois</SelectItem>
                  <SelectItem value="3_mois">Dans les 3 mois</SelectItem>
                  <SelectItem value="6_mois">Dans les 6 mois</SelectItem>
                  <SelectItem value="1_an">Dans l'année</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Consentement */}
        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium">
                  J'accepte le traitement de mes données personnelles *
                </FormLabel>
                <p className="text-xs text-muted-foreground">
                  En cochant cette case, vous acceptez que vos données soient traitées conformément à notre{" "}
                  <a href="/confidentialite" target="_blank" className="text-primary hover:underline">
                    politique de confidentialité
                  </a>
                  . Vos données ne seront utilisées que pour traiter votre demande de raccordement.
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

    </div>
  );
};