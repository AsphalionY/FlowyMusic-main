
import { useState, useRef, useCallback, useEffect } from 'react';

export const useTimer = () => {
  const [time, setTime] = useState(0);
  const timerRef = useRef<number | null>(null);
  
  const startTimer = useCallback(() => {
    // Clear any existing timer first
    stopTimer();
    
    // Reset time
    setTime(0);
    
    // Start a new timer
    timerRef.current = window.setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  }, []);
  
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);
  
  return {
    time,
    startTimer,
    stopTimer
  };
};
