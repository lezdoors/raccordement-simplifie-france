import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, Mail, LogOut, Users, MessageSquare, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Lead {
  id: string;
  created_at: string;
  phone?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  type_raccordement?: string;
  status?: string;
  zipcode?: string;
}

interface Case {
  id: string;
  created_at: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  client_type?: string;
  payment_status?: string;
  amount_cents?: number;
}

export const SimpleCRM = () => {
  const navigate = useNavigate();
  const { user, adminUser, loading } = useAdmin();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user && adminUser) {
      fetchData();
    }
  }, [user, adminUser, loading, navigate]);

  const fetchData = async () => {
    try {
      setDataLoading(true);
      
      // Fetch leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (leadsError) {
        console.error('Error fetching leads:', leadsError);
      } else {
        setLeads(leadsData || []);
      }

      // Fetch cases
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (casesError) {
        console.error('Error fetching cases:', casesError);
      } else {
        setCases(casesData || []);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="secondary">Non défini</Badge>;
    
    const statusColors: Record<string, string> = {
      'new': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const getPaymentBadge = (status?: string) => {
    if (!status) return <Badge variant="secondary">Non défini</Badge>;
    
    const statusColors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'paid': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || !adminUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Accès non autorisé</CardTitle>
            <CardDescription>
              Vous devez être connecté en tant qu'administrateur pour accéder à cette page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')} className="w-full">
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">CRM Dashboard</h1>
              <p className="text-muted-foreground">
                Connecté en tant que: {adminUser.email} ({adminUser.role})
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('tel:+33189701200')}
              >
                <Phone className="h-4 w-4 mr-2" />
                01 89 70 12 00
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dossiers</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cases.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cette semaine</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leads.filter(lead => 
                  new Date(lead.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(cases.reduce((sum, case_) => 
                  sum + (case_.amount_cents || 0), 0) / 100)} €
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList>
            <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
            <TabsTrigger value="cases">Dossiers ({cases.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Leads</CardTitle>
                <CardDescription>
                  Liste des prospects récents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Code postal</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>{formatDate(lead.created_at)}</TableCell>
                        <TableCell>{lead.phone || 'Non renseigné'}</TableCell>
                        <TableCell>{lead.zipcode || 'Non renseigné'}</TableCell>
                        <TableCell>{lead.type_raccordement || 'Non renseigné'}</TableCell>
                        <TableCell>{lead.utm_source || 'Direct'}</TableCell>
                        <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {leads.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun lead trouvé
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cases">
            <Card>
              <CardHeader>
                <CardTitle>Dossiers</CardTitle>
                <CardDescription>
                  Liste des dossiers clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Paiement</TableHead>
                      <TableHead>Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cases.map((case_) => (
                      <TableRow key={case_.id}>
                        <TableCell>{formatDate(case_.created_at)}</TableCell>
                        <TableCell>
                          {case_.first_name && case_.last_name 
                            ? `${case_.first_name} ${case_.last_name}` 
                            : 'Non renseigné'}
                        </TableCell>
                        <TableCell>{case_.email || 'Non renseigné'}</TableCell>
                        <TableCell>{case_.phone || 'Non renseigné'}</TableCell>
                        <TableCell>{case_.client_type || 'Particulier'}</TableCell>
                        <TableCell>{getPaymentBadge(case_.payment_status)}</TableCell>
                        <TableCell>
                          {case_.amount_cents ? `${(case_.amount_cents / 100).toFixed(2)} €` : '0 €'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {cases.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun dossier trouvé
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t py-4 mt-8">
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