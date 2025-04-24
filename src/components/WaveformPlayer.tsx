import React, { useRef, useEffect, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { cn } from '@/lib/utils';

interface WaveformPlayerProps {
  audioUrl: string | undefined;
  playing: boolean;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onFinish?: () => void;
  onSeek?: (progress: number) => void;
  height?: number;
  waveColor?: string;
  progressColor?: string;
  className?: string;
  hideControls?: boolean;
}

const WaveformPlayer: React.FC<WaveformPlayerProps> = ({
  audioUrl,
  waveColor = 'rgba(255, 255, 255, 0.3)',
  progressColor = 'rgba(255, 255, 255, 0.8)',
  height = 60,
  className,
  onSeek,
  hideControls = false,
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // Gérer le survol de la forme d'onde
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // Création et configuration de WaveSurfer
  useEffect(() => {
    if (waveformRef.current && audioUrl) {
      setLoading(true);

      // Nettoyage de l'instance précédente
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }

      // Configuration haute qualité pour WaveSurfer
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: waveColor,
        progressColor: progressColor,
        height: height,
        cursorWidth: hideControls ? 0 : (isHovering ? 2 : 0),
        cursorColor: 'rgba(168, 85, 247, 0.8)', // Curseur violet (primary color)
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        normalize: true,
        fillParent: true,
        // Options audio haute qualité
        backend: 'WebAudio',
        autoCenter: true,
        sampleRate: 44100, // 44.1 kHz (qualité CD)
        minPxPerSec: 50, // Meilleure résolution d'affichage
        hideScrollbar: true, // Cacher la barre de défilement
        interact: true, // Permettre l'interaction avec la forme d'onde
      });

      wavesurfer.current = ws;

      // Créer un élément audio séparé avec le contrôle muet activé
      const audioElement = document.createElement('audio');
      audioElement.controls = false;
      audioElement.muted = true; // Crucial pour éviter l'écho
      audioElement.src = audioUrl;

      ws.on('ready', () => {
        setLoading(false);
        // Une fois le waveform chargé, régler le volume à 0 pour éviter l'écho
        if (wavesurfer.current) {
          wavesurfer.current.setVolume(0);
        }
      });

      ws.on('play', () => {
      });

      ws.on('pause', () => {
      });

      ws.on('finish', () => {
      });

      ws.on('seeking', () => {
        if (onSeek) onSeek(ws.getCurrentTime() / ws.getDuration());
      });

      // Activer l'interaction avec la forme d'onde
      ws.on('click', () => {
        if (onSeek) onSeek(ws.getCurrentTime() / ws.getDuration());
      });

      // Chargement de l'audio
      ws.load(audioUrl);
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [audioUrl, hideControls, isHovering]);

  // Contrôle de la lecture/pause en mode silencieux pour la visualisation uniquement
  useEffect(() => {
    if (wavesurfer.current) {
    }
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div 
        ref={waveformRef} 
        className="w-full"
        style={{ cursor: isHovering ? 'pointer' : 'default' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label="Contrôle de la forme d'onde audio"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (wavesurfer.current && onSeek) {
              onSeek(wavesurfer.current.getCurrentTime() / wavesurfer.current.getDuration());
            }
          }
        }}
      ></div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-xs text-white/60">Chargement...</div>
        </div>
      )}
    </div>
  );
};

export default WaveformPlayer;
