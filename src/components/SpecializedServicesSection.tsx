import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Factory, Home, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const SpecializedServicesSection = () => {
  const navigate = useNavigate();
  const [isContactingTeam, setIsContactingTeam] = useState(false);
  const services = [
    {
      category: "Services Particuliers",
      icon: Home,
      items: [
        "Raccordement maison neuve",
        "Raccordement photovoltaïque", 
        "Modification branchement",
        "Raccordement Enedis"
      ],
      badge: "Résidentiel"
    },
    {
      category: "Services Professionnels", 
      icon: Building2,
      items: [
        "Raccordement industriel",
        "Raccordement chantier",
        "Service express",
        "Estimation coûts"
      ],
      badge: "Entreprise"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Services spécialisés
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nos services spécialisés
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Des solutions adaptées à chaque profil, que vous soyez particulier ou professionnel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {service.badge}
                    </Badge>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {service.category}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {service.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:border-primary group-hover:text-primary transition-colors"
                  onClick={() => navigate('/raccordement-enedis')}
                >
                  Voir tous les services
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Factory className="w-8 h-8 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Contact Rapide</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Être rappelé gratuitement
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                <Zap className="w-5 h-5" />
                <span>Lun-Ven 8h-18h | Sam 8h-12h</span>
              </div>
              <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                <span>Questions fréquentes</span>
              </div>
              <Button 
                variant="outline"
                disabled={isContactingTeam}
                onClick={async () => {
                  setIsContactingTeam(true);
                  try {
                    // Insert lead to Supabase
                    const { error: messageError } = await supabase
                      .from('leads')
                      .insert({
                        full_name: 'Contact Rapide - Services Spécialisés',
                        email: 'contact@raccordement-connect.com',
                        phone: '',
                        service: 'contact',
                        status: 'new',
                        source: 'services_section'
                      });

                    if (messageError) throw messageError;

                    // Send notification to team
                    await supabase.functions.invoke('notify-team-message', {
                      body: {
                        name: 'Contact Rapide - Services Spécialisés',
                        email: 'contact@raccordement-connect.com',
                        message: 'Demande de contact depuis la section Services Spécialisés',
                        request_type: 'contact'
                      }
                    });

                    toast.success("Message envoyé ! Notre équipe vous contactera rapidement.");
                    navigate('/contact');
                  } catch (error) {
                    console.error('Error:', error);
                    toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
                  } finally {
                    setIsContactingTeam(false);
                  }
                }}
              >
                {isContactingTeam ? "Envoi..." : "Contact"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecializedServicesSection;