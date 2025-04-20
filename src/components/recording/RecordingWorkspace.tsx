
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import TracksList from './TracksList';
import RecordingTabs from './RecordingTabs';
import { MusicTrackType } from '@/hooks/recording/useRecorder';

interface RecordingWorkspaceProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  musicTracks: MusicTrackType[];
  handleRemoveTrack: (id: string) => void;
  handleRenameTrack: (id: string, newName: string) => void;
  clearProject: () => void;
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

const RecordingWorkspace = ({
  activeTab,
  setActiveTab,
  musicTracks,
  handleRemoveTrack,
  handleRenameTrack,
  clearProject,
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
}: RecordingWorkspaceProps) => {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[600px] rounded-lg border neo-morphism"
    >
      <ResizablePanel defaultSize={30} minSize={20}>
        <TracksList 
          musicTracks={musicTracks}
          handleRemoveTrack={handleRemoveTrack}
          handleRenameTrack={handleRenameTrack}
          clearProject={clearProject}
        />
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={70}>
        <div className="h-full flex flex-col overflow-hidden bg-background/40 backdrop-blur-sm">
          <RecordingTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isRecording={isRecording}
            isPaused={isPaused}
            micPermissionError={micPermissionError}
            isInitializing={isInitializing}
            recordingTime={recordingTime}
            formatTime={formatTime}
            startRecording={startRecording}
            pauseRecording={pauseRecording}
            stopRecording={stopRecording}
            onMusicImported={onMusicImported}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default RecordingWorkspace;
