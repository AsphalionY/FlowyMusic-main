import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer la lecture audio
 * @param initialSrc - Source audio initiale (optionnelle)
 */
export const useAudioPlayer = (initialSrc?: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialiser l'élément audio
  useEffect(() => {
    const audio = new Audio(initialSrc);
    audioRef.current = audio;
    
    // Configurer les écouteurs d'événements
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      // Nettoyer les écouteurs d'événements
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      
      // Arrêter et libérer l'audio
      audio.pause();
      audio.src = '';
    };
  }, [initialSrc]);

  // Fonction pour démarrer la lecture
  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.error('Erreur de lecture:', error));
    }
  }, []);

  // Fonction pour mettre en pause
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Fonction pour définir le volume (0-1)
  const setVolumeValue = useCallback((value: number) => {
    const newVolume = Math.max(0, Math.min(1, value));
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  }, []);

  // Fonction pour chercher une position spécifique
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Fonction pour charger une nouvelle source audio
  const loadSrc = useCallback((src: string) => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.src = src;
      audioRef.current.load();
      if (wasPlaying) {
        play();
      }
    }
  }, [isPlaying, play]);

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    setVolume: setVolumeValue,
    seek,
    loadSrc
  };
};
