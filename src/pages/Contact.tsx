import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [callbackForm, setCallbackForm] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isSubmittingCallback, setIsSubmittingCallback] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [contactError, setContactError] = useState("");
  const [callbackError, setCallbackError] = useState("");
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError("");
    
    if (!contactForm.firstName || !contactForm.lastName || !contactForm.email || !contactForm.phone || !contactForm.subject || !contactForm.message) {
      setContactError("Tous les champs sont requis.");
      return;
    }
    
    if (!validateEmail(contactForm.email)) {
      setContactError("Veuillez entrer une adresse email valide.");
      return;
    }
    
    setIsSubmittingContact(true);
    
    try {
      console.log('Submitting contact form...');
      const { error } = await supabase
        .from('messages')
        .insert({
          name: `${contactForm.firstName} ${contactForm.lastName}`,
          email: contactForm.email,
          phone: contactForm.phone,
          message: `Sujet: ${contactForm.subject}\n\n${contactForm.message}`,
          request_type: 'contact'
        });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Contact form submitted successfully');
      
      setContactSubmitted(true);
      setContactForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCallbackError("");
    
    if (!callbackForm.name || !callbackForm.phone || !callbackForm.email) {
      setCallbackError("Tous les champs sont requis.");
      return;
    }
    
    if (!validateEmail(callbackForm.email)) {
      setCallbackError("Veuillez entrer une adresse email valide.");
      return;
    }
    
    setIsSubmittingCallback(true);
    
    try {
      console.log('Submitting callback form...');
      const { error } = await supabase
        .from('messages')
        .insert({
          name: callbackForm.name,
          email: callbackForm.email,
          phone: callbackForm.phone,
          message: "Demande de rappel téléphonique",
          request_type: 'callback'
        });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Callback form submitted successfully');
      
      setCallbackSubmitted(true);
      setCallbackForm({
        name: "",
        phone: "",
        email: ""
      });
    } catch (error) {
      console.error('Error submitting callback form:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la demande.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingCallback(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Contact</h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Envoyez-nous un message</h2>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    placeholder="Prénom" 
                    value={contactForm.firstName}
                    onChange={(e) => setContactForm(prev => ({...prev, firstName: e.target.value}))}
                    required
                  />
                  <Input 
                    placeholder="Nom" 
                    value={contactForm.lastName}
                    onChange={(e) => setContactForm(prev => ({...prev, lastName: e.target.value}))}
                    required
                  />
                </div>
                <Input 
                  placeholder="Email" 
                  type="email" 
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({...prev, email: e.target.value}))}
                  required
                />
                <Input 
                  placeholder="Téléphone" 
                  type="tel" 
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(prev => ({...prev, phone: e.target.value}))}
                  required
                />
                <Input 
                  placeholder="Sujet" 
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({...prev, subject: e.target.value}))}
                  required
                />
                <Textarea 
                  placeholder="Votre message" 
                  rows={5} 
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({...prev, message: e.target.value}))}
                  required
                />
                {contactError && (
                  <p className="text-red-500 text-sm">{contactError}</p>
                )}
                {contactSubmitted && (
                  <p className="text-green-600 text-sm">✅ Message envoyé. Un conseiller vous contactera rapidement.</p>
                )}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmittingContact || contactSubmitted}
                >
                  {isSubmittingContact ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi...
                    </>
                  ) : contactSubmitted ? (
                    "Message envoyé ✓"
                  ) : (
                    "Envoyer le message"
                  )}
                </Button>
              </form>
            </Card>
            
            {/* Contact Info and Callback Form */}
            <div className="space-y-6">
              {/* Callback Form */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Être rappelé gratuitement</h3>
                <form onSubmit={handleCallbackSubmit} className="space-y-4">
                  <Input
                    placeholder="Votre nom"
                    value={callbackForm.name}
                    onChange={(e) => setCallbackForm(prev => ({...prev, name: e.target.value}))}
                    required
                  />
                  <Input
                    placeholder="Votre téléphone"
                    type="tel"
                    value={callbackForm.phone}
                    onChange={(e) => setCallbackForm(prev => ({...prev, phone: e.target.value}))}
                    required
                  />
                  <Input
                    placeholder="Votre email"
                    type="email"
                    value={callbackForm.email}
                    onChange={(e) => setCallbackForm(prev => ({...prev, email: e.target.value}))}
                    required
                  />
                  {callbackError && (
                    <p className="text-red-500 text-sm">{callbackError}</p>
                  )}
                  {callbackSubmitted && (
                    <p className="text-green-600 text-sm">✅ Message envoyé. Un conseiller vous contactera rapidement.</p>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmittingCallback || callbackSubmitted}
                  >
                    {isSubmittingCallback ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi...
                      </>
                    ) : callbackSubmitted ? (
                      "Demande envoyée ✓"
                    ) : (
                      "Demander un rappel"
                    )}
                  </Button>
                </form>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Informations de contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">09 70 95 70 70</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">contact@raccordement-connect.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Partout en France</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Horaires d'ouverture</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span>8h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span>9h00 - 12h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span>Fermé</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Contact;