import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";

const CGU = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Conditions Générales d'Utilisation</h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Article 1 - Objet</h2>
              <p className="text-muted-foreground">
                Les présentes conditions générales d'utilisation régissent l'utilisation du site 
                racco-service.com et des services de raccordement au réseau électrique proposés 
                par Racco Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Article 2 - Acceptation des conditions</h2>
              <p className="text-muted-foreground">
                L'utilisation de nos services implique l'acceptation pleine et entière des présentes 
                conditions générales d'utilisation. Ces conditions peuvent être modifiées à tout moment 
                sans préavis.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Article 3 - Services proposés</h2>
              <p className="text-muted-foreground mb-4">
                Racco Service propose les services suivants :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Accompagnement dans les démarches de raccordement Enedis</li>
                <li>Constitution et transmission des dossiers techniques</li>
                <li>Suivi administratif des demandes</li>
                <li>Conseil en raccordement électrique</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Article 4 - Obligations de l'utilisateur</h2>
              <p className="text-muted-foreground mb-4">
                L'utilisateur s'engage à :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Fournir des informations exactes et complètes</li>
                <li>Respecter les délais et procédures indiqués</li>
                <li>Payer les prestations selon les modalités convenues</li>
                <li>Ne pas utiliser le service à des fins illégales</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Article 5 - Limitation de responsabilité</h2>
              <p className="text-muted-foreground">
                Racco Service intervient en qualité d'intermédiaire. Notre responsabilité se limite 
                à la transmission correcte des dossiers aux services d'Enedis. Nous ne saurions être 
                tenus responsables des décisions prises par Enedis ou des délais de traitement.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Article 6 - Prix et paiement</h2>
              <p className="text-muted-foreground">
                Les prix de nos prestations sont indiqués toutes taxes comprises. Le paiement 
                s'effectue selon les modalités précisées lors de la commande. Tout retard de 
                paiement pourra entraîner la suspension du service.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Article 7 - Droit applicable</h2>
              <p className="text-muted-foreground">
                Les présentes conditions générales sont régies par le droit français. Tout litige 
                sera soumis aux tribunaux compétents français.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Article 8 - Contact</h2>
              <p className="text-muted-foreground">
                Pour toute question concernant ces conditions générales d'utilisation, 
                contactez-nous à : contact@racco-service.com
              </p>
            </section>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default CGU;