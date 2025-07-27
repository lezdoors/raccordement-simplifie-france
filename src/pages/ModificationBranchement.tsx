import { Settings, TrendingUp, Shield, Clock, Wrench, CheckCircle } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

const ModificationBranchement = () => {
  const features = [
    {
      title: "Augmentation de Puissance",
      description: "Expertise dans l'augmentation de puissance de 3kVA à 36kVA selon vos nouveaux besoins énergétiques.",
      icon: <TrendingUp className="w-6 h-6 text-primary" />
    },
    {
      title: "Modification Technique",
      description: "Changement de type de branchement : passage monophasé/triphasé, aérien vers souterrain ou inversement.",
      icon: <Settings className="w-6 h-6 text-primary" />
    },
    {
      title: "Mise aux Normes",
      description: "Modernisation des branchements anciens pour conformité aux normes actuelles NF C 14-100.",
      icon: <Shield className="w-6 h-6 text-primary" />
    }
  ];

  const steps = [
    { step: "1", title: "Diagnostic de l'existant", description: "Analyse technique de votre branchement actuel." },
    { step: "2", title: "Étude de faisabilité", description: "Évaluation technique et définition de la solution optimale." },
    { step: "3", title: "Réalisation des travaux", description: "Exécution des travaux de modification par les équipes Enedis." }
  ];

  const benefits = [
    "Expertise reconnue en modification de branchements électriques",
    "Délais maîtrisés grâce à notre expérience Enedis",
    "Prix transparents sans surprise ni frais cachés"
  ];

  const targetAudience = [
    "Vous avez besoin d'augmenter la puissance de votre compteur",
    "Vous voulez passer du monophasé au triphasé",
    "Vous installez une borne de recharge électrique"
  ];

  return (
    <ServicePageLayout
      title="Modification de Branchement"
      subtitle="Évolution & Modernisation"
      description="Expert en modification de branchements électriques. Augmentation de puissance, changement de type, mise aux normes."
      features={features}
      steps={steps}
      benefits={benefits}
      targetAudience={targetAudience}
      price="129€"
      duration="2 à 4 semaines"
      ctaText="Modifier mon branchement"
      seoTitle="Modification Branchement Électrique | Augmentation Puissance | Expert Enedis"
      seoDescription="Spécialiste modification branchement électrique. Augmentation puissance, passage triphasé, mise aux normes. Intervention rapide. Devis gratuit."
    />
  );
};

export default ModificationBranchement;