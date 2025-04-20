
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecordButtonProps {
  isRecording: boolean;
  isPaused: boolean;
  micPermissionError: boolean;
  isInitializing?: boolean;
  startRecording: () => void;
  pauseRecording: () => void;
  stopRecording: () => void;
}

const RecordButton = ({ 
  isRecording,
  isPaused,
  micPermissionError,
  isInitializing = false,
  startRecording,
  pauseRecording,
  stopRecording
}: RecordButtonProps) => {
  if (isInitializing) {
    return (
      <Button
        disabled
        className="rounded-full h-14 w-14 flex items-center justify-center p-0 bg-amber-500"
      >
        <Loader2 className="h-6 w-6 animate-spin" />
      </Button>
    );
  }
  
  if (isRecording) {
    return (
      <div className="flex items-center gap-3">
        <Button
          onClick={pauseRecording}
          variant="outline"
          className="rounded-full h-12 w-12 flex items-center justify-center p-0"
        >
          {isPaused ? <Play className="h-5 w-5 ml-0.5" /> : <Square className="h-4 w-4" />}
        </Button>
        
        <Button
          onClick={stopRecording}
          className="rounded-full h-14 w-14 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600"
        >
          <Square className="h-5 w-5" />
        </Button>
      </div>
    );
  }
  
  return (
    <Button
      onClick={startRecording}
      className="rounded-full h-14 w-14 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600"
    >
      <Mic className="h-6 w-6" />
    </Button>
  );
};

export default RecordButton;
