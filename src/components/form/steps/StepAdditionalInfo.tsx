import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Zap, Clock, TrendingUp, Building } from "lucide-react";

interface StepAdditionalInfoProps {
  form: UseFormReturn<any>;
}

export const StepAdditionalInfo = ({ form }: StepAdditionalInfoProps) => {
  const connectionType = form.watch("connectionType");

  const connectionTypes = [
    {
      value: "definitif",
      label: "Raccordement définitif",
      description: "Installation permanente avec compteur définitif",
      icon: Zap,
    },
    {
      value: "provisoire",
      label: "Raccordement provisoire",
      description: "Installation temporaire (chantier, événement...)",
      icon: Clock,
    },
    {
      value: "augmentation",
      label: "Augmentation de puissance",
      description: "Modification d'un raccordement existant",
      icon: TrendingUp,
    },
    {
      value: "collectif",
      label: "Raccordement collectif",
      description: "Immeuble ou copropriété",
      icon: Building,
    },
  ];

  const powerOptions = [
    { value: "3", label: "3 kVA" },
    { value: "6", label: "6 kVA" },
    { value: "9", label: "9 kVA" },
    { value: "12", label: "12 kVA" },
    { value: "15", label: "15 kVA" },
    { value: "18", label: "18 kVA" },
    { value: "24", label: "24 kVA" },
    { value: "30", label: "30 kVA" },
    { value: "36", label: "36 kVA" },
    { value: "autre", label: "Autre puissance" },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Détails du raccordement
        </h2>
        <p className="text-muted-foreground">
          Précisez vos besoins pour votre raccordement électrique
        </p>
      </div>

      {/* Type de raccordement */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Type de raccordement *</h3>
        <FormField
          control={form.control}
          name="connectionType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {connectionTypes.map((type) => (
                    <div key={type.value} className="relative">
                      <RadioGroupItem
                        value={type.value}
                        id={type.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={type.value}
                        className="peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:border-primary border border-border rounded-xl p-4 flex items-start space-x-3 cursor-pointer hover:bg-accent/50 transition-all duration-200"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <type.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{type.label}</h4>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Puissance souhaitée */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="power"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">Puissance souhaitée *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Sélectionnez la puissance" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {powerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Nombre de logements pour collectif */}
      {connectionType === "collectif" && (
        <FormField
          control={form.control}
          name="dwellings"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">Nombre de logements *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Nombre de logements" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} logement{num > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                  <SelectItem value="plus20">Plus de 20 logements</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Demande urgente */}
      <FormField
        control={form.control}
        name="urgent"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base font-medium">
                Demande urgente
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Cochez si vous avez besoin d'un traitement prioritaire (supplément applicable)
              </p>
            </div>
          </FormItem>
        )}
      />

      {/* Commentaires */}
      <FormField
        control={form.control}
        name="comments"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-medium">Commentaires ou précisions</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Ajoutez toute information utile concernant votre projet..."
                className="min-h-[100px] text-base"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};