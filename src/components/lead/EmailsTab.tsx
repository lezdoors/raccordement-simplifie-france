
import { EmailComposer } from './EmailComposer';
import { EmailHistory } from './EmailHistory';

interface EmailsTabProps {
  leadId: string;
  leadEmail: string;
  leadName: string;
  leadData?: {
    prenom?: string;
    nom?: string;
    ville?: string;
    type_projet?: string;
  };
}

export const EmailsTab = ({ leadId, leadEmail, leadName, leadData }: EmailsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Email Composer */}
      <div className="flex justify-end">
        <EmailComposer 
          leadId={leadId}
          leadEmail={leadEmail}
          leadName={leadName}
          leadData={leadData}
        />
      </div>

      {/* Email History */}
      <EmailHistory leadId={leadId} />
    </div>
  );
};
