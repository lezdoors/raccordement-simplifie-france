import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { AddressAutocomplete } from "../AddressAutocomplete";

interface StepWorkAddressProps {
  form: UseFormReturn<any>;
}

export const StepWorkAddress = ({ form }: StepWorkAddressProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Adresse des travaux
        </h2>
        <p className="text-muted-foreground">
          Où souhaitez-vous réaliser le raccordement électrique ?
        </p>
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="workAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Adresse complète *</FormLabel>
              <FormControl>
                <AddressAutocomplete
                  value={field.value || ""}
                  onChange={(address, city, postalCode) => {
                    field.onChange(address);
                    if (city) form.setValue("workCity", city);
                    if (postalCode) form.setValue("workPostalCode", postalCode);
                  }}
                  placeholder="Tapez votre adresse..."
                  className="h-12 text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="workPostalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Code postal *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="75001"
                    className="h-12 text-base"
                    maxLength={5}
                    pattern="[0-9]{5}"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Ville *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Paris"
                    className="h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="workAddressComplement"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Complément d'adresse</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Bâtiment, étage, appartement... (optionnel)"
                  className="h-12 text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};