import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Users, Building, MapPin } from "lucide-react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

interface StepClientTypeProps {
  form: UseFormReturn<any>;
}

export const StepClientType = ({ form }: StepClientTypeProps) => {
  const clientTypes = [
    {
      value: "particulier",
      label: "Particulier",
      description: "Propriétaire ou locataire d'un logement",
      icon: Users,
    },
    {
      value: "professionnel",
      label: "Professionnel",
      description: "Entreprise, société, auto-entrepreneur",
      icon: Building,
    },
    {
      value: "collectivite",
      label: "Collectivité",
      description: "Mairie, établissement public",
      icon: MapPin,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Quel type de demandeur êtes-vous ?
        </h2>
        <p className="text-muted-foreground">
          Sélectionnez le type qui correspond à votre situation
        </p>
      </div>

      <FormField
        control={form.control}
        name="clientType"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-1 gap-4"
              >
                {clientTypes.map((type) => (
                  <div key={type.value} className="relative">
                    <RadioGroupItem
                      value={type.value}
                      id={type.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={type.value}
                      className="peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:border-primary border border-border rounded-xl p-6 flex items-start space-x-4 cursor-pointer hover:bg-accent/50 transition-all duration-200"
                    >
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <type.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{type.label}</h3>
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
  );
};