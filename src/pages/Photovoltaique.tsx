import { Sun, Battery, TrendingUp, Shield, Zap, FileText } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

const Photovoltaique = () => {
  const features = [
    {
      title: "Expertise Photovoltaïque",
      description: "Spécialistes du raccordement d'installations solaires avec parfaite maîtrise des contraintes techniques et réglementaires.",
      icon: <Sun className="w-6 h-6 text-primary" />
    },
    {
      title: "Injection & Autoconsommation", 
      description: "Gestion complète des raccordements pour injection totale, autoconsommation avec vente du surplus ou autoconsommation totale.",
      icon: <Battery className="w-6 h-6 text-primary" />
    },
    {
      title: "Optimisation Énergétique",
      description: "Conseil sur le dimensionnement optimal de votre installation et la puissance de raccordement nécessaire.",
      icon: <TrendingUp className="w-6 h-6 text-primary" />
    },
    {
      title: "Conformité Technique",
      description: "Respect strict des normes NF C 15-100, NF C 14-100 et des exigences spécifiques Enedis pour le photovoltaïque.",
      icon: <Shield className="w-6 h-6 text-primary" />
    },
    {
      title: "Raccordement Prioritaire",
      description: "Procédures accélérées pour les installations photovoltaïques grâce à notre expertise et nos relations Enedis.",
      icon: <Zap className="w-6 h-6 text-primary" />
    },
    {
      title: "Documentation Complète",
      description: "Constitution de tous les dossiers techniques : CACSI, schémas unifilaires, attestations de conformité.",
      icon: <FileText className="w-6 h-6 text-primary" />
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Analyse de votre installation PV",
      description: "Étude technique de votre projet photovoltaïque : puissance, type d'onduleurs, mode de fonctionnement (injection/autoconsommation)."
    },
    {
      step: "2",
      title: "Dimensionnement du raccordement", 
      description: "Calcul de la puissance de raccordement optimale selon votre production et votre consommation électrique."
    },
    {
      step: "3",
      title: "Constitution du dossier technique",
      description: "Préparation de tous les documents requis : schémas, attestations, CACSI et demande de raccordement Enedis."
    },
    {
      step: "4",
      title: "Dépôt et suivi Enedis",
      description: "Dépôt de votre demande de raccordement photovoltaïque et suivi personnalisé jusqu'à l'accord de raccordement."
    },
    {
      step: "5",
      title: "Mise en service et contrats",
      description: "Accompagnement pour la mise en service Consuel et l'établissement des contrats d'achat avec EDF OA."
    }
  ];

  const benefits = [
    "Expertise reconnue en raccordement d'installations photovoltaïques",
    "Maîtrise parfaite des normes et réglementations spécifiques au PV",
    "Accompagnement complet de l'étude à la mise en service",
    "Optimisation de la puissance de raccordement pour réduire les coûts",
    "Procedures accélérées grâce à notre expérience Enedis",
    "Support pour tous types d'installations : résidentiel, tertiaire, industriel",
    "Aide à la constitution des dossiers de subventions et aides",
    "Service après-vente et maintenance préventive"
  ];

  const targetAudience = [
    "Vous installez des panneaux photovoltaïques sur votre toiture",
    "Vous développez un projet solaire au sol (ombrières, centrales)",
    "Vous souhaitez passer à l'autoconsommation avec vente du surplus",
    "Votre installation PV nécessite une puissance de raccordement importante",
    "Vous cherchez à optimiser votre raccordement pour réduire les coûts",
    "Vous avez besoin d'un raccordement en injection totale (revente)",
    "Votre projet photovoltaïque est en cours d'étude ou de réalisation",
    "Vous voulez sécuriser votre projet avec un expert reconnu"
  ];

  return (
    <ServicePageLayout
      title="Raccordement Photovoltaïque"
      subtitle="Énergie Solaire"
      description="Expert en raccordement d'installations photovoltaïques. Injection, autoconsommation, vente de surplus - Tous projets solaires."
      features={features}
      steps={steps}
      benefits={benefits}
      targetAudience={targetAudience}
      price="129€"
      duration="3 à 6 semaines"
      ctaText="Raccorder mon installation solaire"
      seoTitle="Raccordement Photovoltaïque | Installation Solaire | Expert Enedis PV"
      seoDescription="Spécialiste raccordement photovoltaïque. Injection totale, autoconsommation, vente surplus. Expertise technique, délais optimisés. Devis gratuit."
    />
  );
};

export default Photovoltaique;