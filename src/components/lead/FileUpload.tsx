
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

interface FileUploadProps {
  onUpload: (file: File, description?: string) => Promise<any>;
  uploading: boolean;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
}

interface FilePreview {
  file: File;
  preview?: string;
  description: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  uploading,
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt']
}) => {
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      console.error('Rejected files:', rejectedFiles);
      return;
    }

    const newPreviews = acceptedFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      description: ''
    }));

    setFilePreviews(prev => [...prev, ...newPreviews]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    disabled: uploading
  });

  const removeFile = (index: number) => {
    setFilePreviews(prev => {
      const newPreviews = [...prev];
      if (newPreviews[index].preview) {
        URL.revokeObjectURL(newPreviews[index].preview!);
      }
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const updateDescription = (index: number, description: string) => {
    setFilePreviews(prev => {
      const newPreviews = [...prev];
      newPreviews[index].description = description;
      return newPreviews;
    });
  };

  const handleUpload = async () => {
    for (let i = 0; i < filePreviews.length; i++) {
      const { file, description } = filePreviews[i];
      setUploadProgress((i / filePreviews.length) * 100);
      await onUpload(file, description);
    }
    setUploadProgress(100);
    setFilePreviews([]);
    setTimeout(() => setUploadProgress(0), 1000);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-primary">Déposez les fichiers ici...</p>
            ) : (
              <div>
                <p className="text-foreground font-medium mb-2">
                  Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
                </p>
                <p className="text-sm text-muted-foreground">
                  Taille max: {formatFileSize(maxSize)} • Types acceptés: Images, PDF, DOC, TXT
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Previews */}
      {filePreviews.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Fichiers sélectionnés ({filePreviews.length})</h4>
          {filePreviews.map((filePreview, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {filePreview.preview ? (
                      <img
                        src={filePreview.preview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-muted rounded border">
                        {getFileIcon(filePreview.file.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{filePreview.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(filePreview.file.size)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor={`description-${index}`} className="text-xs">
                        Description (optionnelle)
                      </Label>
                      <Input
                        id={`description-${index}`}
                        placeholder="Description du fichier..."
                        value={filePreview.description}
                        onChange={(e) => updateDescription(index, e.target.value)}
                        disabled={uploading}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Upload en cours...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setFilePreviews([])}
              disabled={uploading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || filePreviews.length === 0}
            >
              {uploading ? 'Upload en cours...' : `Télécharger (${filePreviews.length})`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
