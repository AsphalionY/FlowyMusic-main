
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DrumPadProps {
  onDrumPlay?: (sound: string) => void;
  className?: string;
}

const DrumPad = ({ onDrumPlay, className }: DrumPadProps) => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  const drumSounds = [
    { name: 'Kick', key: 'Z', color: 'bg-red-500' },
    { name: 'Snare', key: 'X', color: 'bg-blue-500' },
    { name: 'Hi-Hat', key: 'C', color: 'bg-green-500' },
    { name: 'Clap', key: 'V', color: 'bg-yellow-500' },
    { name: 'Rim', key: 'B', color: 'bg-purple-500' },
    { name: 'Tom', key: 'N', color: 'bg-indigo-500' },
    { name: 'Crash', key: 'M', color: 'bg-pink-500' },
    { name: 'Ride', key: ',', color: 'bg-orange-500' },
  ];

  useEffect(() => {
    // Preload audio files with sample URLs (replace with actual drum samples)
    const sampleURLs: Record<string, string> = {
      'Kick': 'https://assets.mixkit.co/sfx/preview/mixkit-drum-bass-hit-2294.mp3',
      'Snare': 'https://assets.mixkit.co/sfx/preview/mixkit-snare-drum-single-hit-2264.mp3',
      'Hi-Hat': 'https://assets.mixkit.co/sfx/preview/mixkit-hi-hat-single-hit-2252.mp3',
      'Clap': 'https://assets.mixkit.co/sfx/preview/mixkit-hand-clap-with-delay-591.mp3',
      'Rim': 'https://assets.mixkit.co/sfx/preview/mixkit-drum-hit-with-echo-549.mp3',
      'Tom': 'https://assets.mixkit.co/sfx/preview/mixkit-tribal-dry-drum-558.mp3',
      'Crash': 'https://assets.mixkit.co/sfx/preview/mixkit-crash-drum-sound-583.mp3',
      'Ride': 'https://assets.mixkit.co/sfx/preview/mixkit-tribal-drum-loop-539.mp3',
    };

    drumSounds.forEach(({ name }) => {
      const audio = new Audio(sampleURLs[name]);
      audio.preload = 'auto';
      audioRefs.current[name] = audio;
    });

    // Cleanup function
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  const playSound = (name: string) => {
    const audio = audioRefs.current[name];
    
    if (audio) {
      audio.currentTime = 0;
      audio.play();
      if (onDrumPlay) onDrumPlay(name);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const drumSound = drumSounds.find(sound => sound.key.toUpperCase() === key);
    
    if (drumSound) {
      playSound(drumSound.name);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={cn("select-none", className)}>
      <div className="grid grid-cols-4 gap-3">
        {drumSounds.map(({ name, key, color }) => (
          <Button
            key={name}
            variant="outline"
            className={cn(
              "h-20 relative overflow-hidden group",
              "border-2 border-white/20 hover:border-white/40", 
              "transition-all duration-200",
              "flex flex-col items-center justify-center",
              "active:scale-95"
            )}
            onClick={() => playSound(name)}
          >
            <div className={cn("absolute inset-0 opacity-75 group-hover:opacity-90 group-active:opacity-100", color)}></div>
            <span className="font-bold text-white z-10 text-lg">{name}</span>
            <span className="text-white/70 z-10 text-xs mt-1">({key})</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DrumPad;
