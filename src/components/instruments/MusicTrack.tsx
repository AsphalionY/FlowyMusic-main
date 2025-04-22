import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, XCircle, AudioWaveform, Volume2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import WaveformPlayer from '../WaveformPlayer';

interface MusicTrackProps {
  track: {
    id: string;
    name: string;
    audioBlob: Blob;
    type: 'recording' | 'imported' | 'instrument';
    color?: string;
  };
  onRemove?: (id: string) => void;
  onRename?: (id: string, name: string) => void;
  className?: string;
}

const MusicTrack = ({ track, onRemove, onRename, className }: MusicTrackProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isEditing, setIsEditing] = useState(false);
  const [trackName, setTrackName] = useState(track.name);
  const [waveformReady, setWaveformReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioUrl = useRef<string>(URL.createObjectURL(track.audioBlob));
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
    }
  }, []);
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const getRemainingTime = () => {
    const remaining = duration - currentTime;
    return `-${formatTime(remaining)}`;
  };
  
  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };
  
  const handleRemove = () => {
    if (onRemove) {
      onRemove(track.id);
    }
  };
  
  const handleRename = () => {
    if (onRename && trackName.trim()) {
      onRename(track.id, trackName);
      setIsEditing(false);
    }
  };
  
  const getBgColor = () => {
    if (track.color) return track.color;
    
    switch (track.type) {
      case 'recording':
        return 'bg-accent/10';
      case 'imported':
        return 'bg-primary/10';
      case 'instrument':
        return 'bg-indigo-500/10';
      default:
        return 'bg-secondary/10';
    }
  };

  const handleWaveformReady = () => {
    setWaveformReady(true);
  };

  const handleWaveformSeek = (progress: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = progress * audioRef.current.duration;
    }
  };

  const handleTrackFinish = () => {
    setIsPlaying(false);
  };
  
  return (
    <div className={cn(
      "rounded-lg p-3 flex flex-col gap-2", 
      getBgColor(),
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-black/10">
          <AudioWaveform className="h-5 w-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
                className="text-sm bg-black/10 rounded px-2 py-1 text-white focus:outline-none flex-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
              />
              <Button variant="ghost" size="sm" onClick={handleRename} className="h-7 text-xs text-white/80">
                Enregistrer
              </Button>
            </div>
          ) : (
            <div className="truncate text-sm font-medium">
              {track.name}
            </div>
          )}
          <div className="text-xs opacity-60 truncate">
            {track.type === 'recording' ? 'Enregistrement' : 
            track.type === 'imported' ? 'Importé' : 'Instrument'}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <span className="text-xs text-white/60 mr-2">{getRemainingTime()}</span>
          <div className="flex items-center gap-1 pr-1">
            <Volume2 className="h-3 w-3 text-white/60" />
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-16"
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-white/80 hover:text-white"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
            onClick={handlePlay}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-white/80 hover:text-red-400"
            onClick={handleRemove}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="px-2">
        <WaveformPlayer 
          audioUrl={audioUrl.current}
          playing={isPlaying}
          onReady={handleWaveformReady}
          onFinish={handleTrackFinish}
          onSeek={handleWaveformSeek}
          height={30}
          waveColor="rgba(255, 255, 255, 0.3)"
          progressColor="rgba(255, 255, 255, 0.7)"
        />
      </div>
      
      <audio
        ref={audioRef}
        src={audioUrl.current}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      >
        <track kind="captions" />
      </audio>
    </div>
  );
};

export default MusicTrack;
