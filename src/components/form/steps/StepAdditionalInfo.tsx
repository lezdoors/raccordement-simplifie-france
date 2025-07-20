import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { AlertCircle } from "lucide-react";

interface StepAdditionalInfoProps {
  form: UseFormReturn<any>;
}

export const StepAdditionalInfo = ({ form }: StepAdditionalInfoProps) => {
  const { control, watch, setValue } = form;
  const connectionType = watch("connectionType");
  const urgent = watch("urgent");

  const connectionTypes = [
    { value: "definitif", label: "Définitif", description: "Raccordement permanent" },
    { value: "provisoire", label: "Provisoire", description: "Raccordement temporaire" },
    { value: "augmentation", label: "Augmentation puissance", description: "Modification raccordement existant" },
    { value: "collectif", label: "Collectif", description: "Raccordement collectivités" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          Informations complémentaires
        </h3>
        <p className="text-muted-foreground">
          Précisez les détails techniques de votre raccordement
        </p>
      </div>

      <FormField
        control={control}
        name="connectionType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de raccordement *</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                {connectionTypes.map((type) => (
                  <Card 
                    key={type.value}
                    className={`p-4 cursor-pointer hover:border-primary transition-colors ${
                      connectionType === type.value ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <Label 
                      htmlFor={type.value} 
                      className="cursor-pointer flex items-center space-x-3"
                    >
                      <RadioGroupItem value={type.value} id={type.value} />
                      <div>
                        <div className="font-medium text-foreground">{type.label}</div>
                        <div className="text-sm text-muted-foreground">{type.description}</div>
                      </div>
                    </Label>
                  </Card>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="power"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Puissance souhaitée (kVA) *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 12" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {connectionType === "collectif" && (
          <FormField
            control={control}
            name="dwellings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de logements</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <FormField
        control={control}
        name="urgent"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                Demande urgente
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Cocher si vous avez besoin d'un traitement prioritaire
              </p>
            </div>
          </FormItem>
        )}
      />

      {urgent && (
        <Card className="p-4 border-orange-200 bg-orange-50">
          <p className="text-sm text-orange-800">
            <strong>Demande urgente:</strong> Votre dossier sera traité en priorité. 
            Des frais supplémentaires peuvent s'appliquer.
          </p>
        </Card>
      )}

      <FormField
        control={control}
        name="comments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Commentaires (optionnel)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Précisions sur votre projet, contraintes particulières..."
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};