import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, ExternalLink } from "lucide-react";

const FAQSection = () => {
  const faqs = [
    {
      question: "Quel est l'objectif de Mon Raccordement Électrique ?",
      answer: "Mon Raccordement Électrique est un service qui simplifie vos démarches de raccordement au réseau électrique Enedis. Nous vous accompagnons dans toutes les étapes, de la demande jusqu'à la mise en service."
    },
    {
      question: "Qu'est-ce qu'un raccordement à l'électricité ?",
      answer: "Un raccordement électrique consiste à relier votre installation au réseau public de distribution d'électricité géré par Enedis. Cette opération est nécessaire pour alimenter votre logement ou local professionnel en électricité."
    },
    {
      question: "Quelle est la différence entre Enedis et les ELD ?",
      answer: "Enedis est le gestionnaire du réseau de distribution d'électricité sur 95% du territoire français. Les ELD (Entreprises Locales de Distribution) gèrent les 5% restants, principalement dans certaines communes rurales ou urbaines historiques."
    },
    {
      question: "Le Consuel : utilité et procédure d'obtention ?",
      answer: "Le Consuel (Comité National pour la Sécurité des Usagers de l'Électricité) certifie la conformité de votre installation électrique. Cette attestation est obligatoire avant la mise en service et doit être obtenue auprès d'un organisme agréé après vérification de votre installation."
    },
    {
      question: "Comment déposer une demande de raccordement électrique ?",
      answer: "Vous pouvez déposer votre demande directement via notre formulaire en ligne simplifié. Nous nous chargeons ensuite de transmettre votre dossier à Enedis et de suivre son traitement jusqu'à la mise en service."
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Questions fréquentes
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Questions fréquentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Réponses aux questions les plus courantes concernant les raccordements Enedis.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-lg border px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1 text-xs">
                      {index + 1}
                    </Badge>
                    <span className="font-medium text-foreground">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-10">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <div className="bg-background rounded-lg p-8 border">
              <div className="flex items-center justify-center gap-4 mb-4">
                <HelpCircle className="w-8 h-8 text-primary" />
                <h3 className="text-xl font-bold text-foreground">
                  Support technique
                </h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Équipe d'experts spécialisés dans les procédures Enedis
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Consulter la FAQ complète →
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  Contacter un expert
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;