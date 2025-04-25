import { useState, useRef, useCallback, useEffect } from 'react';

export const useRecordingTimer = () => {
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Déclarer une référence à la fonction stopTimer pour éviter les références circulaires
  const stopTimerRef = useRef(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  });

  // Définir stopTimer en utilisant la référence
  const stopTimer = useCallback(() => {
    stopTimerRef.current();
  }, []);

  const startTimer = useCallback(() => {
    // Clear any existing timer first
    stopTimerRef.current();

    // Reset recording time
    setRecordingTime(0);

    // Start a new timer
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  }, [setRecordingTime, stopTimerRef]);

  // La fonction stopTimer est définie plus haut

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  return {
    recordingTime,
    startTimer,
    stopTimer,
    formatTime,
  };
};
