import { MusicCategory } from '../types/music';

interface SharedMusic {
  id: string;
  title: string;
  artist: string;
  uploadDate: Date;
  audioUrl: string;
  coverArt?: string;
  duration: string;
  uploadedBy: string;
  uploadedByName: string;
  plays: number;
  category?: MusicCategory;
}

let sharedMusicCollection: SharedMusic[] = [];

const initializeFromStorage = () => {
  try {
    const storedMusic = localStorage.getItem('shared-music');
    if (storedMusic) {
      const parsedMusic = JSON.parse(storedMusic);
      sharedMusicCollection = parsedMusic.map(
        (item: Omit<SharedMusic, 'uploadDate'> & { uploadDate: string }) => ({
          ...item,
          uploadDate: new Date(item.uploadDate),
        })
      );
    }
  } catch (error) {
    console.error('Erreur lors du chargement des musiques:', error);
  }
};

initializeFromStorage();

const saveToStorage = () => {
  try {
    localStorage.setItem('shared-music', JSON.stringify(sharedMusicCollection));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des musiques:', error);
  }
};

export const addSharedMusic = (music: Omit<SharedMusic, 'id' | 'plays' | 'uploadDate'>) => {
  const newMusic: SharedMusic = {
    ...music,
    id: crypto.randomUUID(),
    uploadDate: new Date(),
    plays: 0,
  };

  sharedMusicCollection = [newMusic, ...sharedMusicCollection];
  saveToStorage();
  return newMusic;
};

export const getAllSharedMusic = (): SharedMusic[] => {
  return [...sharedMusicCollection];
};

export const getUserMusic = (userId: string): SharedMusic[] => {
  return sharedMusicCollection.filter(music => music.uploadedBy === userId);
};

export const getMusicByCategory = (category: MusicCategory): SharedMusic[] => {
  return sharedMusicCollection.filter(music => music.category === category);
};

export const searchMusic = (query: string): SharedMusic[] => {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase().trim();
  return sharedMusicCollection.filter(
    music =>
      music.title.toLowerCase().includes(searchTerm) ||
      music.artist.toLowerCase().includes(searchTerm) ||
      music.uploadedByName.toLowerCase().includes(searchTerm)
  );
};

export const getSharedMusicById = (id: string): SharedMusic | undefined => {
  return sharedMusicCollection.find(music => music.id === id);
};

export const incrementPlayCount = (id: string): void => {
  const musicIndex = sharedMusicCollection.findIndex(music => music.id === id);
  if (musicIndex !== -1) {
    sharedMusicCollection[musicIndex].plays += 1;
    saveToStorage();
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error =>
      reject(new Error('Erreur lors de la lecture du fichier : ' + error.toString()));
  });
};

export const calculateAudioDuration = (audioFile: File): Promise<string> => {
  return new Promise(resolve => {
    const audioElement = new Audio();
    const objectUrl = URL.createObjectURL(audioFile);

    audioElement.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(objectUrl);
      const duration = audioElement.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    });

    audioElement.addEventListener('error', () => {
      URL.revokeObjectURL(objectUrl);
      resolve('0:00');
    });

    audioElement.src = objectUrl;
  });
};

interface MusicError extends Error {
  code?: string;
  status?: number;
}

export const handleMusicError = (error: MusicError): void => {
  console.error('Music service error:', error);
  // ... existing code ...
};

export type { SharedMusic };
