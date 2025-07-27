import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const Blog = () => {
  const navigate = useNavigate();

  const blogPosts = [
    {
      title: "Guide complet du raccordement électrique pour maison neuve",
      excerpt: "Découvrez toutes les étapes pour raccorder votre maison neuve au réseau Enedis, les documents nécessaires et les délais à prévoir.",
      date: "15 Mars 2024",
      readTime: "5 min",
      category: "Guide",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Raccordement photovoltaïque : ce qu'il faut savoir",
      excerpt: "Installation de panneaux solaires ? Comprendre les spécificités du raccordement pour l'injection d'électricité dans le réseau.",
      date: "10 Mars 2024", 
      readTime: "7 min",
      category: "Énergie Renouvelable",
      image: "/api/placeholder/400/200"
    },
    {
      title: "Réformes tarifaires Enedis 2024 : impact sur vos projets",
      excerpt: "Analyse des nouvelles grilles tarifaires et leur impact sur le coût de votre raccordement électrique.",
      date: "5 Mars 2024",
      readTime: "4 min", 
      category: "Réglementation",
      image: "/api/placeholder/400/200"
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
              Blog & Actualités
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Conseils, guides et actualités sur le raccordement électrique Enedis
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Featured Articles Preview */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Articles à venir
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-muted flex items-center justify-center">
                      <div className="text-muted-foreground text-sm">Image à venir</div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-primary text-sm font-medium">
                        Lire l'article
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Construction Notice */}
            <div className="text-center bg-muted/30 rounded-lg p-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Blog en cours de construction
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Nous préparons des contenus de qualité pour vous accompagner dans vos projets de raccordement électrique. 
                En attendant, notre équipe reste disponible pour répondre à toutes vos questions.
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
                  Poser une question
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Inscrivez-vous à notre newsletter pour être informé de la publication de nos premiers articles
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default Blog;