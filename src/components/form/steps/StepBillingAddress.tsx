import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { AddressAutocomplete } from "../AddressAutocomplete";

interface StepBillingAddressProps {
  form: UseFormReturn<any>;
}

export const StepBillingAddress = ({ form }: StepBillingAddressProps) => {
  const sameAsBilling = form.watch("sameAsBilling");

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Adresse de facturation
        </h2>
        <p className="text-muted-foreground">
          Où souhaitez-vous recevoir vos factures ?
        </p>
      </div>

      <FormField
        control={form.control}
        name="sameAsBilling"
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
                Identique à l'adresse des travaux
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Cochez cette case si l'adresse de facturation est la même que l'adresse des travaux
              </p>
            </div>
          </FormItem>
        )}
      />

      {!sameAsBilling && (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="billingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Adresse de facturation *</FormLabel>
                <FormControl>
                  <AddressAutocomplete
                    value={field.value}
                    onChange={(address, city, postalCode) => {
                      field.onChange(address);
                      if (city) form.setValue("billingCity", city);
                      if (postalCode) form.setValue("billingPostalCode", postalCode);
                    }}
                    placeholder="Tapez votre adresse de facturation..."
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
              name="billingPostalCode"
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
              name="billingCity"
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
            name="billingAddressComplement"
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
      )}
    </div>
  );
};