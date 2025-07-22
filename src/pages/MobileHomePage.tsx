import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Zap, 
  Shield, 
  Clock, 
  CheckCircle, 
  Menu, 
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

const services = [
  {
    icon: <Home className="h-6 w-6" />,
    title: "Maison neuve",
    description: "Raccordement électrique pour construction neuve",
    price: "À partir de 199€",
    popular: false
  },
  {
    icon: <Sun className="h-6 w-6" />,
    title: "Photovoltaïque",
    description: "Installation et raccordement panneaux solaires",
    price: "À partir de 299€",
    popular: true
  },
  {
    icon: <Building className="h-6 w-6" />,
    title: "Modification",
    description: "Changement de puissance ou modification",
    price: "À partir de 149€",
    popular: false
  },
  {
    icon: <Factory className="h-6 w-6" />,
    title: "Industriel",
    description: "Raccordement haute puissance pour entreprises",
    price: "Sur devis",
    popular: false
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

  const navigationItems = [
    { label: "Accueil", href: "/" },
    { label: "Services", href: "#services" },
    { label: "À propos", href: "/a-propos" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/55f86fce-e7c0-4a55-95e2-4c1c19dcbc0f.png" 
              alt="raccordement.net" 
              className="h-8 w-auto" 
            />
            <span className="font-bold text-lg text-gray-900">raccordement.net</span>
          </div>
          
          <div className="flex items-center gap-2">
            <a 
              href="tel:0969321800" 
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Phone className="h-5 w-5" />
            </a>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 space-y-4">
                  {navigationItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block py-3 px-4 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="pt-4 border-t">
                    <Button asChild className="w-full">
                      <a href="tel:0969321800">
                        <Phone className="h-4 w-4 mr-2" />
                        09 69 32 18 00
                      </a>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            ⚡ Service express 24h
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Raccordement électrique
            <br />
            <span className="text-blue-600">simplifié</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Démarches Enedis facilitées pour particuliers et professionnels. 
            Devis gratuit en 2 minutes.
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
      <section className="px-4 py-8" id="services">
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
                <Card className="relative border-2 hover:border-blue-200 transition-colors cursor-pointer">
                  {service.popular && (
                    <Badge className="absolute -top-2 left-4 bg-orange-500 hover:bg-orange-500">
                      <Star className="h-3 w-3 mr-1" />
                      Populaire
                    </Badge>
                  )}
                  
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
                          <p className="text-gray-600 text-sm mb-3">
                            {service.description}
                          </p>
                          <div className="text-blue-600 font-bold">
                            {service.price}
                          </div>
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
        <div className="text-center space-y-4">
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
      <section className="px-4 py-8">
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
                title: "Devis personnalisé",
                description: "Recevez votre devis gratuit sous 24h"
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
            href="tel:0969321800"
            className="flex-1"
          >
            <Button variant="outline" className="w-full h-12 text-base">
              <Phone className="h-4 w-4 mr-2" />
              Appeler
            </Button>
          </a>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="flex-[2] h-12 text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                Devis gratuit
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-full max-h-full m-0 p-0 border-0">
              <DialogHeader className="sr-only">
                <DialogTitle>Formulaire de demande</DialogTitle>
              </DialogHeader>
              <MobileMultiStepForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Bottom Spacer to prevent content being hidden behind fixed CTA */}
      <div className="h-20" />
    </div>
  );
};

export default MobileHomePage;