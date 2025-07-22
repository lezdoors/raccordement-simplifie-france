import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Award, CheckCircle, Clock, Phone, Lock, Users, Star, FileCheck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TrustSection = () => {
  const navigate = useNavigate();

  const certifications = [
    {
      icon: Shield,
      title: "Certifié Qualibat",
      description: "Certification officielle pour les travaux électriques",
      verified: true
    },
    {
      icon: Award,
      title: "Partenaire Enedis",
      description: "Agrément officiel pour les raccordements",
      verified: true
    },
    {
      icon: FileCheck,
      title: "Conformité CONSUEL",
      description: "Respect des normes de sécurité électrique",
      verified: true
    },
    {
      icon: Lock,
      title: "Données sécurisées",
      description: "Chiffrement SSL et protection RGPD",
      verified: true
    }
  ];

  const guarantees = [
    {
      icon: CheckCircle,
      title: "Satisfaction garantie",
      description: "98% de nos clients recommandent nos services",
      highlight: "98%"
    },
    {
      icon: Clock,
      title: "Délais respectés",
      description: "Traitement de votre dossier sous 48h maximum",
      highlight: "48h"
    },
    {
      icon: Users,
      title: "Support dédié",
      description: "Un conseiller attitré pour votre projet",
      highlight: "1:1"
    },
    {
      icon: Zap,
      title: "Réactivité express",
      description: "Réponse à vos questions en moins de 2h",
      highlight: "2h"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Confiance & Sécurité
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Votre tranquillité d'esprit
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Certifications officielles, garanties solides et transparence totale pour vous accompagner en toute sérénité
          </p>
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Certifications & Agréments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <cert.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">{cert.title}</h4>
                    {cert.verified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {cert.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Nos Garanties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((guarantee, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm relative overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs font-bold">
                      {guarantee.highlight}
                    </Badge>
                  </div>
                  <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <guarantee.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{guarantee.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {guarantee.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 lg:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Pourquoi nous faire confiance ?
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white/90">15 000+ raccordements réalisés avec succès</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-white/90">Assurance responsabilité civile professionnelle</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-white/90">Disponible 6j/7 pour répondre à vos questions</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white/90">Remboursement si dossier non accepté par Enedis</span>
                </div>
              </div>
            </div>
            
            <div className="text-center lg:text-right">
              <div className="mb-6">
                <div className="text-4xl lg:text-5xl font-bold mb-2">4.9/5</div>
                <div className="flex items-center justify-center lg:justify-end gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-white/80">Basé sur 2,847 avis vérifiés</div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="w-full lg:w-auto bg-white text-primary hover:bg-white/90"
                  onClick={() => navigate("/raccordement-enedis")}
                >
                  Commencer maintenant
                </Button>
                <div className="flex items-center justify-center lg:justify-end gap-2 text-white/80">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Ou appelez-nous au 09 77 40 50 60</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;