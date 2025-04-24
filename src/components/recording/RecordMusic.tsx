import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import RecordingWorkspace from './RecordingWorkspace';
import ProjectControls from './ProjectControls';
import { useRecorder, MusicTrackType } from '@/hooks/recording/useRecorder';
import useUnsavedChangesWarning from '@/hooks/useUnsavedChangesWarning';
import UnsavedChangesDialog from './UnsavedChangesDialog';

interface RecordMusicProps {
  className?: string;
  activeInstrument?: string;
}

const RecordMusic = ({ className, activeInstrument = 'recorder' }: RecordMusicProps) => {
  const [musicTracks, setMusicTracks] = useState<MusicTrackType[]>([]);
  const [activeTab, setActiveTab] = useState(activeInstrument);
  const [projectTitle, setProjectTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { 
    isRecording, 
    isPaused, 
    recordingTime, 
    micPermissionError, 
    formatTime, 
    startRecording, 
    pauseRecording, 
    stopRecording,
    isInitializing
  } = useRecorder({
    onTrackAdded: (newTrack) => {
      setMusicTracks((prev) => [...prev, newTrack]);
    }
  });
  
  useEffect(() => {
    setActiveTab(activeInstrument);
  }, [activeInstrument]);
  
  const handleRemoveTrack = (id: string) => {
    setMusicTracks((prev) => prev.filter(track => track.id !== id));
  };
  
  const handleRenameTrack = (id: string, newName: string) => {
    setMusicTracks((prev) => 
      prev.map(track => track.id === id ? { ...track, name: newName } : track)
    );
  };
  
  const handleMusicImported = (audioBlob: Blob, fileName: string) => {
    const newTrack: MusicTrackType = {
      id: Math.random().toString(36).substr(2, 9),
      name: fileName.replace(/\.[^/.]+$/, "") || `Imported ${musicTracks.length + 1}`,
      audioBlob,
      type: 'imported',
      color: 'bg-gradient-to-r from-blue-500/70 to-green-500/70'
    };
    
    setMusicTracks((prev) => [...prev, newTrack]);
    toast.success('Music imported', {
      description: 'Your track has been added'
    });
  };
  
  const handleSaveProject = () => {
    if (!projectTitle.trim()) {
      toast.error('Please add a title');
      return;
    }
    
    if (musicTracks.length === 0) {
      toast.error('Your project has no tracks');
      return;
    }
    
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Project saved', {
        description: 'Your musical project has been added to your library.'
      });
      setMusicTracks([]);
      setProjectTitle('');
    }, 1500);
  };
  
  const clearProject = () => {
    if (musicTracks.length === 0) return;
    
    if (window.confirm('Are you sure you want to delete all tracks from this project?')) {
      setMusicTracks([]);
      toast.info('Project cleared', {
        description: 'All tracks have been removed'
      });
    }
  };

  // Utiliser le hook pour détecter les tentatives de navigation
  const { 
    showDialog, 
    navigateTo, 
    confirmNavigation, 
    saveAndNavigate, 
    cancelNavigation 
  } = useUnsavedChangesWarning({
    hasUnsavedChanges: musicTracks.length > 0,
    onSave: handleSaveProject
  });

  // Intercepter les clics sur les liens de navigation
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.getAttribute('href')?.startsWith('/') && musicTracks.length > 0) {
        e.preventDefault();
        navigateTo(link.getAttribute('href') || '/');
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, [musicTracks.length, navigateTo]);

  return (
    <div className={cn("max-w-5xl mx-auto", className)}>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Création</h2>
        <p className="text-muted-foreground">Créez votre musique en enregistrant, important ou utilisant des instruments virtuels</p>
      </div>

      {/* Boîte de dialogue pour les changements non sauvegardés */}
      <UnsavedChangesDialog
        open={showDialog}
        onClose={cancelNavigation}
        onSave={saveAndNavigate}
        onQuit={confirmNavigation}
      />

      <ProjectControls 
        projectTitle={projectTitle}
        setProjectTitle={setProjectTitle}
        handleSaveProject={handleSaveProject}
        isSaving={isSaving}
        musicTracks={musicTracks}
      />
      
      <RecordingWorkspace 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        musicTracks={musicTracks}
        handleRemoveTrack={handleRemoveTrack}
        handleRenameTrack={handleRenameTrack}
        clearProject={clearProject}
        isRecording={isRecording}
        isPaused={isPaused}
        micPermissionError={micPermissionError}
        isInitializing={isInitializing}
        recordingTime={recordingTime}
        formatTime={formatTime}
        startRecording={startRecording}
        pauseRecording={pauseRecording}
        stopRecording={stopRecording}
        onMusicImported={handleMusicImported}
      />
    </div>
  );
};

export default RecordMusic;
