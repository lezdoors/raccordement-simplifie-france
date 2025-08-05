import { useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const routeMap: Record<string, BreadcrumbItem[]> = {
  '/': [{ label: 'Accueil' }],
  '/raccordement-enedis': [
    { label: 'Accueil', href: '/' },
    { label: 'Raccordement Enedis' }
  ],
  '/photovoltaique': [
    { label: 'Accueil', href: '/' },
    { label: 'Raccordement Photovoltaïque' }
  ],
  '/maison-neuve': [
    { label: 'Accueil', href: '/' },
    { label: 'Maison Neuve' }
  ],
  '/modification-branchement': [
    { label: 'Accueil', href: '/' },
    { label: 'Modification Branchement' }
  ],
  '/raccordement-industriel': [
    { label: 'Accueil', href: '/' },
    { label: 'Raccordement Industriel' }
  ],
  '/service-express': [
    { label: 'Accueil', href: '/' },
    { label: 'Service Express' }
  ],
  '/estimation': [
    { label: 'Accueil', href: '/' },
    { label: 'Estimation' }
  ],
  '/contact': [
    { label: 'Accueil', href: '/' },
    { label: 'Contact' }
  ],
  '/a-propos': [
    { label: 'Accueil', href: '/' },
    { label: 'À Propos' }
  ],
  '/faq': [
    { label: 'Accueil', href: '/' },
    { label: 'FAQ' }
  ],
  '/blog': [
    { label: 'Accueil', href: '/' },
    { label: 'Blog' }
  ],
  '/commencer': [
    { label: 'Accueil', href: '/' },
    { label: 'Commencer ma demande' }
  ],
  '/merci': [
    { label: 'Accueil', href: '/' },
    { label: 'Commencer ma demande', href: '/commencer' },
    { label: 'Confirmation' }
  ],
  '/payment-success': [
    { label: 'Accueil', href: '/' },
    { label: 'Commencer ma demande', href: '/commencer' },
    { label: 'Paiement réussi' }
  ]
};

export const SEOBreadcrumb: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Don't show breadcrumb on homepage
  if (pathname === '/') {
    return null;
  }

  const breadcrumbItems = routeMap[pathname] || [
    { label: 'Accueil', href: '/' },
    { label: 'Page' }
  ];

  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href && { "item": `https://www.raccordement-connect.com${item.href}` })
    }))
  };

  return (
    <>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Visual breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink href={item.href} className="flex items-center gap-1">
                        {index === 0 && <Home className="h-4 w-4" />}
                        {item.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="flex items-center gap-1">
                        {index === 0 && <Home className="h-4 w-4" />}
                        {item.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </>
  );
};