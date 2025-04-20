
export const cleanupAudioResources = (
  audioSourceRef: React.MutableRefObject<MediaStreamAudioSourceNode | null>,
  micStreamRef: React.MutableRefObject<MediaStream | null>,
  audioContextRef: React.MutableRefObject<AudioContext | null>
) => {
  // Arrêter toutes les pistes et déconnecter les nœuds audio
  if (audioSourceRef.current) {
    audioSourceRef.current.disconnect();
    audioSourceRef.current = null;
  }
  
  if (micStreamRef.current) {
    micStreamRef.current.getTracks().forEach(track => track.stop());
    micStreamRef.current = null;
  }
  
  if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
    audioContextRef.current.close();
    audioContextRef.current = null;
  }
};
