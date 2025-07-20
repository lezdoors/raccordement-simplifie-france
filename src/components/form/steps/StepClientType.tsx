import { UseFormReturn } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Building, Users } from "lucide-react";

interface StepClientTypeProps {
  form: UseFormReturn<any>;
}

export const StepClientType = ({ form }: StepClientTypeProps) => {
  const { register, watch, setValue } = form;
  const clientType = watch("clientType");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          Type de demandeur
        </h3>
        <p className="text-muted-foreground">
          Sélectionnez le type de raccordement qui correspond à votre situation
        </p>
      </div>

      <RadioGroup
        value={clientType}
        onValueChange={(value) => setValue("clientType", value)}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className={`p-6 cursor-pointer hover:border-primary transition-colors ${
          clientType === "particulier" ? "border-primary bg-primary/5" : ""
        }`}>
          <Label 
            htmlFor="particulier" 
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            <RadioGroupItem value="particulier" id="particulier" className="sr-only" />
            <User className="w-12 h-12 text-primary" />
            <div className="text-center">
              <h4 className="font-semibold text-foreground">Particulier</h4>
              <p className="text-sm text-muted-foreground">
                Raccordement résidentiel
              </p>
            </div>
          </Label>
        </Card>

        <Card className={`p-6 cursor-pointer hover:border-primary transition-colors ${
          clientType === "professionnel" ? "border-primary bg-primary/5" : ""
        }`}>
          <Label 
            htmlFor="professionnel" 
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            <RadioGroupItem value="professionnel" id="professionnel" className="sr-only" />
            <Building className="w-12 h-12 text-primary" />
            <div className="text-center">
              <h4 className="font-semibold text-foreground">Professionnel</h4>
              <p className="text-sm text-muted-foreground">
                Raccordement entreprise
              </p>
            </div>
          </Label>
        </Card>

        <Card className={`p-6 cursor-pointer hover:border-primary transition-colors ${
          clientType === "collectivite" ? "border-primary bg-primary/5" : ""
        }`}>
          <Label 
            htmlFor="collectivite" 
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            <RadioGroupItem value="collectivite" id="collectivite" className="sr-only" />
            <Users className="w-12 h-12 text-primary" />
            <div className="text-center">
              <h4 className="font-semibold text-foreground">Collectivité</h4>
              <p className="text-sm text-muted-foreground">
                Raccordement collectivités
              </p>
            </div>
          </Label>
        </Card>
      </RadioGroup>
    </div>
  );
};