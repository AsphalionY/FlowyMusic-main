
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PianoProps {
  onNotePlay?: (note: string) => void;
  className?: string;
}

const Piano = ({ onNotePlay, className }: PianoProps) => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  
  const notes = [
    { note: 'C', key: 'A', octave: 4, isBlack: false },
    { note: 'C#', key: 'W', octave: 4, isBlack: true },
    { note: 'D', key: 'S', octave: 4, isBlack: false },
    { note: 'D#', key: 'E', octave: 4, isBlack: true },
    { note: 'E', key: 'D', octave: 4, isBlack: false },
    { note: 'F', key: 'F', octave: 4, isBlack: false },
    { note: 'F#', key: 'T', octave: 4, isBlack: true },
    { note: 'G', key: 'G', octave: 4, isBlack: false },
    { note: 'G#', key: 'Y', octave: 4, isBlack: true },
    { note: 'A', key: 'H', octave: 4, isBlack: false },
    { note: 'A#', key: 'U', octave: 4, isBlack: true },
    { note: 'B', key: 'J', octave: 4, isBlack: false },
    { note: 'C', key: 'K', octave: 5, isBlack: false },
  ];

  useEffect(() => {
    // Preload audio files
    notes.forEach(({ note, octave }) => {
      const audio = new Audio(`https://assets.mixkit.co/piano-notes/${note.replace('#', 'sharp')}${octave}.wav`);
      audio.preload = 'auto';
      audioRefs.current[`${note}${octave}`] = audio;
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

  const playNote = (note: string, octave: number) => {
    const noteId = `${note}${octave}`;
    const audio = audioRefs.current[noteId];
    
    if (audio) {
      audio.currentTime = 0;
      audio.play();
      if (onNotePlay) onNotePlay(noteId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const noteObj = notes.find(n => n.key === key);
    
    if (noteObj) {
      playNote(noteObj.note, noteObj.octave);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={cn("relative select-none", className)}>
      <div className="flex relative h-48">
        {notes.map(({ note, octave, isBlack, key }, index) => (
          <React.Fragment key={`${note}${octave}`}>
            {!isBlack && (
              <div 
                className="relative flex-1 bg-white border border-gray-300 rounded-b-md flex flex-col items-center justify-end pb-2 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
                onClick={() => playNote(note, octave)}
              >
                <span className="text-xs text-gray-400">{note}{octave}</span>
                <span className="text-[10px] text-gray-300 mt-1">({key})</span>
              </div>
            )}
          </React.Fragment>
        ))}
        {/* Overlay black keys */}
        <div className="absolute top-0 left-0 right-0 flex h-28">
          {notes.map(({ note, octave, isBlack, key }, index) => {
            if (!isBlack) return null;
            
            // Calculate position for black keys
            let leftOffset = `${index * (100 / (notes.length - 5)) - 1.8}%`;
            
            return (
              <div
                key={`${note}${octave}-black`}
                className="absolute w-[8%] h-full bg-gray-800 rounded-b-md flex flex-col items-center justify-end pb-2 cursor-pointer z-10 hover:bg-gray-700 active:bg-gray-900 border-x border-b border-gray-700"
                style={{ left: leftOffset }}
                onClick={() => playNote(note, octave)}
              >
                <span className="text-[10px] text-gray-400">{note}{octave}</span>
                <span className="text-[8px] text-gray-500 mt-1">({key})</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Piano;
