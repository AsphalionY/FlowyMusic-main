
import React from 'react';
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
  clearProject 
}: TracksListProps) => {
  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="font-medium flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          Pistes
        </div>
        
        {musicTracks.length > 0 && (
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
      
      <div className="flex-1 overflow-y-auto space-y-2">
        <AnimatePresence>
          {musicTracks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
              <Music className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm">Aucune piste</p>
              <p className="text-xs">Enregistrez ou importez de la musique pour commencer</p>
            </div>
          ) : (
            musicTracks.map((track) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <MusicTrack
                  track={track}
                  onRemove={handleRemoveTrack}
                  onRename={handleRenameTrack}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TracksList;
