import { Home, Clock, Shield, FileText, CheckCircle, Zap } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

const MaisonNeuve = () => {
  const features = [
    {
      title: "Expertise Construction Neuve",
      description: "Nos experts connaissent parfaitement les spécificités des raccordements pour constructions neuves et les normes en vigueur.",
      icon: <Home className="w-6 h-6 text-primary" />
    },
    {
      title: "Accompagnement Complet",
      description: "De l'étude de faisabilité à la mise en service, nous vous accompagnons à chaque étape de votre projet de raccordement.",
      icon: <Shield className="w-6 h-6 text-primary" />
    },
    {
      title: "Coordination Chantier",
      description: "Nous coordonnons avec Enedis et les autres intervenants pour optimiser les délais et éviter les retards de chantier.",
      icon: <Clock className="w-6 h-6 text-primary" />
    },
    {
      title: "Conformité Garantie",
      description: "Tous nos raccordements sont conformes aux normes NF C 14-100 et réglementations Enedis en vigueur.",
      icon: <CheckCircle className="w-6 h-6 text-primary" />
    },
    {
      title: "Devis Transparent",
      description: "Prix fixes sans surprise avec détail de tous les coûts : raccordement, branchement et mise en service.",
      icon: <FileText className="w-6 h-6 text-primary" />
    },
    {
      title: "Installation Rapide",
      description: "Délais optimisés grâce à notre réseau de partenaires agréés Enedis sur toute la France.",
      icon: <Zap className="w-6 h-6 text-primary" />
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Analyse de votre projet",
      description: "Nous étudions vos plans, la puissance nécessaire et la faisabilité technique de votre raccordement électrique."
    },
    {
      step: "2", 
      title: "Dimensionnement et devis",
      description: "Calcul précis de la puissance, choix du type de branchement (aérien/souterrain) et établissement du devis détaillé."
    },
    {
      step: "3",
      title: "Dépôt de la demande Enedis",
      description: "Constitution et dépôt du dossier complet auprès d'Enedis avec tous les documents techniques requis."
    },
    {
      step: "4",
      title: "Coordination des travaux",
      description: "Planification et coordination avec Enedis, votre électricien et les autres corps de métiers du chantier."
    },
    {
      step: "5",
      title: "Réalisation et mise en service",
      description: "Réalisation des travaux de raccordement par Enedis et mise en service de votre installation électrique."
    }
  ];

  const benefits = [
    "Expertise spécialisée dans les raccordements de constructions neuves",
    "Accompagnement personnalisé tout au long du projet",
    "Coordination optimale avec tous les intervenants du chantier",
    "Conformité garantie aux normes Enedis et NF C 14-100",
    "Délais maîtrisés pour éviter les retards de livraison",
    "Prix transparent sans frais cachés",
    "Service client dédié et réactif",
    "Intervention sur toute la France métropolitaine"
  ];

  const targetAudience = [
    "Vous construisez une maison individuelle neuve",
    "Vous êtes promoteur immobilier ou constructeur",
    "Votre terrain n'est pas encore raccordé au réseau électrique",
    "Vous souhaitez optimiser les délais de votre projet de construction",
    "Vous cherchez un interlocuteur unique pour votre raccordement",
    "Vous voulez être sûr de la conformité de votre installation",
    "Vous avez besoin d'une puissance supérieure à 12 kVA",
    "Votre projet nécessite un raccordement souterrain ou aérien spécifique"
  ];

  return (
    <ServicePageLayout
      title="Raccordement Électrique Maison Neuve"
      subtitle="Construction Neuve"
      description="Expert en raccordement électrique pour constructions neuves. Accompagnement complet de A à Z pour votre projet de maison individuelle."
      features={features}
      steps={steps}
      benefits={benefits}
      targetAudience={targetAudience}
      price="129€"
      duration="4 à 8 semaines"
      ctaText="Obtenir mon devis maison neuve"
      seoTitle="Raccordement Électrique Maison Neuve | Expert Enedis | Devis Gratuit"
      seoDescription="Spécialiste du raccordement électrique pour maisons neuves. Accompagnement complet, délais maîtrisés, conformité garantie. Devis gratuit en 24h."
    />
  );
};

export default MaisonNeuve;