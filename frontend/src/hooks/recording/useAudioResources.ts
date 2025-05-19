import { useRef, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Extend Window interface to include webkitAudioContext for older browsers
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export const useAudioResources = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const [permissionState] = useState<PermissionState | null>(null);

  useEffect(() => {
    return () => {
      cleanupAudioResources();
    };
  }, []);

  const initializeAudioContext = () => {
    try {
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
      } else if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      return audioContextRef.current;
    } catch (error) {
      console.error("Erreur lors de l'initialisation de l'AudioContext:", error);
      throw error;
    }
  };

  const requestMicrophoneAccess = async () => {
    const constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    };

    try {
      await cleanupAudioResources();

      const micStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (micStream.getAudioTracks().length === 0) {
        throw new Error('Aucune piste audio détectée dans le flux du microphone');
      }

      micStreamRef.current = micStream;

      const audioContext = initializeAudioContext();

      const micSource = audioContext.createMediaStreamSource(micStream);
      audioSourceRef.current = micSource;

      return { micStream, audioContext, micSource };
    } catch (error) {
      console.error("Erreur lors de l'accès au microphone:", error);

      if (
        error instanceof DOMException &&
        (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')
      ) {
        toast.error('Accès au microphone refusé', {
          description:
            "Veuillez autoriser l'accès au microphone dans les paramètres de votre navigateur.",
          duration: 5000,
        });
      } else {
        toast.error('Erreur de microphone', {
          description:
            "Impossible d'accéder au microphone. Vérifiez qu'il est bien connecté et fonctionnel.",
          duration: 5000,
        });
      }

      throw error;
    }
  };

  const cleanupAudioResources = async () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.disconnect();
      } catch (e) {
        console.warn('Erreur lors de la déconnexion de la source audio:', e);
      }
      audioSourceRef.current = null;
    }

    if (micStreamRef.current) {
      const tracks = micStreamRef.current.getTracks();

      tracks.forEach(track => {
        track.stop();
      });

      micStreamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        await audioContextRef.current.close();
      } catch (err) {
        console.error('Erreur lors de la fermeture du contexte audio:', err);
      }
      audioContextRef.current = null;
    }

    return new Promise(resolve => setTimeout(resolve, 300));
  };

  return {
    audioContextRef,
    micStreamRef,
    audioSourceRef,
    permissionState,
    requestMicrophoneAccess,
    cleanupAudioResources,
    initializeAudioContext,
  };
};
