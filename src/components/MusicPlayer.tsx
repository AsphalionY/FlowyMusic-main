import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Heart,
  Repeat,
  Shuffle,
  MoreHorizontal,
  MessageSquare,
  Share
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { incrementPlayCount, getSharedMusicById } from '@/services/musicService';
import WaveformPlayer from './WaveformPlayer';

interface MusicPlayerProps {
  className?: string;
}

// Type definition for a track
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverArt: string;
  audioUrl?: string; // URL or base64 encoded audio
}

const MusicPlayer = ({ className }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [waveformReady, setWaveformReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Current track state
  const [currentTrack, setCurrentTrack] = useState<Track>({
    id: "1",
    title: "Weightless",
    artist: "Marconi Union",
    duration: "4:36",
    coverArt: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    audioUrl: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3"
  });
  
  const [currentTime, setCurrentTime] = useState("0:00");

  useEffect(() => {
    // Créer l'élément audio
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Ajouter les événements
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', handleTrackEnd);
      audioRef.current.addEventListener('canplay', () => {
        if (isPlaying) audioRef.current?.play();
      });
    }
    
    return () => {
      // Cleanup des événements
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', handleTrackEnd);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Mettre à jour la source audio lorsque le morceau change
    if (audioRef.current && currentTrack.audioUrl) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      setWaveformReady(false);
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Erreur de lecture:', err);
          toast.error("Erreur lors de la lecture");
        });
        // Incrémenter le compteur de lecture si c'est une musique partagée
        if (currentTrack.id && getSharedMusicById(currentTrack.id)) {
          incrementPlayCount(currentTrack.id);
        }
      }
    }
  }, [currentTrack.audioUrl]);

  // Make the player available globally for the bot to control
  useEffect(() => {
    const player = {
      play: () => {
        setIsPlaying(true);
        if (audioRef.current) {
          audioRef.current.play().catch(err => {
            console.error('Erreur de lecture:', err);
          });
        }
        toast.success(`Lecture de ${currentTrack.title}`);
      },
      pause: () => {
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
        }
        toast.info("Lecture en pause");
      },
      playTrack: (track: Partial<Track>) => {
        // Si c'est une musique de notre bibliothèque partagée, on récupère l'URL audio
        let audioUrl = track.audioUrl;
        if (track.id && !audioUrl) {
          const sharedTrack = getSharedMusicById(track.id);
          if (sharedTrack) {
            audioUrl = sharedTrack.audioUrl;
          }
        }

        // Create a new track by merging with current or default values
        const newTrack: Track = {
          id: track.id || String(Math.random()),
          title: track.title || "Titre inconnu",
          artist: track.artist || "Artiste inconnu",
          duration: track.duration || "0:00",
          coverArt: track.coverArt || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          audioUrl: audioUrl
        };
        
        setCurrentTrack(newTrack);
        setIsPlaying(true);
        setProgress(0);
        setCurrentTime("0:00");
        toast.success(`Lecture de ${newTrack.title} par ${newTrack.artist}`);
      },
      toggleLike: () => {
        setIsLiked(!isLiked);
        toast.success(isLiked ? "Retiré des favoris" : "Ajouté aux favoris");
      }
    };
    
    // Make the player available globally
    (window as any).musicPlayer = player;
    
    return () => {
      delete (window as any).musicPlayer;
    };
  }, [currentTrack, isLiked]);

  const togglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.error('Erreur de lecture:', err);
          toast.error("Erreur lors de la lecture");
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const currentSeconds = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      
      if (duration) {
        // Mettre à jour la progression en pourcentage
        setProgress((currentSeconds / duration) * 100);
        
        // Mettre à jour l'affichage du temps
        setCurrentTime(convertSecondsToTime(currentSeconds));
      }
    }
  };

  const handleTrackEnd = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime("0:00");
    
    // Ici on pourrait ajouter une logique pour passer à la piste suivante
    // si nous avions une file d'attente
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };
  
  const toggleLike = () => setIsLiked(!isLiked);

  const convertSecondsToTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleWaveformSeek = (progress: number) => {
    if (audioRef.current) {
      const newTime = progress * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(progress * 100);
      setCurrentTime(convertSecondsToTime(newTime));
    }
  };
  
  const handleWaveformReady = () => {
    setWaveformReady(true);
  };

  return (
    <>
      {/* Audio élément caché */}
      <audio ref={audioRef} className="hidden">
        <track kind="captions" />
      </audio>
    
      <motion.div 
        className={cn(
          "fixed bottom-0 left-0 right-0 glass-morphism backdrop-blur-lg border-t border-white/20 py-3 px-4",
          "shadow-[0_-4px_20px_rgba(0,0,0,0.03)]",
          className
        )}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
      >
        <div className="container mx-auto flex flex-col">
          {/* Waveform visualisation */}
          {currentTrack.audioUrl && (
            <div className="mb-2 md:px-3">
              <WaveformPlayer 
                audioUrl={currentTrack.audioUrl}
                playing={isPlaying}
                onReady={handleWaveformReady}
                onSeek={handleWaveformSeek}
                waveColor="rgba(99, 102, 241, 0.3)"
                progressColor="rgba(99, 102, 241, 0.8)"
                height={32}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            {/* Track info */}
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-12 h-12 rounded-md overflow-hidden shadow-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img 
                  src={currentTrack.coverArt} 
                  alt={currentTrack.title} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <div className="hidden sm:block">
                <h4 className="font-medium text-sm line-clamp-1">{currentTrack.title}</h4>
                <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
              </div>
            </div>
            
            {/* Main controls */}
            <div className="flex flex-col items-center max-w-md w-full">
              {/* Control buttons */}
              <div className="flex items-center space-x-4 mb-1.5">
                <motion.button 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <Shuffle className="h-4 w-4" />
                </motion.button>
                
                <motion.button 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <SkipBack className="h-5 w-5" />
                </motion.button>
                
                <motion.button 
                  className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlay}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={isPlaying ? "pause" : "play"}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
                
                <motion.button 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <SkipForward className="h-5 w-5" />
                </motion.button>
                
                <motion.button 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <Repeat className="h-4 w-4" />
                </motion.button>
              </div>
              
              {/* Progress bar (hidden when waveform is active) */}
              {!waveformReady && (
                <div className="w-full flex items-center space-x-2 text-xs">
                  <span className="text-muted-foreground w-8 text-right">{currentTime}</span>
                  <div className="flex-grow">
                    <Slider
                      value={[progress]} 
                      max={100}
                      step={1}
                      onValueChange={handleSeek}
                      className="w-full"
                    />
                  </div>
                  <span className="text-muted-foreground w-8">{currentTrack.duration}</span>
                </div>
              )}
            </div>
            
            {/* Additional controls */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-3">
                <motion.button 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare className="h-4 w-4" />
                </motion.button>
                
                <motion.button 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <Share className="h-4 w-4" />
                </motion.button>
                
                <motion.button 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </motion.button>
              </div>
              
              <div className="flex items-center space-x-2 ml-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    isLiked && "text-red-500 hover:text-red-600"
                  )}
                  onClick={toggleLike}
                >
                  <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
                </motion.button>
                
                <div className="hidden md:flex items-center space-x-2 w-24">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleMute}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </motion.button>
                  
                  <Slider
                    value={[isMuted ? 0 : volume]} 
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-16"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MusicPlayer;
