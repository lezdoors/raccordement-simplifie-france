import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { UserRole } from '@/utils/permissions';
import { toast } from 'sonner';

interface Lead {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  type_client: string;
  type_projet: string;
  adresse_chantier: string;
  ville: string;
  code_postal: string;
  type_raccordement: string;
  type_alimentation: string;
  puissance: string;
  etat_projet: string;
  delai_souhaite: string;
  commentaires: string;
  assigned_to_email: string;
  payment_status: string;
  amount: number;
  form_type: string;
  created_at: string;
  updated_at: string;
  status: string;
}

// Message interface removed - all data now unified in Lead interface

interface CRMStats {
  totalLeads: number;
  totalQuickContacts: number;
  totalPartialSubmissions: number;
  totalFullSubmissions: number;
  weeklyLeads: number;
  monthlyLeads: number;
}

export const useCRMData = () => {
  const { user, adminUser } = useAdmin();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<CRMStats>({
    totalLeads: 0,
    totalQuickContacts: 0,
    totalPartialSubmissions: 0,
    totalFullSubmissions: 0,
    weeklyLeads: 0,
    monthlyLeads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    if (!adminUser || !user) {
      console.log('⚠️ No admin user or auth user, skipping lead fetch');
      return;
    }

    try {
      console.log('🔍 Fetching leads for admin user:', adminUser);
      
      let query = supabase
        .from('leads_raccordement')
        .select('*')
        .order('created_at', { ascending: false });

      // Role-based filtering
      if (adminUser.role === 'traiteur') {
        // Traiteurs only see leads assigned to them or unassigned leads
        query = query.or(`assigned_to_email.eq.${user.email},assigned_to_email.is.null`);
      }
      // superadmin and manager see all leads

      const { data, error } = await query;
      
      if (error) {
        console.error('❌ Error fetching leads:', error);
        setError(`Erreur lors du chargement des leads: ${error.message}`);
        return;
      }

      console.log('✅ Leads fetched successfully:', data?.length || 0);
      setLeads(data || []);
    } catch (err) {
      console.error('❌ Unexpected error fetching leads:', err);
      setError('Erreur inattendue lors du chargement des données');
    }
  };

  // No longer needed - all messages/contacts are now leads in the unified table

  const calculateStats = (leadsData: Lead[]) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const weeklyLeads = leadsData.filter(
      l => new Date(l.created_at) >= weekAgo
    ).length;

    const monthlyLeads = leadsData.filter(
      l => new Date(l.created_at) >= monthAgo
    ).length;

    // Calculate stats by form type
    const quickContacts = leadsData.filter(l => l.form_type === 'quick').length;
    const partialSubmissions = leadsData.filter(l => l.form_type === 'step1').length;
    const fullSubmissions = leadsData.filter(l => l.form_type === 'full').length;

    setStats({
      totalLeads: leadsData.length,
      totalQuickContacts: quickContacts,
      totalPartialSubmissions: partialSubmissions,
      totalFullSubmissions: fullSubmissions,
      weeklyLeads,
      monthlyLeads,
    });
  };

  const fetchData = async () => {
    if (!adminUser) {
      console.log('⚠️ No admin user, waiting...');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Starting CRM data fetch...', { 
        user: user?.email, 
        role: adminUser?.role 
      });

      await fetchLeads();
    } catch (err) {
      console.error('💥 Critical error fetching CRM data:', err);
      setError('Erreur lors du chargement des données du CRM');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads_raccordement')
        .update({ 
          etat_projet: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.map(l => 
        l.id === leadId ? { ...l, etat_projet: newStatus } : l
      ));

      toast.success('Statut mis à jour avec succès');
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const assignLead = async (leadId: string, email: string) => {
    try {
      const assignedEmail = email === "unassigned" ? null : email;
      
      const { error } = await supabase
        .from('leads_raccordement')
        .update({ 
          assigned_to_email: assignedEmail,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.map(l => 
        l.id === leadId ? { ...l, assigned_to_email: assignedEmail } : l
      ));

      toast.success('Lead assigné avec succès');
    } catch (error: any) {
      console.error('Error assigning lead:', error);
      toast.error('Erreur lors de l\'assignation');
    }
  };

  const addNote = async (leadId: string, note: string) => {
    try {
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;

      const currentComments = lead.commentaires || '';
      const timestamp = new Date().toLocaleString('fr-FR');
      const newComment = `${timestamp} - ${user?.email}: ${note}`;
      const updatedComments = currentComments 
        ? `${currentComments}\n\n${newComment}` 
        : newComment;

      const { error } = await supabase
        .from('leads_raccordement')
        .update({ 
          commentaires: updatedComments,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.map(l => 
        l.id === leadId ? { ...l, commentaires: updatedComments } : l
      ));

      toast.success('Note ajoutée avec succès');
    } catch (error: any) {
      console.error('Error adding note:', error);
      toast.error('Erreur lors de l\'ajout de la note');
    }
  };

  // Calculate stats when data changes
  useEffect(() => {
    calculateStats(leads);
  }, [leads]);

  // Fetch data when admin user is available
  useEffect(() => {
    if (adminUser && user) {
      fetchData();
    }
  }, [adminUser, user]);

  return {
    leads,
    stats,
    loading,
    error,
    refetch: fetchData,
    updateLeadStatus,
    assignLead,
    addNote,
  };
};