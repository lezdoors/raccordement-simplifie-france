import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";

const MentionsLegales = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Mentions légales</h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Éditeur du site</h2>
              <div className="text-muted-foreground space-y-2">
                <p><strong>Raccordement Connect</strong></p>
                <p>Société par actions simplifiée</p>
                <p>Capital social : 10 000 €</p>
                <p>RCS : Paris B 123 456 789</p>
                <p>SIRET : 123 456 789 00012</p>
                <p>Numéro de TVA intracommunautaire : FR12345678901</p>
                <p>Adresse : 123 Rue de la République, 75001 Paris, France</p>
                <p>Téléphone : 09 70 95 70 70</p>
                <p>Email : serviceclient@raccordement-connect.com</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Directeur de la publication</h2>
              <p className="text-muted-foreground">Directeur Général de Raccordement Connect</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Hébergement</h2>
              <div className="text-muted-foreground space-y-2">
                <p><strong>Vercel Inc.</strong></p>
                <p>340 S Lemon Ave #4133</p>
                <p>Walnut, CA 91789</p>
                <p>États-Unis</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Propriété intellectuelle</h2>
              <p className="text-muted-foreground">
                L'ensemble de ce site relève de la législation française et internationale 
                sur le droit d'auteur et la propriété intellectuelle. Tous les droits de 
                reproduction sont réservés, y compris pour les documents iconographiques et photographiques.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Responsabilité</h2>
              <p className="text-muted-foreground">
                Les informations contenues sur ce site sont aussi précises que possible et 
                le site remis à jour à différentes périodes de l'année, mais peut toutefois 
                contenir des inexactitudes ou des omissions.
              </p>
            </section>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default MentionsLegales;