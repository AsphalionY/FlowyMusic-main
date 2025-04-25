import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { formatTime } from './formatTime';
import { MusicTrackType } from './types';

export const useMediaRecorderSetup = (onTrackAdded: (track: MusicTrackType) => void) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isDataReceived, setIsDataReceived] = useState(false);

  const setupMediaRecorder = (stream: MediaStream, recordingTime: number) => {
    try {
      // Configuration avancée pour éviter l'écho
      const options = {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000,
      };

      // Créer un MediaRecorder directement à partir du stream
      audioChunksRef.current = [];
      setIsDataReceived(false);

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.addEventListener('dataavailable', event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          setIsDataReceived(true);
        }
      });

      recorder.addEventListener('stop', () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

          const newTrack: MusicTrackType = {
            id: uuidv4(),
            name: `Enregistrement ${recordingTime > 0 ? formatTime(recordingTime) : ''}`,
            audioBlob,
            type: 'recording',
            color: `bg-gradient-to-r from-purple-500/70 to-pink-500/70`,
          };

          onTrackAdded(newTrack);

          toast.success('Enregistrement terminé', {
            description: 'Votre enregistrement a été ajouté aux pistes',
          });
        }
      });

      // Démarrer l'enregistreur avec collecte de données toutes les 500ms
      // Ceci N'EST PAS la durée maximale d'enregistrement, mais uniquement
      // l'intervalle auquel les données sont collectées
      recorder.start(500);

      return recorder;
    } catch (error) {
      console.error('Error setting up MediaRecorder:', error);
      toast.error("Problème de configuration d'enregistrement");
      throw error;
    }
  };

  return {
    mediaRecorderRef,
    audioChunksRef,
    isDataReceived,
    setupMediaRecorder,
  };
};
