import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  redirectToLogin: () => void;
  isAuthenticated: boolean;
}

const FileDropzone = ({ onFileSelected, redirectToLogin, isAuthenticated }: FileDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };
  
  const processFile = (file: File) => {
    // Vérifier si c'est un fichier audio
    if (!file.type.startsWith('audio/')) {
      toast.error('Format de fichier non supporté', {
        description: 'Veuillez sélectionner un fichier audio (MP3, WAV, M4A, FLAC)'
      });
      return;
    }
    
    // Vérifier la taille du fichier (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Fichier trop volumineux', {
        description: 'La taille maximale est de 10MB'
      });
      return;
    }
    
    onFileSelected(file);
  };
  
  return (
    <div 
      role="button"
      tabIndex={0}
      aria-label="Zone de dépôt de fichiers. Cliquez ou faites glisser un fichier pour l'uploader."
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        "hover:bg-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isDragging ? "border-primary bg-primary/5" : "border-muted"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          document.getElementById('file-upload')?.click();
        }
      }}
    >
      <div className="mx-auto flex flex-col items-center">
        <div className="mb-4 h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
          <Upload className="h-6 w-6 text-muted-foreground" />
        </div>
        
        <h3 className="text-lg font-medium mb-1">
          Glissez-déposez ou cliquez pour choisir
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3">
          MP3, WAV, M4A ou FLAC, 10 MB maximum
        </p>
        
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          className="rounded-full h-9"
        >
          Parcourir
        </Button>
        
        <input 
          id="file-upload" 
          type="file" 
          accept="audio/*" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default FileDropzone;
