import React, { useState } from 'react';
import { X, FileMusic, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FileDetailsProps {
  file: File;
  title: string;
  onTitleChange: (title: string) => void;
  onRemoveFile: () => void;
  isUploading: boolean;
  uploadProgress: number;
  username: string;
  onSubmit: (e: React.FormEvent) => void;
}

const FileDetails = ({ 
  file, 
  title, 
  onTitleChange, 
  onRemoveFile, 
  isUploading, 
  uploadProgress, 
  username,
  onSubmit 
}: FileDetailsProps) => {
  return (
    <div className="space-y-5">
      <div className="bg-secondary/30 rounded-lg p-3 flex items-start">
        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileMusic className="h-6 w-6 text-primary" />
        </div>
        
        <div className="ml-3 flex-grow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium truncate max-w-[200px]">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            
            <button 
              type="button"
              onClick={onRemoveFile}
              className="text-muted-foreground hover:text-foreground"
              disabled={isUploading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {isUploading && (
            <div className="mt-2">
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground">Envoi en cours...</span>
                <span className="text-xs font-medium">{uploadProgress}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1.5">
            Titre du morceau <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Saisissez un titre"
            className="w-full"
            disabled={isUploading}
            required
            data-testid="title-input"
          />
        </div>
        
        <div>
          <label htmlFor="artist" className="block text-sm font-medium mb-1.5">
            Artiste
          </label>
          <Input
            id="artist"
            type="text"
            value={username || ''}
            className="w-full bg-secondary/20"
            disabled={true}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Le nom d'artiste correspond à votre nom d'utilisateur
          </p>
        </div>
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full rounded-lg h-11 font-medium"
          disabled={isUploading || !title.trim()}
          data-testid="submit-upload"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            'Ajouter la musique'
          )}
        </Button>
      </div>
    </div>
  );
};

export default FileDetails;
