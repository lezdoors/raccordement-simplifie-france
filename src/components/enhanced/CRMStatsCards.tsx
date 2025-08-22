import {
  Users,
  UserPlus,
  MessageSquare,
  UserCheck,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMessageStats } from '@/hooks/use-message-stats';

interface CRMStatsCardsProps {
  leads: any[];
  loading: boolean;
}

export const CRMStatsCards = ({ leads, loading }: CRMStatsCardsProps) => {
  const { inboundMessageCount } = useMessageStats();

  const totalLeads = leads?.length || 0;
  const newLeads = leads?.filter(
    (lead) =>
      new Date(lead.created_at).getTime() >
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime()
  )?.length || 0;
  const assignedLeads = leads?.filter((lead) => lead.assigned_to)?.length || 0;

  const stats = [
    {
      title: "Total des leads",
      value: totalLeads.toString(),
      icon: Users,
      description: "Tous les leads du système"
    },
    {
      title: "Leads nouveaux",
      value: newLeads.toString(),
      icon: UserPlus,
      description: "Créés cette semaine"
    },
    {
      title: "Messages de contact",
      value: inboundMessageCount.toString(),
      icon: MessageSquare,
      description: "Messages entrants reçus"
    },
    {
      title: "Leads assignés",
      value: assignedLeads.toString(),
      icon: UserCheck,
      description: "Leads avec un traiteur assigné"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {React.createElement(stat.icon, { className: "h-4 w-4 text-muted-foreground" })}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
