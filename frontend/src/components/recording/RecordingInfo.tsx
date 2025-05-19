
import { cn } from '@/lib/utils';

interface RecordingInfoProps {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  formatTime: (seconds: number) => string;
}

const RecordingInfo = ({
  isRecording,
  isPaused,
  recordingTime,
  formatTime,
}: RecordingInfoProps) => {
  if (!isRecording) return null;

  return (
    <div className="flex items-center justify-center gap-2 w-full mb-8">
      <div className="px-3 py-1.5 rounded-full bg-red-100 text-red-600 font-medium text-sm flex items-center gap-2">
        <span
          className={cn(
            'h-2 w-2 rounded-full bg-red-600',
            isPaused ? 'opacity-50' : 'animate-pulse'
          )}
        ></span>
        {isPaused ? 'En pause' : 'Enregistrement en cours'}
      </div>

      <div className="bg-secondary/50 px-3 py-1.5 rounded-full text-sm font-medium">
        {formatTime(recordingTime)}
      </div>
    </div>
  );
};

export default RecordingInfo;
