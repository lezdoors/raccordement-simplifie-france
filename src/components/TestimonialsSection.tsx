import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, MapPin, Clock, CheckCircle } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Marie Dubois",
      location: "Lyon, Rhône",
      project: "Raccordement maison neuve",
      rating: 5,
      comment: "Service impeccable ! L'équipe a géré toutes les démarches administratives pour notre raccordement Enedis. Nous avons été accompagnés du début à la fin avec un suivi personnalisé. Je recommande vivement !",
      date: "Il y a 3 jours",
      verified: true
    },
    {
      id: 2,
      name: "Pierre Martin",
      location: "Marseille, Bouches-du-Rhône",
      project: "Installation photovoltaïque",
      rating: 5,
      comment: "Excellent travail pour notre projet photovoltaïque. Les équipes connaissent parfaitement les procédures Enedis et ont su nous rassurer à chaque étape. Délais respectés et tarifs transparents.",
      date: "Il y a 1 semaine",
      verified: true
    },
    {
      id: 3,
      name: "Sophie Leroux",
      location: "Toulouse, Haute-Garonne",
      project: "Modification branchement",
      rating: 5,
      comment: "Nous devions modifier notre branchement électrique pour notre extension. L'équipe a été réactive et professionnelle. Toutes les démarches ont été simplifiées grâce à leur expertise.",
      date: "Il y a 2 semaines",
      verified: true
    },
    {
      id: 4,
      name: "David Rousseau",
      location: "Bordeaux, Gironde",
      project: "Raccordement industriel",
      rating: 5,
      comment: "Pour notre projet industriel, nous avions besoin d'un raccordement complexe. L'équipe a su gérer toutes les spécificités techniques et administratives. Un vrai gain de temps et d'efficacité.",
      date: "Il y a 3 semaines",
      verified: true
    }
  ];

  const stats = [
    { label: "Avis clients", value: "2,847", subtext: "Note moyenne 4.9/5" },
    { label: "Projets réalisés", value: "15,000+", subtext: "Depuis 2020" },
    { label: "Taux de satisfaction", value: "98%", subtext: "Clients recommandent" },
    { label: "Délai moyen", value: "48h", subtext: "Traitement dossier" }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            Témoignages clients
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ce que disent nos clients
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Découvrez les retours de nos clients satisfaits partout en France
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 lg:p-8">
                {/* Quote Icon & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <Quote className="w-8 h-8 text-primary/20" />
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-foreground leading-relaxed mb-6 text-base lg:text-lg">
                  "{testimonial.comment}"
                </p>

                {/* Client Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </div>
                    <div className="text-sm text-primary font-medium">
                      {testimonial.project}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {testimonial.date}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Rejoignez nos milliers de clients satisfaits
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Avis vérifiés par Trustpilot</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;