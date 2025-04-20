
interface Window {
  musicPlayer?: {
    play: () => void;
    pause: () => void;
    playTrack: (track: { 
      id: string;
      title: string;
      artist: string;
      duration: string;
      coverArt: string;
    }) => void;
    toggleLike: () => void;
  };
}
