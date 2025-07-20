import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { AddressAutocomplete } from "../AddressAutocomplete";

interface StepWorkAddressProps {
  form: UseFormReturn<any>;
}

export const StepWorkAddress = ({ form }: StepWorkAddressProps) => {
  const { control } = form;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          Adresse du chantier
        </h3>
        <p className="text-muted-foreground">
          Indiquez l'adresse exacte où le raccordement doit être effectué
        </p>
      </div>

      <FormField
        control={control}
        name="workAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse complète *</FormLabel>
            <FormControl>
              <AddressAutocomplete
                value={field.value}
                onChange={(address, city, postalCode) => {
                  field.onChange(address);
                  if (city) form.setValue("workCity", city);
                  if (postalCode) form.setValue("workPostalCode", postalCode);
                }}
                placeholder="Tapez votre adresse..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="workCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville *</FormLabel>
              <FormControl>
                <Input placeholder="Ville" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="workPostalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code postal *</FormLabel>
              <FormControl>
                <Input placeholder="12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};