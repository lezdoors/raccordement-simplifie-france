
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAutoEventLogger } from './use-auto-event-logger';

export interface LeadFile {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  content_type: string;
  uploaded_by: string;
  created_at: string;
  description?: string;
}

export const useLeadFiles = (leadId: string) => {
  const [files, setFiles] = useState<LeadFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { logEvent } = useAutoEventLogger(leadId);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_files')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Erreur lors du chargement des fichiers');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, description?: string): Promise<boolean> => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `leads/${leadId}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('lead-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('lead-files')
        .getPublicUrl(filePath);

      // Save file record
      const { error: dbError } = await supabase
        .from('lead_files')
        .insert({
          lead_id: leadId,
          file_name: file.name,
          file_url: publicUrl,
          file_size: file.size,
          content_type: file.type,
          description: description
        });

      if (dbError) throw dbError;

      // Log the event
      await logEvent('file_uploaded', `Fichier "${file.name}" ajouté`);

      toast.success('Fichier uploadé avec succès');
      await fetchFiles();
      return true;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erreur lors de l\'upload du fichier');
      return false;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string, fileName: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('lead_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      // Log the event
      await logEvent('file_deleted', `Fichier "${fileName}" supprimé`);

      toast.success('Fichier supprimé avec succès');
      await fetchFiles();
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Erreur lors de la suppression du fichier');
      return false;
    }
  };

  const downloadFile = async (file: LeadFile): Promise<void> => {
    try {
      // Create a download link
      const link = document.createElement('a');
      link.href = file.file_url;
      link.download = file.file_name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Log the event
      await logEvent('file_downloaded', `Fichier "${file.file_name}" téléchargé`);

      toast.success('Téléchargement démarré');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  const refetch = async () => {
    setLoading(true);
    await fetchFiles();
  };

  useEffect(() => {
    if (leadId) {
      fetchFiles();
    }
  }, [leadId]);

  return {
    files,
    loading,
    uploading,
    uploadFile,
    deleteFile,
    downloadFile,
    refetch
  };
};
