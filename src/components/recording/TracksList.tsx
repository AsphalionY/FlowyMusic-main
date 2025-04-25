import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Layers, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MusicTrack from '../instruments/MusicTrack';

interface TracksListProps {
  musicTracks: Array<{
    id: string;
    name: string;
    audioBlob: Blob;
    type: 'recording' | 'imported' | 'instrument';
    color?: string;
  }>;
  handleRemoveTrack: (id: string) => void;
  handleRenameTrack: (id: string, newName: string) => void;
  clearProject: () => void;
}

const TracksList = ({
  musicTracks,
  handleRemoveTrack,
  handleRenameTrack,
  clearProject,
}: TracksListProps) => {
  const [tracks, setTracks] = useState(musicTracks);

  // Mettre à jour les pistes lorsque musicTracks change
  useEffect(() => {
    setTracks(musicTracks);
  }, [musicTracks]);

  // Fonction pour déplacer une piste vers le haut
  const moveTrackUp = (id: string) => {
    const index = tracks.findIndex(track => track.id === id);
    if (index <= 0) return;

    const newTracks = [...tracks];
    const temp = newTracks[index];
    newTracks[index] = newTracks[index - 1];
    newTracks[index - 1] = temp;
    setTracks(newTracks);
  };

  // Fonction pour déplacer une piste vers le bas
  const moveTrackDown = (id: string) => {
    const index = tracks.findIndex(track => track.id === id);
    if (index === -1 || index >= tracks.length - 1) return;

    const newTracks = [...tracks];
    const temp = newTracks[index];
    newTracks[index] = newTracks[index + 1];
    newTracks[index + 1] = temp;
    setTracks(newTracks);
  };

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="font-medium flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          Pistes
        </div>

        {tracks.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={clearProject}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Tout effacer
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full pr-4">
        <div className="space-y-6 min-w-[300px] w-full">
          <AnimatePresence>
            {tracks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                <Music className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">Aucune piste</p>
                <p className="text-xs">Enregistrez ou importez de la musique pour commencer</p>
              </div>
            ) : (
              tracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <MusicTrack
                    track={track}
                    onRemove={handleRemoveTrack}
                    onRename={handleRenameTrack}
                    hideWaveformControls={true}
                    onTrackPosition={{
                      isFirst: index === 0,
                      isLast: index === tracks.length - 1,
                      position: index + 1,
                      moveUp: moveTrackUp,
                      moveDown: moveTrackDown,
                    }}
                  />

                  {/* Séparation violette entre les pistes */}
                  {index < tracks.length - 1 && <div className="h-0.5 bg-primary/30 w-full mt-6" />}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TracksList;
