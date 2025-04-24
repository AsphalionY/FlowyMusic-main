import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAudioResources } from './useAudioResources';
import { useRecordingTimer } from './useRecordingTimer';
import { useMediaRecorder, type MusicTrackType } from './useMediaRecorder';

interface UseRecorderOptions {
  onTrackAdded: (track: MusicTrackType) => void;
}

export type { MusicTrackType };

export const useRecorder = ({ onTrackAdded }: UseRecorderOptions) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const { recordingTime, startTimer, stopTimer, formatTime } = useRecordingTimer();
  
  const { 
    requestMicrophoneAccess, 
    cleanupAudioResources
  } = useAudioResources();
  
  const { 
    setupMediaRecorder, 
    stopRecording: stopMediaRecording, 
    pauseRecording: pauseMediaRecording
  } = useMediaRecorder({ 
    onTrackAdded, 
    formatTime, 
    recordingTime 
  });
  
  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
      cleanupAudioResources();
    };
  }, [isRecording]);
  
  const startRecording = useCallback(async () => {
    if (isInitializing || isRecording) {
      return;
    }
    
    try {
      setIsInitializing(true);
      setMicPermissionError(false);
      
      const { micStream } = await requestMicrophoneAccess();
      
      setupMediaRecorder(micStream);
      
      setIsRecording(true);
      setIsPaused(false);
      
      startTimer();
      
      toast.info('Enregistrement démarré', {
        description: 'Vous enregistrez maintenant votre session'
      });
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'enregistrement:', error);
      setMicPermissionError(true);
      
      await cleanupAudioResources();
    } finally {
      setIsInitializing(false);
    }
  }, [requestMicrophoneAccess, setupMediaRecorder, startTimer, cleanupAudioResources, isInitializing, isRecording]);
  
  const pauseRecording = useCallback(() => {
    if (!isRecording) return;
    
    const newPausedState = pauseMediaRecording();
    
    if (newPausedState !== null) {
      setIsPaused(newPausedState);
      
      if (newPausedState) {
        stopTimer();
      } else {
        startTimer();
      }
    }
  }, [isRecording, pauseMediaRecording, startTimer, stopTimer]);
  
  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    
    stopMediaRecording();
    stopTimer();
    setIsRecording(false);
    setIsPaused(false);
    
    setTimeout(() => {
      cleanupAudioResources();
    }, 500);
  }, [isRecording, stopMediaRecording, stopTimer, cleanupAudioResources]);
  
  return {
    isRecording,
    isPaused,
    recordingTime,
    micPermissionError,
    formatTime,
    startRecording,
    pauseRecording,
    stopRecording,
    isInitializing
  };
};
