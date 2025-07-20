import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { AddressAutocomplete } from "../AddressAutocomplete";

interface StepBillingAddressProps {
  form: UseFormReturn<any>;
}

export const StepBillingAddress = ({ form }: StepBillingAddressProps) => {
  const { control, watch } = form;
  const sameAsBilling = watch("sameAsBilling");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          Adresse de facturation
        </h3>
        <p className="text-muted-foreground">
          Où souhaitez-vous recevoir vos factures ?
        </p>
      </div>

      <FormField
        control={control}
        name="sameAsBilling"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Même adresse que le chantier
              </FormLabel>
            </div>
          </FormItem>
        )}
      />

      {!sameAsBilling && (
        <div className="space-y-4 border-l-2 border-primary/20 pl-4">
          <FormField
            control={control}
            name="billingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse de facturation *</FormLabel>
                <FormControl>
                  <AddressAutocomplete
                    value={field.value || ""}
                    onChange={(address, city, postalCode) => {
                      field.onChange(address);
                      if (city) form.setValue("billingCity", city);
                      if (postalCode) form.setValue("billingPostalCode", postalCode);
                    }}
                    placeholder="Tapez l'adresse de facturation..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="billingCity"
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
              name="billingPostalCode"
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
      )}
    </div>
  );
};