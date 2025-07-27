import { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Phone, Mail } from "lucide-react";

interface ServiceStep {
  step: string;
  title: string;
  description: string;
}

interface ServiceFeature {
  title: string;
  description: string;
  icon: ReactNode;
}

interface ServicePageLayoutProps {
  title: string;
  subtitle: string;
  description: string;
  heroImage?: string;
  features: ServiceFeature[];
  steps: ServiceStep[];
  benefits: string[];
  targetAudience: string[];
  price?: string;
  duration?: string;
  ctaText?: string;
  seoTitle?: string;
  seoDescription?: string;
}

const ServicePageLayout = ({
  title,
  subtitle,
  description,
  heroImage,
  features,
  steps,
  benefits,
  targetAudience,
  price,
  duration,
  ctaText = "Démarrer ma demande",
  seoTitle,
  seoDescription
}: ServicePageLayoutProps) => {
  const navigate = useNavigate();

  return (
    <>
      {/* SEO Meta Tags */}
      {seoTitle && (
        <title>{seoTitle}</title>
      )}
      {seoDescription && (
        <meta name="description" content={seoDescription} />
      )}
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
                {subtitle}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                {title}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                {description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  onClick={() => navigate('/raccordement-enedis')}
                  size="lg"
                  className="font-bold text-[#1E1E1E] px-8 py-4 text-lg"
                  style={{ background: 'linear-gradient(90deg, #FFD77A 0%, #F2B736 100%)' }}
                >
                  {ctaText}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/contact')}
                  className="px-8 py-4 text-lg"
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Être rappelé
                </Button>
              </div>
              
              {(price || duration) && (
                <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground">
                  {price && (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      À partir de {price}
                    </span>
                  )}
                  {duration && (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Délai: {duration}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
                Pourquoi choisir notre service ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 bg-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
                Comment ça marche ?
              </h2>
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits & Target Audience */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Benefits */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8">
                  Avantages du service
                </h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8">
                  Ce service est fait pour vous si :
                </h2>
                <div className="space-y-4">
                  {targetAudience.map((audience, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground leading-relaxed">
                        {audience}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Prêt à commencer votre projet ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Obtenez votre devis personnalisé en quelques minutes seulement.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/raccordement-enedis')}
                  size="lg"
                  className="font-bold text-[#1E1E1E] px-8 py-4 text-lg"
                  style={{ background: 'linear-gradient(90deg, #FFD77A 0%, #F2B736 100%)' }}
                >
                  {ctaText}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/contact')}
                  className="px-8 py-4 text-lg"
                >
                  <Mail className="mr-2 w-5 h-5" />
                  Nous contacter
                </Button>
              </div>

              <div className="mt-8 text-sm text-muted-foreground">
                <p>✓ Devis gratuit et sans engagement</p>
                <p>✓ Réponse sous 24h</p>
                <p>✓ Service client dédié</p>
              </div>
            </div>
          </div>
        </section>

        <FooterSection />
      </div>
    </>
  );
};

export default ServicePageLayout;