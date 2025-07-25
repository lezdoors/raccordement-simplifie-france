import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  Phone, 
  Star,
  ArrowRight,
  Building,
  Home,
  Sun,
  Factory,
  ChevronRight
} from "lucide-react";
import MobileMultiStepForm from "@/components/MobileMultiStepForm";
import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";
import MobileFormFixed from "@/components/MobileFormFixed";

const services = [
  {
    icon: <Home className="h-6 w-6" />,
    title: "Maison neuve",
    description: "Raccordement électrique pour construction neuve"
  },
  {
    icon: <Sun className="h-6 w-6" />,
    title: "Photovoltaïque",
    description: "Installation et raccordement panneaux solaires"
  },
  {
    icon: <Building className="h-6 w-6" />,
    title: "Modification",
    description: "Changement de puissance ou modification"
  },
  {
    icon: <Factory className="h-6 w-6" />,
    title: "Industriel",
    description: "Raccordement haute puissance pour entreprises"
  }
];

const features = [
  {
    icon: <Shield className="h-5 w-5" />,
    title: "100% sécurisé",
    description: "Procédures certifiées Enedis"
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Rapide",
    description: "Traitement en 24-48h"
  },
  {
    icon: <CheckCircle className="h-5 w-5" />,
    title: "Garanti",
    description: "Satisfaction client 99%"
  }
];

const MobileHomePage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Use existing Navigation component */}
      <Navigation />

      {/* Hero Section */}
      <section className="px-4 py-12 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            Service express 24h
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Raccordement électrique
            <br />
            <span className="text-blue-600">simplifié</span>
          </h1>
          
            <p className="text-gray-600 max-w-md mx-auto">
              Démarches Enedis facilitées pour particuliers et professionnels. 
              Demande en 2 minutes.
            </p>

          {/* Features Row */}
          <div className="flex justify-center gap-6 py-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-2">
                <div className="text-green-600">
                  {feature.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {feature.title}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Services Cards */}
      <section className="px-4 py-8 max-w-4xl mx-auto" id="services">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Nos services
            </h2>
            <p className="text-gray-600">
              Solutions adaptées à tous vos besoins
            </p>
          </div>

          <div className="space-y-4">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="border-2 hover:border-blue-200 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                          {service.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {service.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-8 bg-gray-50">
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <p className="text-gray-600">
            <span className="font-bold text-gray-900">4.9/5</span> sur Google
          </p>
          <p className="text-sm text-gray-500">
            Plus de 2,500 clients satisfaits
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="px-4 py-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Comment ça marche ?
            </h2>
            <p className="text-gray-600">
              Simple et rapide en 3 étapes
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Formulaire en 2 min",
                description: "Remplissez notre formulaire simple et sécurisé"
              },
              {
                step: "02", 
                title: "Demande personnalisée",
                description: "Recevez votre devis sous 24h"
              },
              {
                step: "03",
                title: "Démarches Enedis",
                description: "Nous gérons tout avec Enedis jusqu'au raccordement"
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50">
        <div className="flex gap-3">
          <a
            href="tel:0970709570"
            className="flex-1"
          >
            <Button variant="outline" className="w-full h-12 text-base">
              <Phone className="h-4 w-4 mr-2" />
              📞 Appeler
            </Button>
          </a>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
            <Button className="flex-[2] h-12 text-base bg-gradient-to-r from-[#1b2b65] to-[#edc674] hover:from-[#15254b] hover:to-[#d4b666] text-white font-semibold">
                Démarrer ma demande
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-full max-h-full m-0 p-0 border-0">
              <DialogHeader className="sr-only">
                <DialogTitle>Formulaire de demande</DialogTitle>
              </DialogHeader>
              <MobileFormFixed onClose={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Bottom Spacer to prevent content being hidden behind fixed CTA */}
      <div className="h-20" />
      
      {/* Use existing Footer component */}
      <FooterSection />
    </div>
  );
};

export default MobileHomePage;