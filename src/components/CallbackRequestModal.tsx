import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const callbackSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  preferredTime: z.string().min(1, "Le créneau préféré est requis"),
  message: z.string().optional(),
});

type CallbackFormData = z.infer<typeof callbackSchema>;

interface CallbackRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CallbackRequestModal = ({ open, onOpenChange }: CallbackRequestModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CallbackFormData>({
    resolver: zodResolver(callbackSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      preferredTime: "",
      message: "",
    },
  });

  const onSubmit = async (data: CallbackFormData) => {
    setIsSubmitting(true);
    
    try {
      // Save to unified leads table
      const { error: leadError } = await supabase
        .from('leads_raccordement')
        .insert({
          nom: data.lastName,
          prenom: data.firstName,
          email: data.email,
          telephone: data.phone,
          type_client: 'particulier',
          commentaires: `DEMANDE DE RAPPEL - Créneau préféré: ${data.preferredTime}${data.message ? `. Message: ${data.message}` : ''}`,
          form_type: 'callback',
          etat_projet: 'nouveau',
          consent_accepted: true,
          amount: 0
        });

      if (leadError) throw leadError;

      // Send notification to team
      await supabase.functions.invoke('notify-team-message', {
        body: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          message: `Demande de rappel - Créneau préféré: ${data.preferredTime}${data.message ? `. Message: ${data.message}` : ''}`,
          request_type: 'callback'
        }
      });
      
      toast({
        title: "Demande envoyée !",
        description: "Nous vous rappellerons dans les plus brefs délais.",
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting callback request:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la demande.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Demander un rappel gratuit
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre prénom" {...field} />
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
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input placeholder="votre@email.com" type="email" {...field} />
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
                    <FormLabel>Téléphone *</FormLabel>
                    <FormControl>
                      <Input placeholder="06 12 34 56 78" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="preferredTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Créneau préféré *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Lundi matin, 14h-16h..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message complémentaire (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Précisez votre demande..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi..." : "Demander un rappel"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CallbackRequestModal;