
import React, { useState, useRef } from 'react';
import { Music, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MusicImporterProps {
  onMusicImported?: (audioBlob: Blob, fileName: string) => void;
  className?: string;
}

const MusicImporter = ({ onMusicImported, className }: MusicImporterProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Vérifier si c'est un fichier audio
      if (!file.type.includes('audio/')) {
        toast.error('Format non supporté', {
          description: 'Veuillez sélectionner un fichier audio (MP3, WAV, OGG, AAC)'
        });
        return;
      }
      
      // Vérifier la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Fichier trop volumineux', {
          description: 'La taille maximum est de 10MB'
        });
        return;
      }
      
      if (onMusicImported) {
        onMusicImported(file, file.name);
        toast.success('Musique importée', {
          description: 'Votre musique a été ajoutée aux pistes'
        });
      }
    }
  };
  
  return (
    <div className={cn("p-4 rounded-lg", className)}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Music className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Importer une musique</h3>
            <p className="text-xs text-muted-foreground">Formats supportés: MP3, WAV, OGG, AAC</p>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg bg-secondary/20 p-8 flex flex-col items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
          <Upload className="h-8 w-8 text-primary/60" />
        </div>
        
        <p className="text-center mb-4">
          Glissez et déposez un fichier audio<br /> ou cliquez pour parcourir
        </p>
        
        <Input 
          type="file" 
          ref={fileInputRef}
          accept="audio/*" 
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Button 
          variant="outline"
          onClick={handleUploadClick}
          className="mt-2"
        >
          <Upload className="h-4 w-4 mr-2" />
          Importer un fichier
        </Button>
      </div>
    </div>
  );
};

export default MusicImporter;
