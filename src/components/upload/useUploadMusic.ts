import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts';
import { addSharedMusic, fileToBase64, calculateAudioDuration } from '@/services/musicService';

export const useUploadMusic = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState('');

  const redirectToLogin = () => {
    toast.error('Vous devez être connecté pour télécharger de la musique', {
      description: 'Redirection vers la page de connexion...',
    });
    setTimeout(() => navigate('/auth'), 1500);
  };

  const handleFileSelected = (file: File) => {
    try {
      setSelectedFile(file);
      setTitle(file.name.replace(/\.[^/.]+$/, '')); // Remove extension for suggested title
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invalid file type') {
          toast.error('Veuillez sélectionner un fichier audio valide', {
            description: 'Formats supportés : MP3, WAV, M4A, FLAC',
          });
        } else if (error.message === 'File too large') {
          toast.error('Le fichier est trop volumineux', {
            description: 'Taille maximale : 10MB',
          });
        }
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setTitle('');
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      redirectToLogin();
      return;
    }

    if (!selectedFile) return;

    if (!title.trim()) {
      toast.error('Veuillez ajouter un titre');
      return;
    }

    setIsUploading(true);

    try {
      // Convertir le fichier audio en base64
      const audioBase64 = await fileToBase64(selectedFile);

      // Calculer la durée du morceau
      const duration = await calculateAudioDuration(selectedFile);

      // Simulation de progression
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 95) {
          clearInterval(interval);
          setUploadProgress(95);
        } else {
          setUploadProgress(Math.min(Math.round(progress), 95));
        }
      }, 300);

      // Ajouter le morceau à la collection partagée
      const newMusic = await addSharedMusic({
        title: title.trim(),
        artist: user.username, // Utilisation automatique du nom d'utilisateur
        audioUrl: audioBase64,
        duration,
        uploadedBy: user.id,
        uploadedByName: user.username,
        // Générer une image de couverture par défaut si nécessaire
        coverArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=300',
      });

      // Finaliser l'upload
      setUploadProgress(100);
      clearInterval(interval);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setSelectedFile(null);
        setTitle('');

        toast.success('Morceau ajouté avec succès', {
          description: 'Votre morceau a été ajouté à la bibliothèque partagée',
        });

        // Jouer directement le morceau (avec safe access)
        if (typeof window !== 'undefined' && window.musicPlayer) {
          window.musicPlayer.playTrack({
            id: newMusic.id,
            title: newMusic.title,
            artist: newMusic.artist,
            duration: newMusic.duration,
            coverArt: newMusic.coverArt ?? '',
            audioUrl: audioBase64,
            uploadDate: new Date(),
            uploadedBy: user?.id || 'anonymous', 
            uploadedByName: user?.username || 'Utilisateur anonyme',
            plays: 0 
          });
        }
      }, 500);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      toast.error("Erreur lors de l'ajout de la musique");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    isAuthenticated,
    user,
    selectedFile,
    isUploading,
    uploadProgress,
    title,
    redirectToLogin,
    handleFileSelected,
    removeFile,
    handleTitleChange,
    handleSubmit,
  };
};
