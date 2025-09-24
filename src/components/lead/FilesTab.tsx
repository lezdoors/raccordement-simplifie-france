
import React from 'react';
import { useLeadFiles } from '@/hooks/use-lead-files';
import { FileUpload } from './FileUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2, File, Image, FileText, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FilesTabProps {
  leadId?: string;
}

export const FilesTab: React.FC<FilesTabProps> = ({ leadId }) => {
  const { files, loading, uploading, uploadFile, deleteFile, downloadFile } = useLeadFiles(leadId);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (mimeType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeLabel = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word')) return 'Word';
    if (mimeType.includes('text')) return 'Texte';
    return 'Fichier';
  };

  if (!leadId) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">ID du lead manquant</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Télécharger des fichiers</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            onUpload={uploadFile}
            uploading={uploading}
          />
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <File className="h-5 w-5" />
            Fichiers attachés ({files.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Chargement des fichiers...</p>
          ) : files.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun fichier attaché à ce lead
            </p>
          ) : (
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.content_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{file.file_name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {getFileTypeLabel(file.content_type)}
                      </Badge>
                    </div>
                    
                    {file.description && (
                      <p className="text-sm text-muted-foreground mb-2">{file.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(file.created_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                      </span>
                      <span>{formatFileSize(file.file_size)}</span>
                      {file.uploaded_by && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Téléchargé par admin
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
      {/* Download handled by onClick */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => downloadFile(file.id)}
      >
        <Download className="h-4 w-4" />
      </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer le fichier</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer "{file.file_name}" ? 
                            Cette action ne peut pas être annulée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteFile(file.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
