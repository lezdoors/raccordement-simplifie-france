import { ReactNode } from 'react';
import { CRMHeader } from './CRMHeader';
import { useLeadNotifications } from '@/hooks/use-lead-notifications';

interface CRMLayoutProps {
  children: ReactNode;
}

export const CRMLayout = ({ children }: CRMLayoutProps) => {
  const { newLeadsCount } = useLeadNotifications();

  return (
    <div className="min-h-screen bg-background">
      <CRMHeader newLeadsCount={newLeadsCount} />
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer with phone number */}
      <footer className="bg-muted border-t py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Support technique :{' '}
            <a 
              href="tel:+33189701200" 
              className="font-medium text-primary hover:underline"
            >
              📞 01 89 70 12 00
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};