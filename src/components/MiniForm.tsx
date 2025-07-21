import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Mail, ArrowRight } from "lucide-react";

const miniFormSchema = z.object({
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone requis"),
  projectType: z.enum(["definitif", "provisoire", "augmentation", "collectif", "photovoltaique"]),
  city: z.string().min(1, "Ville requise"),
});

type MiniFormData = z.infer<typeof miniFormSchema>;

export const MiniForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<MiniFormData>({
    resolver: zodResolver(miniFormSchema),
    defaultValues: {
      email: "",
      phone: "",
      projectType: "definitif",
      city: "",
    },
  });

  const onSubmit = async (data: MiniFormData) => {
    setIsSubmitting(true);
    
    try {
      // Send notification email
      const { error: emailError } = await supabase.functions.invoke('send-form-notification', {
        body: {
          type: 'mini-form',
          data: {
            email: data.email,
            phone: data.phone,
            projectType: data.projectType,
            city: data.city,
            timestamp: new Date().toISOString(),
          }
        }
      });

      if (emailError) {
        console.error('Email notification error:', emailError);
        // Don't block the form submission if email fails
      }

      // Store data in localStorage to pre-fill main form
      localStorage.setItem('mini-form-data', JSON.stringify(data));
      
      toast.success("Redirection vers le formulaire principal...");
      
      // Redirect to main form with data
      navigate("/raccordement-enedis");
      
    } catch (error) {
      console.error("Error submitting mini form:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass-card p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-display text-xl font-semibold text-white mb-2">
          Démarrer votre projet
        </h3>
        <p className="text-white/80 text-sm">
          Obtenez un devis personnalisé en 2 minutes
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm">Email</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email"
                    placeholder="votre@email.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm">Téléphone</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="tel"
                    placeholder="06 12 34 56 78"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm">Type de projet</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="definitif">Raccordement définitif</SelectItem>
                    <SelectItem value="provisoire">Raccordement provisoire</SelectItem>
                    <SelectItem value="augmentation">Modification puissance</SelectItem>
                    <SelectItem value="collectif">Raccordement collectif</SelectItem>
                    <SelectItem value="photovoltaique">Photovoltaïque</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm">Ville du projet</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Paris, Lyon, Marseille..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-3"
          >
            {isSubmitting ? "Envoi en cours..." : "Obtenir mon devis"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </Form>

      <p className="text-white/60 text-xs text-center mt-4">
        Réponse sous 2h • Service gratuit • Sans engagement
      </p>
    </Card>
  );
};