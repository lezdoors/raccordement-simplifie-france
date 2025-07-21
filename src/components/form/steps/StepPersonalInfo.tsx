import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useEffect, useState } from "react";

interface StepPersonalInfoProps {
  form: UseFormReturn<any>;
}

export const StepPersonalInfo = ({ form }: StepPersonalInfoProps) => {
  const clientType = form.watch("clientType");
  const [phoneValue, setPhoneValue] = useState("");

  // Format French phone number
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
    }
    return numbers.slice(0, 10).replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
  };

  const handlePhoneChange = (value: string, onChange: (value: string) => void) => {
    const formatted = formatPhoneNumber(value);
    setPhoneValue(formatted);
    onChange(value.replace(/\D/g, ""));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          {clientType === "professionnel" 
            ? "Informations de votre entreprise"
            : clientType === "collectivite"
            ? "Informations de la collectivité"
            : "Vos informations personnelles"
          }
        </h2>
        <p className="text-muted-foreground">
          Ces informations nous permettront de vous contacter
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                {clientType === "collectivite" ? "Prénom du contact" : "Prénom"} *
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Votre prénom"
                  className="h-12 text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                {clientType === "collectivite" ? "Nom du contact" : "Nom"} *
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Votre nom"
                  className="h-12 text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {clientType === "professionnel" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Raison sociale *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nom de votre entreprise"
                    className="h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="siret"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">SIRET</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Numéro SIRET (optionnel)"
                    className="h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {clientType === "collectivite" && (
        <FormField
          control={form.control}
          name="collectivityName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Nom de la collectivité *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nom de la collectivité"
                  className="h-12 text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Email *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="votre.email@exemple.fr"
                  className="h-12 text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Téléphone *</FormLabel>
              <FormControl>
                <Input
                  value={phoneValue}
                  onChange={(e) => handlePhoneChange(e.target.value, field.onChange)}
                  placeholder="06 12 34 56 78"
                  className="h-12 text-base"
                  maxLength={14}
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