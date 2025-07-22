import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Home, TrendingUp, Zap, ArrowUpRight, Info } from "lucide-react";

interface StepTechnicalDetailsProps {
  form: UseFormReturn<any>;
}

export const StepTechnicalDetails = ({ form }: StepTechnicalDetailsProps) => {
  const powerType = form.watch("powerType");

  const getMonoPowerOptions = () => [
    { value: "3", label: "3 kVA", description: "Habitation standard" },
    { value: "6", label: "6 kVA", description: "Habitation confortable" },
    { value: "9", label: "9 kVA", description: "Grande habitation" },
    { value: "12", label: "12 kVA", description: "Très grande habitation" },
  ];

  const getTriPowerOptions = () => [
    { value: "12", label: "12 kVA", description: "Petite installation" },
    { value: "15", label: "15 kVA", description: "Installation standard" },
    { value: "18", label: "18 kVA", description: "Installation élevée" },
    { value: "24", label: "24 kVA", description: "Grande installation" },
    { value: "30", label: "30 kVA", description: "Très grande installation" },
    { value: "36", label: "36 kVA", description: "Installation industrielle" },
    { value: "tarif_jaune", label: ">36 kVA (Tarif Jaune)", description: "Installation industrielle haute puissance" },
  ];

  const getCurrentPowerOptions = () => {
    if (powerType === "monophase") return getMonoPowerOptions();
    if (powerType === "triphase") return getTriPowerOptions();
    return [];
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
          Détails techniques
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Précisez les caractéristiques de votre raccordement
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {/* Adresse du projet */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Adresse du projet</h3>
          
          <FormField
            control={form.control}
            name="workStreet"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Rue / Numéro *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex: 123 rue de la République"
                    className="h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <p className="text-sm text-muted-foreground">
            Le code postal et la ville utilisés seront ceux renseignés à l'étape précédente.
          </p>
        </div>

        {/* Détails techniques */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-foreground">Détails techniques</h3>

          {/* Type de raccordement */}
          <FormField
            control={form.control}
            name="connectionType"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-base font-medium">Type de raccordement *</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="relative">
                      <RadioGroupItem value="nouveau_raccordement" id="nouveau_raccordement" className="peer sr-only" />
                      <Label htmlFor="nouveau_raccordement" className="peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:border-primary border-2 border-border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-all duration-200 flex items-start space-x-3">
                        <Home className="w-5 h-5 mt-0.5 text-primary" />
                        <div>
                          <div className="font-semibold">Nouveau raccordement</div>
                          <div className="text-sm text-muted-foreground">Raccordement définitif pour une nouvelle construction ou un terrain vierge</div>
                        </div>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem value="augmentation_puissance" id="augmentation_puissance" className="peer sr-only" />
                      <Label htmlFor="augmentation_puissance" className="peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:border-primary border-2 border-border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-all duration-200 flex items-start space-x-3">
                        <TrendingUp className="w-5 h-5 mt-0.5 text-primary" />
                        <div>
                          <div className="font-semibold">Augmentation de puissance</div>
                          <div className="text-sm text-muted-foreground">Augmenter la puissance de votre installation électrique existante</div>
                        </div>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem value="raccordement_provisoire" id="raccordement_provisoire" className="peer sr-only" />
                      <Label htmlFor="raccordement_provisoire" className="peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:border-primary border-2 border-border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-all duration-200 flex items-start space-x-3">
                        <Zap className="w-5 h-5 mt-0.5 text-primary" />
                        <div>
                          <div className="font-semibold">Raccordement provisoire</div>
                          <div className="text-sm text-muted-foreground">Raccordement temporaire pour chantier ou événement ponctuel</div>
                        </div>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem value="deplacement_compteur" id="deplacement_compteur" className="peer sr-only" />
                      <Label htmlFor="deplacement_compteur" className="peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:border-primary border-2 border-border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-all duration-200 flex items-start space-x-3">
                        <ArrowUpRight className="w-5 h-5 mt-0.5 text-primary" />
                        <div>
                          <div className="font-semibold">Déplacement de compteur</div>
                          <div className="text-sm text-muted-foreground">Déplacer votre compteur Linky ou installation électrique existante</div>
                        </div>
                      </Label>
                    </div>

                    <div className="relative md:col-span-2">
                      <RadioGroupItem value="autre_demande" id="autre_demande" className="peer sr-only" />
                      <Label htmlFor="autre_demande" className="peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:border-primary border-2 border-border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-all duration-200 flex items-start space-x-3">
                        <Info className="w-5 h-5 mt-0.5 text-primary" />
                        <div>
                          <div className="font-semibold">Autre demande</div>
                          <div className="text-sm text-muted-foreground">Modification d'installation, mise en service ou autre demande spécifique</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type de projet */}
          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-base font-medium">Type de projet *</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="relative">
                      <RadioGroupItem value="maison_individuelle" id="maison_individuelle" className="peer sr-only" />
                      <Label htmlFor="maison_individuelle" className="peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:border-primary border-2 border-border rounded-lg p-6 cursor-pointer hover:bg-accent/50 transition-all duration-200 flex flex-col items-center justify-center space-y-2">
                        <Home className="w-8 h-8 text-primary" />
                        <div className="text-lg font-semibold">Maison individuelle</div>
                        <div className="text-sm text-muted-foreground text-center">Maison unifamiliale avec jardin ou terrain privé</div>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem value="immeuble_collectif" id="immeuble_collectif" className="peer sr-only" />
                      <Label htmlFor="immeuble_collectif" className="peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:border-primary border-2 border-border rounded-lg p-6 cursor-pointer hover:bg-accent/50 transition-all duration-200 flex flex-col items-center justify-center space-y-2">
                        <div className="text-lg font-semibold">Immeuble collectif</div>
                        <div className="text-sm text-muted-foreground text-center">Appartement ou copropriété dans un bâtiment résidentiel</div>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem value="local_commercial" id="local_commercial" className="peer sr-only" />
                      <Label htmlFor="local_commercial" className="peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:border-primary border-2 border-border rounded-lg p-6 cursor-pointer hover:bg-accent/50 transition-all duration-200 flex flex-col items-center justify-center space-y-2">
                        <div className="text-lg font-semibold">Local commercial</div>
                        <div className="text-sm text-muted-foreground text-center">Boutique, bureau, restaurant ou autre activité commerciale</div>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem value="batiment_industriel" id="batiment_industriel" className="peer sr-only" />
                      <Label htmlFor="batiment_industriel" className="peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:border-primary border-2 border-border rounded-lg p-6 cursor-pointer hover:bg-accent/50 transition-all duration-200 flex flex-col items-center justify-center space-y-2">
                        <div className="text-lg font-semibold">Bâtiment industriel</div>
                        <div className="text-sm text-muted-foreground text-center">Usine, entrepôt, atelier ou installation industrielle</div>
                      </Label>
                    </div>

                    <div className="relative md:col-span-2">
                      <RadioGroupItem value="terrain_nu" id="terrain_nu" className="peer sr-only" />
                      <Label htmlFor="terrain_nu" className="peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:border-primary border-2 border-border rounded-lg p-6 cursor-pointer hover:bg-accent/50 transition-all duration-200 flex flex-col items-center justify-center space-y-2">
                        <div className="text-lg font-semibold">Terrain nu</div>
                        <div className="text-sm text-muted-foreground text-center">Terrain vierge sans construction existante nécessitant un nouveau raccordement</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type d'alimentation */}
          <FormField
            control={form.control}
            name="powerType"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-base font-medium">Type d'alimentation *</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="relative">
                      <RadioGroupItem value="monophase" id="monophase" className="peer sr-only" />
                      <Label htmlFor="monophase" className="peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:border-primary border-2 border-border rounded-lg p-6 cursor-pointer hover:bg-accent/50 transition-all duration-200 flex flex-col items-center justify-center space-y-2">
                        <div className="text-lg font-semibold">Monophasé</div>
                        <div className="text-sm text-muted-foreground text-center">Habitations standard (3-12 kVA)</div>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem value="triphase" id="triphase" className="peer sr-only" />
                      <Label htmlFor="triphase" className="peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:border-primary border-2 border-border rounded-lg p-6 cursor-pointer hover:bg-accent/50 transition-all duration-200 flex flex-col items-center justify-center space-y-2">
                        <div className="text-lg font-semibold">Triphasé</div>
                        <div className="text-sm text-muted-foreground text-center">Puissances élevées (12-36+ kVA)</div>
                      </Label>
                    </div>

                    <div className="relative">
                      <RadioGroupItem value="je_ne_sais_pas" id="je_ne_sais_pas" className="peer sr-only" />
                      <Label htmlFor="je_ne_sais_pas" className="peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:border-primary border-2 border-border rounded-lg p-6 cursor-pointer hover:bg-accent/50 transition-all duration-200 flex flex-col items-center justify-center space-y-2">
                        <div className="text-lg font-semibold">Je ne sais pas</div>
                        <div className="text-sm text-muted-foreground text-center">Un expert vous conseillera</div>
                      </Label>
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
              <FormItem className="space-y-4">
                <FormLabel className="text-base font-medium">Puissance demandée (kVA) *</FormLabel>
                {powerType === "je_ne_sais_pas" ? (
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Précisez la puissance souhaitée ou laissez vide pour conseil"
                      className="h-12 text-base"
                    />
                  </FormControl>
                ) : getCurrentPowerOptions().length > 0 ? (
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      {getCurrentPowerOptions().map((option) => (
                        <div key={option.value} className="relative">
                          <RadioGroupItem value={option.value} id={`power-${option.value}`} className="peer sr-only" />
                          <Label htmlFor={`power-${option.value}`} className="peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-primary/5 peer-checked:border-primary border-2 border-border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-all duration-200 flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{option.label}</div>
                              <div className="text-sm text-muted-foreground">{option.description}</div>
                            </div>
                            {option.value === "tarif_jaune" && (
                              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium">PRO</span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                ) : (
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Sélectionnez d'abord le type d'alimentation"
                      className="h-12 text-base"
                      disabled
                    />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};