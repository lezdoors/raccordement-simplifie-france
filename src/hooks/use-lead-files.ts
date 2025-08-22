
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LeadFile {
  id: string;
  lead_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by?: string;
  description?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export const useLeadFiles = (leadId?: string) => {
  const [files, setFiles] = useState<LeadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchFiles = async () => {
    if (!leadId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lead_files')
        .select('*')
        .eq('lead_id', leadId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching files:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les fichiers",
          variant: "destructive",
        });
        return;
      }

      setFiles(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: "Erreur",
        description: "Erreur inattendue lors du chargement des fichiers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, description?: string) => {
    if (!leadId) return null;

    try {
      setUploading(true);
      
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${leadId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('lead-files')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Erreur d'upload",
          description: "Impossible de télécharger le fichier",
          variant: "destructive",
        });
        return null;
      }

      // Save file metadata to database
      const { data, error: dbError } = await supabase
        .from('lead_files')
        .insert({
          lead_id: leadId,
          file_name: file.name,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type || 'application/octet-stream',
          description: description || null,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        // Clean up uploaded file
        await supabase.storage.from('lead-files').remove([fileName]);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer les métadonnées du fichier",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Succès",
        description: "Fichier téléchargé avec succès",
      });

      // Refresh files list
      await fetchFiles();
      return data;
    } catch (err) {
      console.error('Unexpected upload error:', err);
      toast({
        title: "Erreur",
        description: "Erreur inattendue lors du téléchargement",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId: string, filePath: string) => {
    try {
      // Mark as deleted in database
      const { error: dbError } = await supabase
        .from('lead_files')
        .update({ is_deleted: true })
        .eq('id', fileId);

      if (dbError) {
        console.error('Database error:', dbError);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le fichier",
          variant: "destructive",
        });
        return;
      }

      // Remove from storage
      const { error: storageError } = await supabase.storage
        .from('lead-files')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage error:', storageError);
        // File might already be deleted, so we'll just log the error
      }

      toast({
        title: "Succès",
        description: "Fichier supprimé avec succès",
      });

      // Refresh files list
      await fetchFiles();
    } catch (err) {
      console.error('Unexpected delete error:', err);
      toast({
        title: "Erreur",
        description: "Erreur inattendue lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('lead-files')
        .download(filePath);

      if (error) {
        console.error('Download error:', error);
        toast({
          title: "Erreur",
          description: "Impossible de télécharger le fichier",
          variant: "destructive",
        });
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Unexpected download error:', err);
      toast({
        title: "Erreur",
        description: "Erreur inattendue lors du téléchargement",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [leadId]);

  return {
    files,
    loading,
    uploading,
    uploadFile,
    deleteFile,
    downloadFile,
    refetch: fetchFiles,
  };
};
