import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface FormData {
  clientType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  workAddress: string;
  power: string;
  description: string;
}

export const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const methods = useForm<FormData>({
    defaultValues: {
      clientType: "particulier",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      workAddress: "",
      power: "",
      description: "",
    },
  });

  const { register, handleSubmit, formState: { errors } } = methods;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert({
          email: data.email,
          full_name: `${data.firstName} ${data.lastName}`,
          phone: data.phone,
          type_client: data.clientType,
          service: 'form_submission',
          status: 'new',
          source: 'multi_step_form'
        })
        .select()
        .single();

      if (leadError) throw leadError;

      toast.success('Demande soumise avec succès !');
      navigate(`/merci?leadId=${leadData.id}`);
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error('Erreur lors de la soumission du formulaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Demande de raccordement électrique
            </CardTitle>
            <Progress value={100} className="h-2" />
          </CardHeader>
        </Card>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardContent className="p-8 space-y-6">
                <div>
                  <Label htmlFor="clientType">Type de client</Label>
                  <Select defaultValue="particulier">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="particulier">Particulier</SelectItem>
                      <SelectItem value="professionnel">Professionnel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input {...register("firstName", { required: "Prénom requis" })} />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input {...register("lastName", { required: "Nom requis" })} />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" {...register("email", { required: "Email requis" })} />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input {...register("phone", { required: "Téléphone requis" })} />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>

                <div>
                  <Label htmlFor="workAddress">Adresse des travaux</Label>
                  <Input {...register("workAddress", { required: "Adresse requise" })} />
                  {errors.workAddress && <p className="text-red-500 text-sm">{errors.workAddress.message}</p>}
                </div>

                <div>
                  <Label htmlFor="power">Puissance souhaitée</Label>
                  <Input {...register("power")} placeholder="ex: 12 kVA" />
                </div>

                <div>
                  <Label htmlFor="description">Description du projet</Label>
                  <Input {...register("description")} placeholder="Décrivez votre projet..." />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end mt-8">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8"
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};