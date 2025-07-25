import Navigation from "@/components/Navigation";
import FooterSection from "@/components/FooterSection";

const Confidentialite = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Politique de confidentialité</h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Collecte des données personnelles</h2>
              <p className="text-muted-foreground">
                Nous collectons des données personnelles uniquement dans le cadre de votre demande 
                de raccordement électrique. Les informations demandées sont nécessaires au traitement 
                de votre dossier par les services d'Enedis.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Utilisation des données</h2>
              <p className="text-muted-foreground mb-4">
                Vos données personnelles sont utilisées pour :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Traiter votre demande de raccordement</li>
                <li>Vous contacter concernant l'avancement de votre dossier</li>
                <li>Transmettre votre dossier aux services compétents d'Enedis</li>
                <li>Respecter nos obligations légales et réglementaires</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Conservation des données</h2>
              <p className="text-muted-foreground">
                Vos données personnelles sont conservées pendant la durée nécessaire au traitement 
                de votre demande, puis archivées conformément aux obligations légales.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Vos droits</h2>
              <p className="text-muted-foreground mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification de vos données</li>
                <li>Droit à l'effacement de vos données</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition au traitement</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Pour exercer ces droits, contactez-nous à : serviceclient@raccordement-connect.com
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies</h2>
              <p className="text-muted-foreground">
                Ce site utilise des cookies techniques nécessaires à son fonctionnement. 
                Aucun cookie publicitaire ou de tracking n'est utilisé sans votre consentement.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact</h2>
              <p className="text-muted-foreground">
                Pour toute question concernant cette politique de confidentialité, 
                vous pouvez nous contacter à : serviceclient@raccordement-connect.com
              </p>
            </section>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Confidentialite;