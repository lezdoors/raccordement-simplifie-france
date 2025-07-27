import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  CreditCard, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  Phone,
  CheckCircle2
} from 'lucide-react';

interface CRMStatsCardsProps {
  stats: any;
  leads: any[];
}

export const CRMStatsCards = ({ stats, leads }: CRMStatsCardsProps) => {
  // Calculate additional metrics
  const paidLeads = leads.filter(l => l.payment_status === 'paid').length;
  const urgentLeads = leads.filter(l => l.form_type === 'callback' || l.etat_projet === 'nouveau').length;
  const completionRate = leads.length > 0 ? ((leads.filter(l => l.form_type === 'full').length / leads.length) * 100).toFixed(1) : '0';
  const todayLeads = leads.filter(l => {
    const today = new Date().toDateString();
    const leadDate = new Date(l.created_at).toDateString();
    return today === leadDate;
  }).length;

  const statsCards = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      change: `+${stats.weeklyLeads} cette semaine`,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Leads payés",
      value: paidLeads,
      change: `${((paidLeads / (stats.totalLeads || 1)) * 100).toFixed(1)}% du total`,
      icon: CreditCard,
      color: "text-green-600"
    },
    {
      title: "À traiter (urgent)",
      value: urgentLeads,
      change: "Demandes de rappel + nouveaux",
      icon: AlertCircle,
      color: "text-red-600"
    },
    {
      title: "Aujourd'hui",
      value: todayLeads,
      change: "Nouveaux leads aujourd'hui",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Contacts rapides",
      value: stats.totalQuickContacts,
      change: "Formulaire de contact",
      icon: MessageSquare,
      color: "text-orange-600"
    },
    {
      title: "Rappels demandés",
      value: stats.totalCallbackRequests,
      change: "Nécessitent un contact",
      icon: Phone,
      color: "text-pink-600"
    },
    {
      title: "Taux de completion",
      value: `${completionRate}%`,
      change: "Formulaires complets",
      icon: CheckCircle2,
      color: "text-indigo-600"
    },
    {
      title: "Ce mois",
      value: stats.monthlyLeads,
      change: "Leads ce mois-ci",
      icon: Clock,
      color: "text-teal-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};