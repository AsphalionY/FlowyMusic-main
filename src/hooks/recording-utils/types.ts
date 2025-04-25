export interface MusicTrackType {
  id: string;
  name: string;
  audioBlob: Blob;
  type: 'recording' | 'imported' | 'instrument';
  color?: string;
}

export interface UseRecorderOptions {
  onTrackAdded: (track: MusicTrackType) => void;
}
