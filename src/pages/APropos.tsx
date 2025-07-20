import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";

const APropos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">À propos</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              Raccordement Connect est votre partenaire de confiance pour toutes vos demandes 
              de raccordement électrique Enedis en France.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Notre mission</h2>
            <p className="text-muted-foreground mb-6">
              Simplifier et accélérer vos démarches de raccordement électrique en vous accompagnant 
              à chaque étape de votre projet. Nous gérons l'ensemble du processus administratif 
              pour que vous puissiez vous concentrer sur l'essentiel.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Nos services</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
              <li>Raccordement maison neuve</li>
              <li>Raccordement professionnel et industriel</li>
              <li>Raccordement collectif</li>
              <li>Augmentation de puissance</li>
              <li>Suivi personnalisé de votre dossier</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Pourquoi nous choisir ?</h2>
            <p className="text-muted-foreground mb-6">
              Avec plusieurs années d'expérience dans le domaine, notre équipe d'experts 
              connaît parfaitement les procédures Enedis et vous garantit un traitement 
              rapide et conforme de votre demande.
            </p>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default APropos;