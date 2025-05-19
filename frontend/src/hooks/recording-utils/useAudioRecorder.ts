import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useTimer } from './useTimer';
import { formatTime } from './formatTime';
import { useMediaRecorderSetup } from './useMediaRecorderSetup';
import { cleanupAudioResources } from './audioCleanup';
import { UseRecorderOptions } from './types';

// Extend Window interface to include webkitAudioContext for older browsers
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export const useAudioRecorder = ({ onTrackAdded }: UseRecorderOptions) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState(false);

  const { time: recordingTime, startTimer, stopTimer } = useTimer();
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const { mediaRecorderRef, setupMediaRecorder } = useMediaRecorderSetup(onTrackAdded);

  // Utiliser useRef pour stocker les fonctions et éviter les références circulaires
  const cleanupResourcesRef = useRef(() => {
    cleanupAudioResources(audioSourceRef, micStreamRef, audioContextRef);
  });

  const stopRecordingRef = useRef(() => {
    if (mediaRecorderRef.current && isRecording && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      stopTimer();
      setIsRecording(false);
      setIsPaused(false);

      // Nettoyer les ressources audio après un court délai
      setTimeout(() => {
        cleanupResourcesRef.current();
      }, 300);
    }
  });

  // Mettre à jour les références quand les dépendances changent
  useEffect(() => {
    cleanupResourcesRef.current = () => {
      cleanupAudioResources(audioSourceRef, micStreamRef, audioContextRef);
    };
  }, []);

  useEffect(() => {
    stopRecordingRef.current = () => {
      if (mediaRecorderRef.current && isRecording && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        stopTimer();
        setIsRecording(false);
        setIsPaused(false);

        // Nettoyer les ressources audio après un court délai
        setTimeout(() => {
          cleanupResourcesRef.current();
        }, 300);
      }
    };
  }, [isRecording, stopTimer, mediaRecorderRef, cleanupResourcesRef]);

  // Versions exposées des fonctions qui utilisent les refs
  const cleanupResources = useCallback(() => {
    cleanupResourcesRef.current();
  }, [cleanupResourcesRef]);
  
  const stopRecording = useCallback(() => {
    stopRecordingRef.current();
  }, [stopRecordingRef]);

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.pause();
        stopTimer();
        setIsPaused(true);
        toast.info('Enregistrement en pause');
      } else if (mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume();
        startTimer();
        setIsPaused(false);
        toast.info('Enregistrement repris');
      }
    }
  };

  const startRecording = async () => {
    try {
      // Réinitialiser les états
      setMicPermissionError(false);

      // Nettoyer les ressources audio précédentes
      cleanupResources();

      // Configuration avancée pour éviter l'écho
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
        },
      };

      const micStream = await navigator.mediaDevices.getUserMedia(constraints);
      micStreamRef.current = micStream;

      // Créer un nouveau contexte audio si nécessaire
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
      }

      const audioContext = audioContextRef.current;

      // Créer la source audio à partir du flux microphone
      const micSource = audioContext.createMediaStreamSource(micStream);
      audioSourceRef.current = micSource;

      // Configurer le MediaRecorder
      setupMediaRecorder(micStream, recordingTime);

      // Démarrer l'enregistrement
      setIsRecording(true);
      startTimer();

      toast.info('Enregistrement démarré', {
        description: 'Vous enregistrez maintenant votre session (système anti-écho actif)',
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setMicPermissionError(true);
      toast.error("Impossible d'accéder au microphone", {
        description: 'Veuillez vérifier les permissions de votre navigateur.',
      });
    }
  };

  // Cleanup function - utiliser directement les références pour éviter les dépendances circulaires
  useEffect(() => {
    return () => {
      // Utiliser directement les références au lieu des fonctions enveloppées dans useCallback
      stopRecordingRef.current();
      stopTimer();
      cleanupResourcesRef.current();
    };
  }, [stopTimer]);

  return {
    isRecording,
    isPaused,
    recordingTime,
    micPermissionError,
    formatTime,
    startRecording,
    pauseRecording,
    stopRecording,
  };
};
