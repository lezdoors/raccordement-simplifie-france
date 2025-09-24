import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExportOptions {
  format: 'csv' | 'excel';
  includeMessages?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
  filters?: {
    status?: string;
    assignedTo?: string;
    clientType?: string;
  };
}

export const useDataExport = () => {
  const [exporting, setExporting] = useState(false);

  const convertToCSV = (data: any[], headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportLeads = async (options: ExportOptions = { format: 'csv' }) => {
    try {
      setExporting(true);
      
      // Build query - using existing leads table
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters (simplified for existing schema)
      if (options.filters?.status && options.filters.status !== 'all') {
        query = query.eq('status', options.filters.status);
      }

      // Apply date range
      if (options.dateRange) {
        query = query
          .gte('created_at', options.dateRange.from.toISOString())
          .lte('created_at', options.dateRange.to.toISOString());
      }

      const { data: leads, error } = await query;
      
      if (error) throw error;

      if (!leads || leads.length === 0) {
        toast.info('Aucune donnée à exporter pour les critères sélectionnés');
        return;
      }

      const headers = [
        'id',
        'created_at',
        'phone',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'type_raccordement',
        'status',
        'zipcode'
      ];

      const csvContent = convertToCSV(leads, headers);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `leads_export_${timestamp}.csv`;
      
      downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
      
      toast.success(`Export réussi - ${leads.length} dossiers exportés`);
      
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error('Erreur lors de l\'export des données');
    } finally {
      setExporting(false);
    }
  };

  const exportMessages = async (options: ExportOptions = { format: 'csv' }) => {
    try {
      setExporting(true);
      
      let query = supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply date range
      if (options.dateRange) {
        query = query
          .gte('created_at', options.dateRange.from.toISOString())
          .lte('created_at', options.dateRange.to.toISOString());
      }

      const { data: messages, error } = await query;
      
      if (error) throw error;

      if (!messages || messages.length === 0) {
        toast.info('Aucun message à exporter pour les critères sélectionnés');
        return;
      }

      const headers = [
        'id',
        'created_at',
        'content',
        'role',
        'session_id',
        'tokens_in',
        'tokens_out'
      ];

      const csvContent = convertToCSV(messages, headers);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `messages_export_${timestamp}.csv`;
      
      downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
      
      toast.success(`Export réussi - ${messages.length} messages exportés`);
      
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error('Erreur lors de l\'export des messages');
    } finally {
      setExporting(false);
    }
  };

  const exportCombined = async (options: ExportOptions = { format: 'csv' }) => {
    try {
      setExporting(true);
      
      // Export both leads and messages
      await exportLeads(options);
      
      if (options.includeMessages) {
        await exportMessages(options);
      }
      
    } catch (error: any) {
      console.error('Combined export error:', error);
      toast.error('Erreur lors de l\'export combiné');
    } finally {
      setExporting(false);
    }
  };

  return {
    exportLeads,
    exportMessages,
    exportCombined,
    exporting
  };
};