
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { useAutoEventLogger } from './use-auto-event-logger';
import { toast } from 'sonner';

interface LeadFile {
  id: string;
  lead_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  description?: string;
  uploaded_by: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export const useLeadFiles = (leadId: string) => {
  const { user } = useAdmin();
  const { logFileUploaded, logFileDeleted } = useAutoEventLogger(leadId);
  const [files, setFiles] = useState<LeadFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_files')
        .select('*')
        .eq('lead_id', leadId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching lead files:', error);
      toast.error('Erreur lors du chargement des fichiers');
    }
  };

  const uploadFile = async (file: File, description?: string) => {
    if (!user) {
      toast.error('Utilisateur non authentifié');
      return false;
    }

    setUploading(true);
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${leadId}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('lead-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save file record
      const { error: dbError } = await supabase
        .from('lead_files')
        .insert({
          lead_id: leadId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          description,
          uploaded_by: user.id
        });

      if (dbError) throw dbError;

      // Log the event automatically
      await logFileUploaded(file.name, file.size, file.type);

      toast.success('Fichier uploadé avec succès');
      await fetchFiles();
      return true;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error('Erreur lors de l\'upload du fichier');
      return false;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string, fileName: string) => {
    try {
      const { error } = await supabase
        .from('lead_files')
        .update({ is_deleted: true })
        .eq('id', fileId);

      if (error) throw error;

      // Log the event automatically
      await logFileDeleted(fileName);

      toast.success('Fichier supprimé avec succès');
      await fetchFiles();
      return true;
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast.error('Erreur lors de la suppression du fichier');
      return false;
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchFiles().finally(() => setLoading(false));
    }
  }, [leadId]);

  return {
    files,
    loading,
    uploading,
    uploadFile,
    deleteFile,
    refetch: fetchFiles
  };
};
