import { Rocket, Clock, Star, Headphones, CheckCircle, Zap } from "lucide-react";
import ServicePageLayout from "@/components/ServicePageLayout";

const ServiceExpress = () => {
  const features = [
    {
      title: "Traitement Prioritaire",
      description: "Vos dossiers traités en priorité avec circuits accélérés pour un raccordement dans les plus brefs délais.",
      icon: <Rocket className="w-6 h-6 text-primary" />
    },
    {
      title: "Délais Raccourcis",
      description: "Réduction drastique des délais habituels grâce à notre réseau prioritaire et nos relations privilégiées Enedis.",
      icon: <Clock className="w-6 h-6 text-primary" />
    },
    {
      title: "Service Premium",
      description: "Accompagnement VIP avec interlocuteur dédié disponible 6j/7 pour le suivi personnalisé de votre dossier.",
      icon: <Star className="w-6 h-6 text-primary" />
    },
    {
      title: "Support Prioritaire",
      description: "Ligne directe dédiée et support technique premium pour répondre à toutes vos questions immédiatement.",
      icon: <Headphones className="w-6 h-6 text-primary" />
    },
    {
      title: "Garantie Résultat",
      description: "Engagement sur les délais avec garantie de résultat ou remboursement du supplément express.",
      icon: <CheckCircle className="w-6 h-6 text-primary" />
    },
    {
      title: "Urgence 24h",
      description: "Service d'urgence 24h pour les situations critiques nécessitant un raccordement immédiat.",
      icon: <Zap className="w-6 h-6 text-primary" />
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Prise en charge immédiate",
      description: "Votre dossier est traité en priorité absolue dès réception avec attribution d'un chef de projet dédié."
    },
    {
      step: "2",
      title: "Traitement accéléré",
      description: "Instruction express de votre dossier avec circuits prioritaires et validation accélérée des documents."
    },
    {
      step: "3",
      title: "Coordination renforcée",
      description: "Coordination intensive avec Enedis et activation de tous nos leviers pour optimiser les délais."
    },
    {
      step: "4",
      title: "Suivi temps réel",
      description: "Suivi quotidien avec points d'avancement réguliers et communication proactive sur l'évolution."
    },
    {
      step: "5",
      title: "Livraison express",
      description: "Finalisation en mode express avec mise en service prioritaire et réception dans les délais garantis."
    }
  ];

  const benefits = [
    "Délais divisés par 2 par rapport au processus standard",
    "Chef de projet dédié disponible 6j/7",
    "Traitement prioritaire garanti chez Enedis",
    "Ligne directe premium pour un suivi optimal",
    "Engagement contractuel sur les délais annoncés",
    "Service d'urgence 24h pour les cas critiques",
    "Compensation automatique en cas de retard",
    "Réseau privilégié pour accélérer les procédures"
  ];

  const targetAudience = [
    "Votre projet a des contraintes de délais très serrés",
    "Vous avez une date de livraison impérative à respecter",
    "Votre activité nécessite une mise en service urgente",
    "Vous acceptez un surcoût pour gagner du temps",
    "Votre projet immobilier/industriel a pris du retard",
    "Vous cherchez la garantie d'un service premium",
    "Votre situation nécessite un traitement d'urgence",
    "Vous voulez la tranquillité d'un service VIP"
  ];

  return (
    <ServicePageLayout
      title="Service Express"
      subtitle="Raccordement Prioritaire"
      description="Service premium pour raccordement électrique express. Délais raccourcis, traitement prioritaire, garantie résultat."
      features={features}
      steps={steps}
      benefits={benefits}
      targetAudience={targetAudience}
      price="299€"
      duration="1 à 3 semaines"
      ctaText="Choisir le service express"
      seoTitle="Service Express Raccordement | Prioritaire | Délais Raccourcis"
      seoDescription="Service express raccordement électrique. Délais raccourcis, traitement prioritaire, chef de projet dédié. Garantie résultat."
    />
  );
};

export default ServiceExpress;