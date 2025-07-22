import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface StepTechnicalDetailsProps {
  form: UseFormReturn<any>;
}

export const StepTechnicalDetails = ({ form }: StepTechnicalDetailsProps) => {
  const powerType = form.watch("powerType");

  const getMonoPowerOptions = () => [
    { value: "3", label: "3 kVA" },
    { value: "6", label: "6 kVA" },
    { value: "9", label: "9 kVA" },
    { value: "12", label: "12 kVA" },
    { value: "15", label: "15 kVA" },
    { value: "18", label: "18 kVA" },
  ];

  const getTriPowerOptions = () => [
    { value: "15", label: "15 kVA" },
    { value: "18", label: "18 kVA" },
    { value: "24", label: "24 kVA" },
    { value: "30", label: "30 kVA" },
    { value: "36", label: "36 kVA" },
  ];

  const getCurrentPowerOptions = () => {
    if (powerType === "monophase") return getMonoPowerOptions();
    if (powerType === "triphase") return getTriPowerOptions();
    return [];
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Détails techniques
        </h2>
        <p className="text-muted-foreground">
          Précisez les caractéristiques de votre raccordement
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Type de raccordement */}
        <FormField
          control={form.control}
          name="connectionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Type de raccordement *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionnez le type de raccordement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="raccordement_enedis_definitif">Raccordement Enedis Définitif</SelectItem>
                  <SelectItem value="raccordement_provisoire">Raccordement provisoire</SelectItem>
                  <SelectItem value="viabilisation_terrain">Viabilisation terrain</SelectItem>
                  <SelectItem value="modification_raccordement">Modification raccordement</SelectItem>
                  <SelectItem value="raccordement_collectif">Raccordement collectif</SelectItem>
                  <SelectItem value="raccordement_photovoltaique">Raccordement photovoltaïque</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type de projet */}
        <FormField
          control={form.control}
          name="projectType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Type de projet *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionnez le type de projet" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="maison_individuelle">Maison individuelle</SelectItem>
                  <SelectItem value="immeuble_collectif">Immeuble collectif</SelectItem>
                  <SelectItem value="local_commercial">Local commercial</SelectItem>
                  <SelectItem value="batiment_industriel">Bâtiment industriel</SelectItem>
                  <SelectItem value="terrain_nu">Terrain nu</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type d'alimentation */}
        <FormField
          control={form.control}
          name="powerType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Type d'alimentation *</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monophase" id="monophase" />
                    <Label htmlFor="monophase">Monophasé</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="triphase" id="triphase" />
                    <Label htmlFor="triphase">Triphasé</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="je_ne_sais_pas" id="je_ne_sais_pas" />
                    <Label htmlFor="je_ne_sais_pas">Je ne sais pas</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Puissance demandée */}
        <FormField
          control={form.control}
          name="powerDemanded"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Puissance demandée *</FormLabel>
              {powerType === "je_ne_sais_pas" ? (
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Précisez la puissance souhaitée"
                    className="h-12"
                  />
                </FormControl>
              ) : getCurrentPowerOptions().length > 0 ? (
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Sélectionnez la puissance" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getCurrentPowerOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Sélectionnez d'abord le type d'alimentation"
                    className="h-12"
                    disabled
                  />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Adresse complète du chantier */}
        <FormField
          control={form.control}
          name="workAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Adresse complète du chantier *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Numéro, rue, code postal, ville"
                  className="h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Numéro PDL */}
        <FormField
          control={form.control}
          name="pdlNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Numéro PDL (optionnel)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Point de livraison - si connu"
                  className="h-12"
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