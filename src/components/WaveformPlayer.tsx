
import React, { useRef, useEffect, useState } from 'react';
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
}

const WaveformPlayer = ({
  audioUrl,
  playing,
  onReady,
  onPlay,
  onPause,
  onFinish,
  onSeek,
  height = 40,
  waveColor = 'rgba(255, 255, 255, 0.3)',
  progressColor = 'rgba(255, 255, 255, 0.8)',
  className
}: WaveformPlayerProps) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [loading, setLoading] = useState(false);
  
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
        cursorWidth: 1,
        cursorColor: 'rgba(255, 255, 255, 0.5)',
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
        if (onReady) onReady();
      });
      
      ws.on('play', () => {
        if (onPlay) onPlay();
      });
      
      ws.on('pause', () => {
        if (onPause) onPause();
      });
      
      ws.on('finish', () => {
        if (onFinish) onFinish();
      });
      
      ws.on('seeking', () => {
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
  }, [audioUrl]);
  
  // Contrôle de la lecture/pause en mode silencieux pour la visualisation uniquement
  useEffect(() => {
    if (wavesurfer.current) {
      if (playing) {
        wavesurfer.current.play();
      } else {
        wavesurfer.current.pause();
      }
    }
  }, [playing]);
  
  return (
    <div className={cn("relative", className)}>
      <div ref={waveformRef} className="w-full"></div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-xs text-white/60">Chargement...</div>
        </div>
      )}
    </div>
  );
};

export default WaveformPlayer;
