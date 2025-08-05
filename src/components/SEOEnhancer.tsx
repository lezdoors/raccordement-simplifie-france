import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOData {
  title: string;
  description: string;
  image?: string;
  type?: string;
  url?: string;
  keywords?: string[];
  structuredData?: object;
}

const pageData: Record<string, SEOData> = {
  '/': {
    title: 'Raccordement Électrique Enedis - Service Expert France | raccordement-connect.com',
    description: 'Service expert en raccordement électrique Enedis. Maison neuve, photovoltaïque, modification branchement. Processus simplifié, suivi personnalisé, conformité garantie. Appelez 09 77 40 50 60',
    keywords: ['raccordement électrique', 'Enedis', 'maison neuve', 'photovoltaïque', 'modification branchement'],
  },
  '/raccordement-enedis': {
    title: 'Raccordement Enedis Définitif - Nouvelle Construction | raccordement-connect.com',
    description: 'Raccordement électrique Enedis pour nouvelle construction. Service expert, démarches simplifiées, suivi personnalisé. Obtenez votre raccordement rapidement.',
    keywords: ['raccordement Enedis', 'nouvelle construction', 'compteur Linky', 'raccordement définitif'],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Raccordement Enedis Définitif",
      "description": "Service de raccordement électrique Enedis pour nouvelle construction",
      "provider": {
        "@type": "Organization",
        "name": "raccordement-connect.com"
      }
    }
  },
  '/photovoltaique': {
    title: 'Raccordement Photovoltaïque - Installation Solaire | raccordement-connect.com',
    description: 'Raccordement de votre installation photovoltaïque au réseau Enedis. Injection et autoconsommation. Service expert en énergie solaire.',
    keywords: ['raccordement photovoltaïque', 'installation solaire', 'injection réseau', 'autoconsommation'],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Raccordement Photovoltaïque",
      "description": "Service de raccordement d'installation photovoltaïque au réseau électrique"
    }
  },
  '/maison-neuve': {
    title: 'Raccordement Électrique Maison Neuve - Construction | raccordement-connect.com',
    description: 'Raccordement électrique pour maison neuve. Accompagnement complet du permis de construire à la mise en service. Expertise construction.',
    keywords: ['raccordement maison neuve', 'construction neuve', 'permis de construire', 'mise en service'],
  },
  '/modification-branchement': {
    title: 'Modification Branchement Électrique - Changement Puissance | raccordement-connect.com',
    description: 'Modification de branchement électrique existant. Changement de puissance, déplacement compteur, mise aux normes. Service expert.',
    keywords: ['modification branchement', 'changement puissance', 'déplacement compteur', 'mise aux normes'],
  },
  '/contact': {
    title: 'Contact - raccordement-connect.com | Experts Raccordement Électrique',
    description: 'Contactez nos experts en raccordement électrique Enedis. Conseil personnalisé, devis gratuit. Appelez le 09 77 40 50 60.',
    keywords: ['contact', 'devis gratuit', 'conseil raccordement', 'expert électrique'],
  },
  '/faq': {
    title: 'FAQ - Questions Fréquentes Raccordement Électrique | raccordement-connect.com',
    description: 'Réponses aux questions fréquentes sur le raccordement électrique Enedis. Délais, coûts, démarches, documents requis.',
    keywords: ['FAQ raccordement', 'questions fréquentes', 'délais raccordement', 'coût raccordement'],
  }
};

export const SEOEnhancer: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPageData = pageData[location.pathname];
    
    if (!currentPageData) return;

    // Update document title
    document.title = currentPageData.title;

    // Update meta description
    updateMetaTag('description', currentPageData.description);

    // Update Open Graph tags
    updateMetaTag('og:title', currentPageData.title, 'property');
    updateMetaTag('og:description', currentPageData.description, 'property');
    updateMetaTag('og:url', `https://www.raccordement-connect.com${location.pathname}`, 'property');
    updateMetaTag('og:type', currentPageData.type || 'website', 'property');
    
    if (currentPageData.image) {
      updateMetaTag('og:image', currentPageData.image, 'property');
    }

    // Update Twitter Card tags
    updateMetaTag('twitter:title', currentPageData.title);
    updateMetaTag('twitter:description', currentPageData.description);
    updateMetaTag('twitter:url', `https://www.raccordement-connect.com${location.pathname}`);
    
    if (currentPageData.image) {
      updateMetaTag('twitter:image', currentPageData.image);
    }

    // Update keywords
    if (currentPageData.keywords) {
      updateMetaTag('keywords', currentPageData.keywords.join(', '));
    }

    // Update canonical URL
    updateLinkTag('canonical', `https://www.raccordement-connect.com${location.pathname}`);

    // Add structured data if provided
    if (currentPageData.structuredData) {
      addStructuredData(currentPageData.structuredData, `page-schema-${location.pathname}`);
    }

    // Add article schema for blog posts
    if (location.pathname.startsWith('/blog/')) {
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": currentPageData.title,
        "description": currentPageData.description,
        "author": {
          "@type": "Organization",
          "name": "raccordement-connect.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "raccordement-connect.com"
        }
      };
      addStructuredData(articleSchema, 'article-schema');
    }

  }, [location.pathname]);

  return null;
};

// Helper functions
const updateMetaTag = (name: string, content: string, attribute = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.content = content;
};

const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  
  element.href = href;
};

const addStructuredData = (data: object, id: string) => {
  // Remove existing schema with same ID
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  // Add new schema
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

// Hook for dynamic SEO updates
export const useSEO = (seoData: SEOData) => {
  useEffect(() => {
    if (seoData.title) {
      document.title = seoData.title;
      updateMetaTag('og:title', seoData.title, 'property');
      updateMetaTag('twitter:title', seoData.title);
    }

    if (seoData.description) {
      updateMetaTag('description', seoData.description);
      updateMetaTag('og:description', seoData.description, 'property');
      updateMetaTag('twitter:description', seoData.description);
    }

    if (seoData.image) {
      updateMetaTag('og:image', seoData.image, 'property');
      updateMetaTag('twitter:image', seoData.image);
    }

    if (seoData.url) {
      updateMetaTag('og:url', seoData.url, 'property');
      updateMetaTag('twitter:url', seoData.url);
      updateLinkTag('canonical', seoData.url);
    }

    if (seoData.keywords) {
      updateMetaTag('keywords', seoData.keywords.join(', '));
    }

    if (seoData.structuredData) {
      addStructuredData(seoData.structuredData, 'dynamic-schema');
    }
  }, [seoData]);
};