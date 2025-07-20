import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CheckCircle } from "lucide-react";

interface StepSummaryProps {
  form: UseFormReturn<any>;
}

export const StepSummary = ({ form }: StepSummaryProps) => {
  const { control, watch } = form;
  const formData = watch();

  const getClientTypeLabel = (type: string) => {
    switch (type) {
      case "particulier": return "Particulier";
      case "professionnel": return "Professionnel";
      case "collectivite": return "Collectivité";
      default: return type;
    }
  };

  const getConnectionTypeLabel = (type: string) => {
    switch (type) {
      case "definitif": return "Définitif";
      case "provisoire": return "Provisoire";
      case "augmentation": return "Augmentation puissance";
      case "collectif": return "Collectif";
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          Résumé de votre demande
        </h3>
        <p className="text-muted-foreground">
          Vérifiez les informations saisies avant l'envoi
        </p>
      </div>

      <div className="space-y-4">
        {/* Type de demandeur */}
        <Card className="p-4">
          <h4 className="font-semibold text-foreground mb-2">Type de demandeur</h4>
          <p className="text-muted-foreground">{getClientTypeLabel(formData.clientType)}</p>
        </Card>

        {/* Informations personnelles */}
        <Card className="p-4">
          <h4 className="font-semibold text-foreground mb-2">Informations de contact</h4>
          <div className="space-y-1 text-muted-foreground">
            <p><strong>Nom:</strong> {formData.firstName} {formData.lastName}</p>
            {formData.companyName && <p><strong>Entreprise:</strong> {formData.companyName}</p>}
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Téléphone:</strong> {formData.phone}</p>
          </div>
        </Card>

        {/* Adresses */}
        <Card className="p-4">
          <h4 className="font-semibold text-foreground mb-2">Adresses</h4>
          <div className="space-y-2 text-muted-foreground">
            <div>
              <strong>Chantier:</strong>
              <p>{formData.workAddress}, {formData.workPostalCode} {formData.workCity}</p>
            </div>
            {!formData.sameAsBilling && formData.billingAddress && (
              <div>
                <strong>Facturation:</strong>
                <p>{formData.billingAddress}, {formData.billingPostalCode} {formData.billingCity}</p>
              </div>
            )}
            {formData.sameAsBilling && (
              <p><em>Facturation: même adresse que le chantier</em></p>
            )}
          </div>
        </Card>

        {/* Détails techniques */}
        <Card className="p-4">
          <h4 className="font-semibold text-foreground mb-2">Détails techniques</h4>
          <div className="space-y-1 text-muted-foreground">
            <p><strong>Type:</strong> {getConnectionTypeLabel(formData.connectionType)}</p>
            <p><strong>Puissance:</strong> {formData.power} kVA</p>
            {formData.dwellings && <p><strong>Logements:</strong> {formData.dwellings}</p>}
            {formData.urgent && (
              <p className="text-orange-600">
                <strong>⚠️ Demande urgente</strong>
              </p>
            )}
            {formData.comments && (
              <div>
                <strong>Commentaires:</strong>
                <p className="italic">{formData.comments}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* RGPD Consent */}
      <Card className="p-4 border-primary/20">
        <FormField
          control={control}
          name="rgpdConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm">
                  J'accepte le traitement de mes données personnelles dans le cadre de ma demande de raccordement électrique. *
                </FormLabel>
                <p className="text-xs text-muted-foreground">
                  Vos données seront utilisées uniquement pour traiter votre demande et vous contacter. 
                  Consultez notre <a href="/confidentialite" className="text-primary hover:underline">politique de confidentialité</a>.
                </p>
              </div>
            </FormItem>
          )}
        />
        <FormMessage />
      </Card>

      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle className="w-5 h-5" />
          <p className="text-sm">
            En cliquant sur "Envoyer ma demande", votre dossier sera transmis à nos experts 
            qui vous contacteront dans les 24h pour la suite du processus.
          </p>
        </div>
      </Card>
    </div>
  );
};