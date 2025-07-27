import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Users, Clock, Star, Award, Zap, Shield, HeartHandshake } from "lucide-react";
import { useNavigate } from "react-router-dom";

const APropos = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Clients satisfaits", value: "2500+", icon: Users },
    { label: "Projets réalisés", value: "3000+", icon: CheckCircle2 },
    { label: "Délai moyen", value: "15 jours", icon: Clock },
    { label: "Note de satisfaction", value: "4.9/5", icon: Star },
  ];

  const expertise = [
    {
      icon: Zap,
      title: "Expertise technique",
      description: "Nos ingénieurs maîtrisent parfaitement les normes Enedis et les spécificités de chaque type de raccordement."
    },
    {
      icon: Shield,
      title: "Conformité garantie",
      description: "Tous nos dossiers respectent scrupuleusement la réglementation en vigueur pour éviter tout retard."
    },
    {
      icon: HeartHandshake,
      title: "Accompagnement personnalisé",
      description: "Un interlocuteur dédié vous accompagne du début à la fin de votre projet de raccordement."
    },
    {
      icon: Award,
      title: "Rapidité d'exécution",
      description: "Grâce à notre expérience, nous optimisons les délais et accélérons le traitement de vos dossiers."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Expert en raccordement électrique
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Votre partenaire de confiance pour tous vos raccordements électriques
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Depuis plus de 10 ans, nous simplifions vos démarches de raccordement Enedis 
            en France métropolitaine avec un service rapide, fiable et personnalisé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/commencer')}>
              Commencer mon projet
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/contact')}>
              Nous contacter
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Notre mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Simplifier et accélérer vos démarches de raccordement électrique en vous 
                accompagnant à chaque étape de votre projet. Nous gérons l'ensemble du 
                processus administratif pour que vous puissiez vous concentrer sur l'essentiel.
              </p>
              <p className="text-muted-foreground mb-6">
                Notre équipe d'experts connaît parfaitement les procédures Enedis et vous 
                garantit un traitement rapide et conforme de votre demande, qu'il s'agisse 
                d'un raccordement neuf, d'une modification ou d'une augmentation de puissance.
              </p>
              <Button onClick={() => navigate('/services')}>
                Découvrir nos services
              </Button>
            </div>
            <div className="space-y-4">
              {expertise.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Nos domaines d'expertise
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Raccordement maison neuve", desc: "Construction neuve, permis de construire, branchement définitif" },
                { title: "Raccordement professionnel", desc: "Entreprises, commerces, bureaux, installations industrielles" },
                { title: "Raccordement collectif", desc: "Copropriétés, lotissements, bâtiments collectifs" },
                { title: "Augmentation de puissance", desc: "Modification de votre abonnement électrique existant" },
                { title: "Raccordement provisoire", desc: "Chantier, événement temporaire, installation mobile" },
                { title: "Photovoltaïque", desc: "Raccordement de panneaux solaires et autoconsommation" }
              ].map((service, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{service.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Obtenez un devis personnalisé en moins de 5 minutes et bénéficiez 
            de notre expertise pour votre raccordement électrique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/commencer')}>
              Demander un devis gratuit
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/contact')}>
              Poser une question
            </Button>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default APropos;