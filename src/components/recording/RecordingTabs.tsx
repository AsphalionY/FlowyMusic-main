
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Mic, Music } from 'lucide-react';
import RecorderPanel from './RecorderPanel';
import MusicImporter from '../instruments/MusicImporter';
import { Button } from '@/components/ui/button';

interface RecordingTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isRecording: boolean;
  isPaused: boolean;
  micPermissionError: boolean;
  isInitializing?: boolean;
  recordingTime: number;
  formatTime: (seconds: number) => string;
  startRecording: () => void;
  pauseRecording: () => void;
  stopRecording: () => void;
  onMusicImported: (audioBlob: Blob, fileName: string) => void;
}

const RecordingTabs = ({
  activeTab,
  setActiveTab,
  isRecording,
  isPaused,
  micPermissionError,
  isInitializing = false,
  recordingTime,
  formatTime,
  startRecording,
  pauseRecording,
  stopRecording,
  onMusicImported
}: RecordingTabsProps) => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="px-4 pt-3 flex justify-center gap-2">
        <Button 
          variant={activeTab === "recorder" ? "default" : "outline"}
          onClick={() => setActiveTab("recorder")}
          className="gap-2"
        >
          <Mic className="h-4 w-4" />
          Enregistreur
        </Button>
        <Button 
          variant={activeTab === "import" ? "default" : "outline"}
          onClick={() => setActiveTab("import")}
          className="gap-2"
        >
          <Music className="h-4 w-4" />
          Importer
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "recorder" && (
          <RecorderPanel
            isRecording={isRecording}
            isPaused={isPaused}
            micPermissionError={micPermissionError}
            isInitializing={isInitializing}
            recordingTime={recordingTime}
            formatTime={formatTime}
            startRecording={startRecording}
            pauseRecording={pauseRecording}
            stopRecording={stopRecording}
          />
        )}
        
        {activeTab === "import" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col"
          >
            <MusicImporter onMusicImported={onMusicImported} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecordingTabs;
