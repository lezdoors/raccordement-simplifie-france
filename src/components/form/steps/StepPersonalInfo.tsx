import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

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
    <div className="space-y-6 md:space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
          Informations personnelles
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Ces informations nous permettront de vous contacter
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {/* Civilité */}
        <FormField
          control={form.control}
          name="civilite"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base md:text-lg font-medium">Civilité *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 md:h-14 text-base">
                    <SelectValue placeholder="Sélectionnez votre civilité" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="monsieur">Monsieur</SelectItem>
                  <SelectItem value="madame">Madame</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type de client */}
        <FormField
          control={form.control}
          name="clientType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base md:text-lg font-medium">Type de client *</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="particulier" id="particulier" />
                    <Label htmlFor="particulier" className="cursor-pointer">Particulier</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="professionnel" id="professionnel" />
                    <Label htmlFor="professionnel" className="cursor-pointer">Professionnel</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="collectivite" id="collectivite" />
                    <Label htmlFor="collectivite" className="cursor-pointer">Collectivité</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Professional fields */}
        {clientType === "professionnel" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-accent/10">
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
                  <FormLabel className="text-base font-medium">SIREN *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Numéro SIREN"
                      className="h-12 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Collectivity fields */}
        {clientType === "collectivite" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-accent/10">
            <FormField
              control={form.control}
              name="collectivityName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Nom collectivité *</FormLabel>
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

            <FormField
              control={form.control}
              name="collectivitySiren"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">SIREN *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Numéro SIREN de la collectivité"
                      className="h-12 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Personal information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Prénom *</FormLabel>
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
                <FormLabel className="text-base font-medium">Nom *</FormLabel>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Code postal *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Code postal (5 chiffres)"
                    className="h-12 text-base"
                    maxLength={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Ville *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Votre ville"
                    className="h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};