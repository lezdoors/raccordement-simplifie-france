import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  Phone,
  Star,
  Zap,
  ArrowRight,
  Users,
  Award,
  Target
} from "lucide-react";

const MobileBottomSheet = ({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {children}
      </motion.div>
    </div>
  );
};

const MobileFeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay = 0 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="text-center p-6"
    >
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

const MobileTestimonialCard = ({ 
  rating, 
  comment, 
  author, 
  project 
}: { 
  rating: number; 
  comment: string; 
  author: string; 
  project: string;
}) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-1 mb-3">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-gray-700 mb-4 italic">
          "{comment}"
        </p>
        <div className="border-t pt-3">
          <p className="font-medium text-gray-900">{author}</p>
          <p className="text-sm text-gray-600">{project}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const MobileStatsSection = () => {
  const stats = [
    { number: "2,500+", label: "Clients satisfaits", icon: <Users className="h-5 w-5" /> },
    { number: "99%", label: "Satisfaction", icon: <Award className="h-5 w-5" /> },
    { number: "24h", label: "Traitement", icon: <Clock className="h-5 w-5" /> },
    { number: "100%", label: "Sécurisé", icon: <Shield className="h-5 w-5" /> }
  ];

  return (
    <section className="px-4 py-8 bg-blue-600 text-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">
          Pourquoi nous choisir ?
        </h2>
        <p className="text-blue-100">
          Des chiffres qui parlent d'eux-mêmes
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="text-center p-4"
          >
            <div className="w-12 h-12 bg-white/20 text-white rounded-xl flex items-center justify-center mx-auto mb-3">
              {stat.icon}
            </div>
            <div className="text-2xl font-bold mb-1">
              {stat.number}
            </div>
            <div className="text-sm text-blue-100">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const MobileFloatingCTA = ({ 
  onFormOpen, 
  className = "" 
}: { 
  onFormOpen: () => void; 
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className={`fixed bottom-4 left-4 right-4 z-40 ${className}`}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-900">
                Démarrer ma demande
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Réponse sous 24h garantie
            </p>
          </div>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Gratuit
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <a href="tel:0969321800" className="flex-1">
            <Button variant="outline" className="w-full">
              <Phone className="h-4 w-4 mr-2" />
              Appeler
            </Button>
          </a>
          <Button 
            onClick={onFormOpen}
            className="flex-[2] bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Commencer
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const MobilePricingCard = ({ 
  title, 
  price, 
  features, 
  popular = false,
  onSelect 
}: { 
  title: string; 
  price: string; 
  features: string[]; 
  popular?: boolean;
  onSelect: () => void;
}) => {
  return (
    <Card className={`relative ${popular ? 'border-blue-500 border-2' : 'border-gray-200'}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-600 hover:bg-blue-600">
            <Star className="h-3 w-3 mr-1" />
            Populaire
          </Badge>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </h3>
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {price}
          </div>
          {price !== "Sur devis" && (
            <p className="text-sm text-gray-600">HT</p>
          )}
        </div>
        
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={onSelect}
          className={`w-full ${popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
        >
          Choisir ce service
        </Button>
      </CardContent>
    </Card>
  );
};

export {
  MobileBottomSheet,
  MobileFeatureCard,
  MobileTestimonialCard,
  MobileStatsSection,
  MobileFloatingCTA,
  MobilePricingCard
};