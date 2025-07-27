import { HardHat, Clock, Shield, Wrench, Zap, Users } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

const RaccordementChantier = () => {
  const features = [
    {
      title: "Raccordement Temporaire",
      description: "Spécialistes des raccordements électriques temporaires pour chantiers de construction, rénovation et événements.",
      icon: <HardHat className="w-6 h-6 text-primary" />
    },
    {
      title: "Intervention Rapide",
      description: "Délais d'intervention optimisés pour ne pas retarder le démarrage de vos travaux de construction.",
      icon: <Clock className="w-6 h-6 text-primary" />
    },
    {
      title: "Sécurité Chantier",
      description: "Respect strict des normes de sécurité chantier avec installation conforme et protection adaptée.",
      icon: <Shield className="w-6 h-6 text-primary" />
    },
    {
      title: "Installation Professionnelle",
      description: "Mise en place d'équipements robustes et sécurisés adaptés aux contraintes des chantiers.",
      icon: <Wrench className="w-6 h-6 text-primary" />
    },
    {
      title: "Puissance Adaptée",
      description: "Dimensionnement précis selon vos besoins : outillage, grues, éclairage et installations de chantier.",
      icon: <Zap className="w-6 h-6 text-primary" />
    },
    {
      title: "Équipe Mobile",
      description: "Équipes d'intervention mobiles disponibles sur toute la France pour vos chantiers urgents.",
      icon: <Users className="w-6 h-6 text-primary" />
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Analyse des besoins chantier",
      description: "Évaluation de vos besoins électriques : outillage, éclairage, installations temporaires et durée du chantier."
    },
    {
      step: "2",
      title: "Étude technique de faisabilité",
      description: "Analyse du point de raccordement disponible, puissance nécessaire et contraintes d'implantation sur site."
    },
    {
      step: "3",
      title: "Constitution du dossier",
      description: "Préparation des documents techniques et administratifs requis pour la demande de raccordement temporaire."
    },
    {
      step: "4",
      title: "Installation et raccordement",
      description: "Mise en place du branchement provisoire avec équipements de protection et de comptage adaptés."
    },
    {
      step: "5",
      title: "Mise en service et dépose",
      description: "Mise en service immédiate et programmation de la dépose en fin de chantier selon vos besoins."
    }
  ];

  const benefits = [
    "Intervention rapide pour démarrage immédiat de chantier",
    "Équipements robustes adaptés aux contraintes du BTP",
    "Respect strict des normes de sécurité chantier",
    "Tarification transparente avec forfait dépose inclus",
    "Coordination avec les autres corps de métiers",
    "Disponibilité 7j/7 pour les chantiers d'urgence",
    "Couverture nationale avec équipes locales",
    "Facturation simplifiée et gestion administrative complète"
  ];

  const targetAudience = [
    "Vous démarrez un chantier de construction ou de rénovation",
    "Vous organisez un événement temporaire nécessitant de l'électricité",
    "Votre chantier nécessite une alimentation électrique provisoire",
    "Vous avez besoin d'électricité pour l'outillage et les installations",
    "Votre projet nécessite un éclairage de chantier sécurisé",
    "Vous cherchez une solution électrique temporaire clé en main",
    "Votre chantier a des contraintes de délais serrés",
    "Vous voulez externaliser la gestion du raccordement temporaire"
  ];

  return (
    <ServicePageLayout
      title="Raccordement Électrique de Chantier"
      subtitle="Chantier & Temporaire"
      description="Expert en raccordements électriques temporaires pour chantiers. Solution clé en main, intervention rapide, sécurité garantie."
      features={features}
      steps={steps}
      benefits={benefits}
      targetAudience={targetAudience}
      price="129€"
      duration="48h à 1 semaine"
      ctaText="Alimenter mon chantier"
      seoTitle="Raccordement Électrique Chantier | Temporaire | Intervention Rapide"
      seoDescription="Spécialiste raccordement électrique chantier temporaire. Intervention rapide, sécurité chantier, équipements robustes. Devis immédiat."
    />
  );
};

export default RaccordementChantier;