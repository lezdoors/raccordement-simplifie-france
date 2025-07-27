import { Factory, Zap, Settings, Shield, TrendingUp, Users } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

const RaccordementIndustriel = () => {
  const features = [
    {
      title: "Forte Puissance",
      description: "Expertise en raccordements industriels haute puissance : de 36kVA à plusieurs MVA selon vos besoins industriels.",
      icon: <Zap className="w-6 h-6 text-primary" />
    },
    {
      title: "Solutions Techniques Complexes",
      description: "Maîtrise des raccordements HTA/BT, postes de transformation, et installations électriques industrielles spécifiques.",
      icon: <Settings className="w-6 h-6 text-primary" />
    },
    {
      title: "Accompagnement Industriel",
      description: "Équipe dédiée aux projets industriels avec compréhension des enjeux de production et de continuité de service.",
      icon: <Factory className="w-6 h-6 text-primary" />
    },
    {
      title: "Conformité Renforcée",
      description: "Respect strict des normes industrielles, sécurité renforcée et conformité aux réglementations sectorielles.",
      icon: <Shield className="w-6 h-6 text-primary" />
    },
    {
      title: "Optimisation Énergétique",
      description: "Conseil en efficacité énergétique et solutions pour optimiser vos coûts d'exploitation énergétique.",
      icon: <TrendingUp className="w-6 h-6 text-primary" />
    },
    {
      title: "Équipe Spécialisée",
      description: "Ingénieurs et techniciens spécialisés dans les installations électriques industrielles complexes.",
      icon: <Users className="w-6 h-6 text-primary" />
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Analyse des besoins industriels",
      description: "Étude approfondie de vos process industriels, puissance nécessaire, contraintes techniques et réglementaires spécifiques."
    },
    {
      step: "2",
      title: "Conception technique",
      description: "Dimensionnement du raccordement, choix du niveau de tension, conception du poste de livraison et schémas électriques."
    },
    {
      step: "3",
      title: "Études réglementaires",
      description: "Validation des aspects réglementaires, autorisation d'urbanisme, étude d'impact et coordination avec les organismes compétents."
    },
    {
      step: "4",
      title: "Coordination projet",
      description: "Pilotage du projet avec Enedis, RTE si nécessaire, organismes de contrôle et coordination des différents intervenants."
    },
    {
      step: "5",
      title: "Réalisation et mise en service",
      description: "Supervision des travaux, tests de mise en service, formation de vos équipes et remise de la documentation complète."
    }
  ];

  const benefits = [
    "Expertise reconnue en raccordements industriels haute puissance",
    "Maîtrise complète des normes et réglementations industrielles",
    "Équipe d'ingénieurs spécialisés en électricité industrielle",
    "Accompagnement personnalisé selon votre secteur d'activité",
    "Solutions optimisées pour réduire vos coûts d'exploitation",
    "Respect des délais critiques pour vos projets industriels",
    "Support technique permanent et maintenance préventive",
    "Références dans tous les secteurs industriels"
  ];

  const targetAudience = [
    "Vous créez ou agrandissez une unité de production industrielle",
    "Vous avez besoin d'une puissance électrique supérieure à 250 kVA",
    "Votre activité nécessite un raccordement HTA (haute tension)",
    "Vous installez des équipements industriels énergivores",
    "Votre projet nécessite un poste de transformation privé",
    "Vous développez une zone industrielle ou un site logistique",
    "Vous cherchez à optimiser vos coûts énergétiques industriels",
    "Votre secteur a des contraintes réglementaires spécifiques"
  ];

  return (
    <ServicePageLayout
      title="Raccordement Électrique Industriel"
      subtitle="Industrie & Production"
      description="Expert en raccordements électriques industriels haute puissance. Solutions techniques pour tous secteurs industriels."
      features={features}
      steps={steps}
      benefits={benefits}
      targetAudience={targetAudience}
      price="Sur mesure"
      duration="6 à 12 mois"
      ctaText="Étudier mon projet industriel"
      seoTitle="Raccordement Électrique Industriel | Haute Puissance | Expert Enedis HTA"
      seoDescription="Spécialiste raccordement électrique industriel. Haute puissance, HTA/BT, postes transformation. Expertise tous secteurs. Devis personnalisé."
    />
  );
};

export default RaccordementIndustriel;