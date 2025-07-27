import { Calculator, BarChart3, FileText, CheckCircle, TrendingUp, Clock } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

const Estimation = () => {
  const features = [
    {
      title: "Estimation Précise",
      description: "Calcul détaillé et transparent de tous les coûts : raccordement, branchement, mise en service et frais annexes.",
      icon: <Calculator className="w-6 h-6 text-primary" />
    },
    {
      title: "Analyse Comparative",
      description: "Comparaison des différentes options techniques avec analyse coût/bénéfice pour optimiser votre investissement.",
      icon: <BarChart3 className="w-6 h-6 text-primary" />
    },
    {
      title: "Devis Détaillé",
      description: "Document complet avec répartition des coûts, planning prévisionnel et conditions de réalisation.",
      icon: <FileText className="w-6 h-6 text-primary" />
    },
    {
      title: "Validation Technique",
      description: "Vérification de la faisabilité technique et validation des hypothèses de dimensionnement.",
      icon: <CheckCircle className="w-6 h-6 text-primary" />
    },
    {
      title: "Optimisation Coûts",
      description: "Conseils personnalisés pour optimiser les coûts sans compromettre la qualité de votre raccordement.",
      icon: <TrendingUp className="w-6 h-6 text-primary" />
    },
    {
      title: "Délais Prévisionnels",
      description: "Planning détaillé avec étapes clés et délais réalistes pour planifier votre projet en conséquence.",
      icon: <Clock className="w-6 h-6 text-primary" />
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Collecte des informations",
      description: "Recueil détaillé de vos besoins, contraintes techniques, localisation et spécificités de votre projet."
    },
    {
      step: "2",
      title: "Analyse technique approfondie",
      description: "Étude de faisabilité, dimensionnement, choix des solutions techniques optimales pour votre situation."
    },
    {
      step: "3",
      title: "Chiffrage détaillé",
      description: "Calcul précis des coûts avec consultation de nos partenaires et tarification Enedis actualisée."
    },
    {
      step: "4",
      title: "Présentation du devis",
      description: "Remise d'un devis détaillé avec explications techniques et recommandations personnalisées."
    },
    {
      step: "5",
      title: "Accompagnement décision",
      description: "Support pour vous aider à prendre la meilleure décision avec comparaison des options disponibles."
    }
  ];

  const benefits = [
    "Estimation gratuite et sans engagement de votre part",
    "Chiffrage précis basé sur les tarifs Enedis officiels",
    "Analyse comparative des différentes solutions possibles",
    "Conseils d'optimisation pour réduire les coûts",
    "Validation technique de la faisabilité de votre projet",
    "Planning prévisionnel détaillé des étapes",
    "Transparence totale sur tous les coûts impliqués",
    "Support conseil pour optimiser votre investissement"
  ];

  const targetAudience = [
    "Vous voulez connaître le coût précis de votre raccordement",
    "Vous comparez plusieurs options techniques possibles",
    "Vous préparez le budget de votre projet de construction",
    "Vous cherchez à optimiser les coûts de raccordement",
    "Vous avez besoin d'un chiffrage pour vos financements",
    "Vous voulez valider la faisabilité économique du projet",
    "Vous devez présenter un budget détaillé à vos associés",
    "Vous souhaitez anticiper tous les frais de raccordement"
  ];

  return (
    <ServicePageLayout
      title="Estimation Coûts Raccordement"
      subtitle="Budgétisation & Conseil"
      description="Estimation précise et gratuite des coûts de raccordement électrique. Analyse technique, devis détaillé, optimisation budget."
      features={features}
      steps={steps}
      benefits={benefits}
      targetAudience={targetAudience}
      price="Gratuit"
      duration="24 à 48h"
      ctaText="Obtenir mon estimation gratuite"
      seoTitle="Estimation Coût Raccordement Électrique | Devis Gratuit | Calcul Précis"
      seoDescription="Estimation gratuite coût raccordement électrique. Devis détaillé, analyse technique, optimisation budget. Calcul précis en 24h."
    />
  );
};

export default Estimation;