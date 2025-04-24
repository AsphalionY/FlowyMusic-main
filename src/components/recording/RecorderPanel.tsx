import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import RecordButton from './RecordButton';
import RecordingInfo from './RecordingInfo';
import RecordingVisualizer from './RecordingVisualizer';

interface RecorderPanelProps {
  isRecording: boolean;
  isPaused: boolean;
  isInitializing?: boolean;
  recordingTime: number;
  formatTime: (seconds: number) => string;
  startRecording: () => void;
  pauseRecording: () => void;
  stopRecording: () => void;
}

const RecorderPanel = ({
  isRecording,
  isPaused,
  isInitializing = false,
  recordingTime,
  formatTime,
  startRecording,
  pauseRecording,
  stopRecording
}: RecorderPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        {isRecording ? (
          <div className="flex flex-col items-center w-full">
            <RecordingInfo 
              isRecording={isRecording} 
              isPaused={isPaused} 
              recordingTime={recordingTime} 
              formatTime={formatTime} 
            />
            
            <RecordingVisualizer isPlaying={isRecording} isPaused={isPaused} />
            
            <RecordButton
              isRecording={isRecording}
              isPaused={isPaused}
              isInitializing={isInitializing}
              startRecording={startRecording}
              pauseRecording={pauseRecording}
              stopRecording={stopRecording}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full flex items-center justify-center mb-6 bg-primary/10">
              <Mic className="h-10 w-10 text-primary" />
            </div>
            
            <p className="text-center text-sm text-muted-foreground mb-6 max-w-sm">
              Appuyez sur le bouton ci-dessous pour commencer à enregistrer
            </p>
            
            <RecordButton
              isRecording={isRecording}
              isPaused={isPaused}
              isInitializing={isInitializing}
              startRecording={startRecording}
              pauseRecording={pauseRecording}
              stopRecording={stopRecording}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecorderPanel;
