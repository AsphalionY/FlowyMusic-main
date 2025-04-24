
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useTimer } from './useTimer';
import { formatTime } from './formatTime';
import { useMediaRecorderSetup } from './useMediaRecorderSetup';
import { cleanupAudioResources } from './audioCleanup';
import { UseRecorderOptions } from './types';

export const useAudioRecorder = ({ onTrackAdded }: UseRecorderOptions) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState(false);
  
  const { time: recordingTime, startTimer, stopTimer } = useTimer();
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const { 
    mediaRecorderRef, 
    setupMediaRecorder 
  } = useMediaRecorderSetup(onTrackAdded);
  
  // Cleanup function
  useEffect(() => {
    return () => {
      stopRecording();
      stopTimer();
      cleanupResources();
    };
  }, []);
  
  const cleanupResources = () => {
    cleanupAudioResources(audioSourceRef, micStreamRef, audioContextRef);
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
        }
      };
      
      const micStream = await navigator.mediaDevices.getUserMedia(constraints);
      micStreamRef.current = micStream;
      
      // Créer un nouveau contexte audio si nécessaire
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
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
        description: 'Vous enregistrez maintenant votre session (système anti-écho actif)'
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setMicPermissionError(true);
      toast.error('Impossible d\'accéder au microphone', {
        description: 'Veuillez vérifier les permissions de votre navigateur.'
      });
    }
  };
  
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
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      stopTimer();
      setIsRecording(false);
      setIsPaused(false);
      
      // Nettoyer les ressources audio après un court délai
      setTimeout(() => {
        cleanupResources();
      }, 300);
    }
  };
  
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
