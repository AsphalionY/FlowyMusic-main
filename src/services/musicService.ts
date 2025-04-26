import { MusicCategory } from '../types/music';
import { db } from '../config/database';
import { Track } from '../types/database';

// Interface pour maintenir la compatibilité avec le code existant
export interface SharedMusic {
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

// Fonction pour convertir un Track de la base de données en SharedMusic
const trackToSharedMusic = (track: any): SharedMusic => {
  return {
    id: track.track_id.toString(),
    title: track.title,
    artist: track.artist || track.username || '',
    uploadDate: track.created_at,
    audioUrl: track.audio_url,
    coverArt: track.cover_art_url,
    duration: track.duration,
    uploadedBy: track.artist_id.toString(),
    uploadedByName: track.artist || track.username || '',
    plays: track.plays,
    category: track.category
  };
};

// Fonction pour convertir un SharedMusic en objet compatible avec la base de données
const sharedMusicToTrack = (music: Omit<SharedMusic, 'id' | 'plays' | 'uploadDate'>): Partial<Track> => {
  return {
    title: music.title,
    artist_id: parseInt(music.uploadedBy),
    audio_url: music.audioUrl,
    cover_art_url: music.coverArt,
    duration: music.duration,
    category: music.category,
    plays: 0,
    is_remix: false,
    original_track_id: undefined
  };
};

export const addSharedMusic = async (music: Omit<SharedMusic, 'id' | 'plays' | 'uploadDate'>): Promise<SharedMusic> => {
  try {
    const trackData = sharedMusicToTrack(music);
    
    const newTrack = await db.one(`
      INSERT INTO tracks 
      (title, artist_id, audio_url, cover_art_url, duration, category, plays, is_remix, original_track_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      trackData.title,
      trackData.artist_id,
      trackData.audio_url,
      trackData.cover_art_url,
      trackData.duration,
      trackData.category,
      trackData.plays || 0,
      trackData.is_remix || false,
      trackData.original_track_id
    ]);
    
    // Récupérer les informations de l'artiste
    const trackWithArtist = await db.one(`
      SELECT t.*, u.username
      FROM tracks t
      JOIN users u ON t.artist_id = u.user_id
      WHERE t.track_id = $1
    `, [newTrack.track_id]);
    
    return trackToSharedMusic(trackWithArtist);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la musique:', error);
    throw error;
  }
};

export const getAllSharedMusic = async (): Promise<SharedMusic[]> => {
  try {
    const tracks = await db.any(`
      SELECT t.*, u.username
      FROM tracks t
      JOIN users u ON t.artist_id = u.user_id
      ORDER BY t.created_at DESC
    `);
    
    return tracks.map(trackToSharedMusic);
  } catch (error) {
    console.error('Erreur lors de la récupération des musiques:', error);
    return [];
  }
};

export const getUserMusic = async (userId: string): Promise<SharedMusic[]> => {
  try {
    const tracks = await db.any(`
      SELECT t.*, u.username
      FROM tracks t
      JOIN users u ON t.artist_id = u.user_id
      WHERE t.artist_id = $1
      ORDER BY t.created_at DESC
    `, [parseInt(userId)]);
    
    return tracks.map(trackToSharedMusic);
  } catch (error) {
    console.error(`Erreur lors de la récupération des musiques de l'utilisateur ${userId}:`, error);
    return [];
  }
};

export const getMusicByCategory = async (category: MusicCategory): Promise<SharedMusic[]> => {
  try {
    const tracks = await db.any(`
      SELECT t.*, u.username
      FROM tracks t
      JOIN users u ON t.artist_id = u.user_id
      WHERE t.category = $1
      ORDER BY t.created_at DESC
    `, [category]);
    
    return tracks.map(trackToSharedMusic);
  } catch (error) {
    console.error(`Erreur lors de la récupération des musiques de catégorie ${category}:`, error);
    return [];
  }
};

export const searchMusic = async (query: string): Promise<SharedMusic[]> => {
  if (!query.trim()) return [];

  try {
    const searchTerm = `%${query.toLowerCase()}%`;
    const tracks = await db.any(`
      SELECT t.*, u.username
      FROM tracks t
      JOIN users u ON t.artist_id = u.user_id
      WHERE 
        LOWER(t.title) LIKE $1 OR
        LOWER(u.username) LIKE $1
      ORDER BY t.created_at DESC
    `, [searchTerm]);
    
    return tracks.map(trackToSharedMusic);
  } catch (error) {
    console.error(`Erreur lors de la recherche de musiques avec la requête "${query}":`, error);
    return [];
  }
};

export const getSharedMusicById = async (id: string): Promise<SharedMusic | undefined> => {
  try {
    const track = await db.oneOrNone(`
      SELECT t.*, u.username
      FROM tracks t
      JOIN users u ON t.artist_id = u.user_id
      WHERE t.track_id = $1
    `, [parseInt(id)]);
    
    return track ? trackToSharedMusic(track) : undefined;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la musique ${id}:`, error);
    return undefined;
  }
};

export const incrementPlayCount = async (id: string): Promise<void> => {
  try {
    await db.none(`
      UPDATE tracks
      SET plays = plays + 1
      WHERE track_id = $1
    `, [parseInt(id)]);
  } catch (error) {
    console.error(`Erreur lors de l'incrémentation du nombre de lectures pour la musique ${id}:`, error);
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

// L'interface SharedMusic est déjà exportée au début du fichier
