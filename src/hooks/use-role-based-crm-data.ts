
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { useAutoEventLogger } from './use-auto-event-logger';
import { UserRole } from '@/utils/permissions';
import { getRoleBasedConfig, filterLeadDataByRole } from '@/utils/role-access';
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
  payment_status?: string;
  amount?: number;
  form_type: string;
  created_at: string;
  updated_at: string;
  status: string;
}

export const useRoleBasedCRMData = () => {
  const { user, adminUser } = useAdmin();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    if (!adminUser || !user) {
      console.log('⚠️ No admin user or auth user, skipping lead fetch');
      return;
    }

    try {
      console.log('🔍 Fetching leads for role:', adminUser.role);
      
      const roleConfig = getRoleBasedConfig(adminUser.role as UserRole);
      
      // Use different table/view based on role
      let query;
      
      if (roleConfig.tableView === 'traiteur') {
        // Use leads_for_traiteur view for traiteur role
        query = supabase
          .from('leads_for_traiteur')
          .select(roleConfig.allowedFields.join(', '))
          .order('created_at', { ascending: false });
          
        // Traiteurs only see leads assigned to them or unassigned leads
        query = query.or(`assigned_to_email.eq.${user.email},assigned_to_email.is.null`);
      } else {
        // Use full leads_raccordement table for superadmin/manager
        query = supabase
          .from('leads_raccordement')
          .select('*')
          .order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('❌ Error fetching leads:', error);
        setError(`Erreur lors du chargement des leads: ${error.message}`);
        return;
      }

      console.log('✅ Leads fetched successfully:', data?.length || 0);
      
      // Filter data based on role permissions
      const filteredLeads = data?.map(lead => 
        filterLeadDataByRole(lead, adminUser.role as UserRole)
      ) || [];
      
      setLeads(filteredLeads);
    } catch (err) {
      console.error('❌ Unexpected error fetching leads:', err);
      setError('Erreur inattendue lors du chargement des données');
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      // Get old status for logging
      const oldLead = leads.find(l => l.id === leadId);
      const oldStatus = oldLead?.etat_projet;

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

      // Log the status change event if we have old status
      if (oldStatus && oldStatus !== newStatus) {
        try {
          await supabase.rpc('log_lead_event', {
            p_lead_id: leadId,
            p_type: 'status_changed',
            p_actor_id: user?.id || null,
            p_payload: { old_status: oldStatus, new_status: newStatus }
          });
        } catch (logError) {
          console.error('Failed to log status change:', logError);
        }
      }

      toast.success('Statut mis à jour avec succès');
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const assignLead = async (leadId: string, email: string) => {
    try {
      const assignedEmail = email === "unassigned" ? null : email;
      
      // Get old assignment for logging
      const oldLead = leads.find(l => l.id === leadId);
      const oldAssignee = oldLead?.assigned_to_email;
      
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

      // Log the assignment change event
      try {
        await supabase.rpc('log_lead_event', {
          p_lead_id: leadId,
          p_type: 'assignment_changed',
          p_actor_id: user?.id || null,
          p_payload: { 
            old_assignee: oldAssignee, 
            new_assignee: assignedEmail 
          }
        });
      } catch (logError) {
        console.error('Failed to log assignment change:', logError);
      }

      toast.success('Lead assigné avec succès');
    } catch (error: any) {
      console.error('Error assigning lead:', error);
      toast.error('Erreur lors de l\'assignation');
    }
  };

  useEffect(() => {
    if (adminUser && user) {
      fetchLeads().finally(() => setLoading(false));
    }
  }, [adminUser, user]);

  return {
    leads,
    loading,
    error,
    refetch: fetchLeads,
    updateLeadStatus,
    assignLead,
    roleConfig: adminUser ? getRoleBasedConfig(adminUser.role as UserRole) : null
  };
};
