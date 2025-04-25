import { useRef, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export interface MusicTrackType {
  id: string;
  name: string;
  audioBlob: Blob;
  type: 'recording' | 'imported' | 'instrument';
  color?: string;
}

interface UseMediaRecorderOptions {
  onTrackAdded: (track: MusicTrackType) => void;
  formatTime: (seconds: number) => string;
  recordingTime: number;
}

export const useMediaRecorder = ({
  onTrackAdded,
  formatTime,
  recordingTime,
}: UseMediaRecorderOptions) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isDataReceived, setIsDataReceived] = useState(false);

  const setupMediaRecorder = useCallback(
    (stream: MediaStream) => {
      try {
        if (stream.getAudioTracks().length === 0) {
          throw new Error('Aucune piste audio dans le flux');
        }

        const mimeTypes = [
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/ogg;codecs=opus',
          'audio/mp4',
        ];

        let selectedType = '';
        for (const type of mimeTypes) {
          if (MediaRecorder.isTypeSupported(type)) {
            selectedType = type;
            break;
          }
        }

        const options: MediaRecorderOptions = {
          mimeType: selectedType || undefined,
          audioBitsPerSecond: 128000,
        };

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
          if (audioChunksRef.current.length > 0 && isDataReceived) {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: recorder.mimeType || 'audio/webm',
            });

            if (audioBlob.size < 100) {
              toast.error('Enregistrement vide', {
                description: "Aucune donnée audio valide n'a été capturée.",
              });
              return;
            }

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
          } else {
            toast.error('Enregistrement vide', {
              description: "Aucune donnée audio n'a été capturée.",
            });
          }
        });

        // Démarrer l'enregistreur avec collecte de données toutes les 500ms
        // Ceci N'EST PAS la durée maximale d'enregistrement, mais uniquement
        // l'intervalle auquel les données sont collectées
        recorder.start(500);

        return recorder;
      } catch (error) {
        console.error('Erreur lors de la configuration du MediaRecorder:', error);
        toast.error("Problème de configuration d'enregistrement");
        throw error;
      }
    },
    [onTrackAdded, formatTime, recordingTime, isDataReceived]
  );

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        if (
          mediaRecorderRef.current.state === 'recording' ||
          mediaRecorderRef.current.state === 'paused'
        ) {
          mediaRecorderRef.current.requestData();
        }

        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error("Erreur lors de l'arrêt de l'enregistrement:", error);
      }

      mediaRecorderRef.current = null;
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (!mediaRecorderRef.current) return null;

    try {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.requestData();
        mediaRecorderRef.current.pause();
        toast.info('Enregistrement en pause');
        return true;
      } else if (mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume();
        toast.info('Enregistrement repris');
        return false;
      }
    } catch (error) {
      console.error("Erreur lors du basculement de l'état de pause:", error);
      toast.error("Problème avec la pause d'enregistrement");
    }

    return null;
  }, []);

  return {
    setupMediaRecorder,
    stopRecording,
    pauseRecording,
    mediaRecorderRef,
    isDataReceived,
  };
};
