import { useState, useRef, useCallback, useEffect } from 'react';

export const useTimer = () => {
  const [time, setTime] = useState(0);
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
  }, [stopTimerRef]);

  // Définir startTimer en utilisant la référence à stopTimer
  const startTimer = useCallback(() => {
    // Clear any existing timer first
    stopTimerRef.current();

    // Reset time
    setTime(0);

    // Start a new timer
    timerRef.current = window.setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
  }, [setTime]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  return {
    time,
    startTimer,
    stopTimer,
  };
};
