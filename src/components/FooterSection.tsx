import { Phone, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const FooterSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.name || !formData.phone || !formData.email) {
      setError("Tous les champs sont requis.");
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: "Demande de rappel depuis le footer",
          request_type: 'callback'
        });
      
      if (error) throw error;

      // Send notification to team
      try {
        await supabase.functions.invoke('notify-team-message', {
          body: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: "Demande de rappel depuis le footer",
            request_type: 'callback'
          }
        });
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
        // Don't throw - the message was saved successfully
      }
      
      setSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        email: ""
      });
      toast.success("Message envoyé ! Un conseiller vous contactera rapidement.");
    } catch (error) {
      console.error('Error submitting footer form:', error);
      toast.error("Une erreur est survenue lors de l'envoi de la demande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <footer className="bg-slate-800 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 pb-8">
        {/* Logo Section - Enhanced */}
        <div className="flex flex-col md:flex-row items-center justify-center mb-8 md:mb-12">
          <div className="h-20 md:h-24 w-auto mr-0 md:mr-4 mb-2 md:mb-0 flex items-center justify-center">
            <img 
              src="https://kstugxtmghinprrpkrud.supabase.co/storage/v1/object/public/logo//Votre%20Partenaire%20(Logo)-3.png" 
              alt="Raccordement Connect - Votre Partenaire Raccordement Électrique" 
              className="w-[150px] md:w-[200px] h-auto filter brightness-110"
            />
          </div>
        </div>

        {/* Mobile-first Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* LEFT COLUMN - Services Particuliers */}
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-white">Services Particuliers</h3>
            <ul className="space-y-3">
              <li>
                <a href="/maison-neuve" className="text-gray-300 hover:text-blue-400 hover:underline transition-colors duration-200">
                  Raccordement maison neuve
                </a>
              </li>
              <li>
                <a href="/photovoltaique" className="text-gray-300 hover:text-blue-400 hover:underline transition-colors duration-200">
                  Raccordement photovoltaïque
                </a>
              </li>
              <li>
                <a href="/modification-branchement" className="text-gray-300 hover:text-blue-400 hover:underline transition-colors duration-200">
                  Modification branchement
                </a>
              </li>
              <li>
                <a href="/raccordement-enedis" className="text-gray-300 hover:text-blue-400 hover:underline transition-colors duration-200">
                  Raccordement Enedis
                </a>
              </li>
            </ul>
          </div>

          {/* MIDDLE COLUMN - Services Professionnels */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Services Professionnels</h3>
            <ul className="space-y-3">
              <li>
                <a href="/raccordement-industriel" className="text-gray-300 hover:text-blue-400 hover:underline transition-colors duration-200">
                  Raccordement industriel
                </a>
              </li>
              <li>
                <a href="/raccordement-chantier" className="text-gray-300 hover:text-blue-400 hover:underline transition-colors duration-200">
                  Raccordement chantier
                </a>
              </li>
              <li>
                <a href="/service-express" className="text-gray-300 hover:text-blue-400 hover:underline transition-colors duration-200">
                  Service express
                </a>
              </li>
              <li>
                <a href="/estimation" className="text-gray-300 hover:text-blue-400 hover:underline transition-colors duration-200">
                  Estimation coûts
                </a>
              </li>
            </ul>
          </div>

          {/* RIGHT COLUMN - Contact Rapide */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Contact Rapide</h3>
            <p className="text-gray-300 mb-6">Être rappelé gratuitement</p>
            
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <Input
                type="text"
                name="name"
                placeholder="Votre nom"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400"
                required
              />
              <Input
                type="tel"
                name="phone"
                placeholder="Votre téléphone"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400"
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400"
                required
              />
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              {submitted && (
                <p className="text-green-400 text-sm">Message envoyé. Un conseiller vous contactera rapidement.</p>
              )}
              <Button 
                type="submit" 
                className="w-full"
                variant="cta"
                disabled={isSubmitting || submitted}
              >
                {isSubmitting ? (
                  <>Envoi...</>
                ) : submitted ? (
                  "Demande envoyée ✓"
                ) : (
                  "Demander un rappel"
                )}
              </Button>
            </form>

            {/* Business Hours */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Clock className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm">Lun-Ven: 8h-18h</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <a 
                  href="tel:0970709570" 
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-semibold text-lg"
                >
                  📞 09 70 70 95 70
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Mobile optimized */}
        <div className="border-t border-slate-700 mt-8 md:mt-12 pt-6 md:pt-8 pb-0 mb-0 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm md:text-base text-gray-400 text-center md:text-left leading-relaxed">
            <a 
              href="/login" 
              className="text-gray-400 hover:text-blue-400 transition-colors duration-300 no-underline cursor-pointer select-none" 
              title="Connexion CRM"
              style={{ textDecoration: 'none' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 8px rgba(59, 130, 246, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = 'none';
              }}
            >
              ©
            </a> 2024 MonElec.net. Tous droits réservés.
          </p>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm md:text-base text-gray-400 text-center">
            <a href="/mentions-legales" className="hover:text-blue-400 hover:underline transition-colors duration-200">Mentions légales</a>
            <a href="/confidentialite" className="hover:text-blue-400 hover:underline transition-colors duration-200">Confidentialité</a>
            <a href="/cgu" className="hover:text-blue-400 hover:underline transition-colors duration-200">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;