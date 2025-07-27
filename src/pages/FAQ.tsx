import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      question: "Qu'est-ce qu'un raccordement électrique Enedis ?",
      answer: "Un raccordement électrique Enedis est la connexion de votre installation électrique au réseau public de distribution d'électricité géré par Enedis. C'est une étape obligatoire pour alimenter votre logement ou local professionnel en électricité."
    },
    {
      question: "Combien de temps prend une demande de raccordement ?",
      answer: "Les délais varient selon le type de raccordement : 2 à 6 mois pour un raccordement simple, 6 à 18 mois pour des raccordements complexes nécessitant des travaux d'extension du réseau. Nous vous accompagnons pour optimiser ces délais."
    },
    {
      question: "Quels documents dois-je fournir ?",
      answer: "Les documents requis incluent : permis de construire, plan de situation, plan de masse, attestation de conformité Consuel, et selon les cas, l'autorisation d'urbanisme. Notre équipe vous guide dans la constitution du dossier."
    },
    {
      question: "Quel est le coût d'un raccordement électrique ?",
      answer: "Le coût varie selon la puissance demandée, la distance au réseau existant et la complexité des travaux. Il peut aller de quelques centaines d'euros à plusieurs milliers. Nous vous fournissons une estimation gratuite."
    },
    {
      question: "Quelle est la différence entre raccordement provisoire et définitif ?",
      answer: "Un raccordement provisoire (DICT) est temporaire, souvent utilisé pour les chantiers. Un raccordement définitif est permanent et nécessite une installation électrique conforme aux normes en vigueur."
    },
    {
      question: "Puis-je faire ma demande de raccordement moi-même ?",
      answer: "Oui, mais les démarches sont complexes et chronophages. Notre service vous fait gagner du temps et évite les erreurs qui peuvent retarder votre projet. Nous nous occupons de tout de A à Z."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Questions Fréquentes
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Trouvez toutes les réponses à vos questions sur le raccordement électrique Enedis
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqData.map((item, index) => (
                <div key={index} className="border border-border rounded-lg">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-foreground">
                      {item.question}
                    </h3>
                    {openItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  {openItems.includes(index) && (
                    <div className="px-6 pb-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-12 text-center bg-muted/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Une question spécifique ?
              </h2>
              <p className="text-muted-foreground mb-6">
                Notre équipe d'experts est là pour vous accompagner dans votre projet de raccordement
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/raccordement-enedis')}
                  size="lg"
                  className="font-bold text-[#1E1E1E]"
                  style={{ background: 'linear-gradient(90deg, #FFD77A 0%, #F2B736 100%)' }}
                >
                  Démarrer ma demande
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/contact')}
                >
                  Nous contacter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default FAQ;