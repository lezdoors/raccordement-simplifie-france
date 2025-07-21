import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { User, MapPin, CreditCard, Zap, Clock, MessageSquare } from "lucide-react";

interface StepSummaryProps {
  form: UseFormReturn<any>;
}

export const StepSummary = ({ form }: StepSummaryProps) => {
  const formData = form.watch();

  const getConnectionTypeLabel = (type: string) => {
    const types = {
      definitif: "Raccordement définitif",
      provisoire: "Raccordement provisoire",
      augmentation: "Augmentation de puissance",
      collectif: "Raccordement collectif",
    };
    return types[type as keyof typeof types] || type;
  };

  const getClientTypeLabel = (type: string) => {
    const types = {
      particulier: "Particulier",
      professionnel: "Professionnel",
      collectivite: "Collectivité",
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Résumé de votre demande
        </h2>
        <p className="text-muted-foreground">
          Vérifiez les informations avant de confirmer votre demande
        </p>
      </div>

      <div className="space-y-6">
        {/* Type de demandeur */}
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Type de demandeur</h3>
              <Badge variant="secondary">{getClientTypeLabel(formData.clientType)}</Badge>
            </div>
          </div>
        </Card>

        {/* Informations personnelles */}
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-3">Informations de contact</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Nom :</span> {formData.firstName} {formData.lastName}</div>
                <div><span className="font-medium">Email :</span> {formData.email}</div>
                <div><span className="font-medium">Téléphone :</span> {formData.phone}</div>
                {formData.companyName && (
                  <div><span className="font-medium">Entreprise :</span> {formData.companyName}</div>
                )}
                {formData.collectivityName && (
                  <div><span className="font-medium">Collectivité :</span> {formData.collectivityName}</div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Adresse des travaux */}
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-3">Adresse des travaux</h3>
              <div className="text-sm">
                <div>{formData.workAddress}</div>
                {formData.workAddressComplement && <div>{formData.workAddressComplement}</div>}
                <div>{formData.workPostalCode} {formData.workCity}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Adresse de facturation */}
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-3">Adresse de facturation</h3>
              {formData.sameAsBilling ? (
                <Badge variant="outline">Identique à l'adresse des travaux</Badge>
              ) : (
                <div className="text-sm">
                  <div>{formData.billingAddress}</div>
                  {formData.billingAddressComplement && <div>{formData.billingAddressComplement}</div>}
                  <div>{formData.billingPostalCode} {formData.billingCity}</div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Détails du raccordement */}
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-3">Détails du raccordement</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Type :</span> {getConnectionTypeLabel(formData.connectionType)}</div>
                <div><span className="font-medium">Puissance :</span> {formData.power === "autre" ? "Autre puissance" : `${formData.power} kVA`}</div>
                {formData.dwellings && (
                  <div><span className="font-medium">Nombre de logements :</span> {formData.dwellings}</div>
                )}
                {formData.urgent && (
                  <Badge variant="destructive" className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Demande urgente
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Commentaires */}
        {formData.comments && (
          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-3">Commentaires</h3>
                <p className="text-sm text-muted-foreground">{formData.comments}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Separator />

      {/* Consentement RGPD */}
      <FormField
        control={form.control}
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
  );
};