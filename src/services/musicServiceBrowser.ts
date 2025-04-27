import { MusicCategory } from '../types/music';
import { supabase } from '../config/supabase';
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
    id: track.track_id?.toString() || track.id?.toString() || '',
    title: track.title || '',
    artist: track.artist || track.username || '',
    uploadDate: track.created_at ? new Date(track.created_at) : new Date(),
    audioUrl: track.audio_url || '',
    coverArt: track.cover_art_url || '',
    duration: track.duration || '0:00',
    uploadedBy: track.artist_id?.toString() || track.user_id?.toString() || '',
    uploadedByName: track.artist || track.username || '',
    plays: track.plays || 0,
    category: track.category
  };
};

// Fonction pour convertir un SharedMusic en objet compatible avec la base de données
const sharedMusicToTrack = (music: Omit<SharedMusic, 'id' | 'plays' | 'uploadDate'>): Partial<Track> => {
  return {
    title: music.title,
    artist_id: parseInt(music.uploadedBy) || 0,
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
    
    // Utiliser Supabase au lieu de pg-promise
    const { data, error } = await supabase
      .from('tracks')
      .insert([
        {
          title: trackData.title,
          artist_id: trackData.artist_id,
          audio_url: trackData.audio_url,
          cover_art_url: trackData.cover_art_url,
          duration: trackData.duration,
          category: trackData.category,
          plays: trackData.plays || 0,
          is_remix: trackData.is_remix || false,
          original_track_id: trackData.original_track_id
        }
      ])
      .select('*, users!tracks_artist_id_fkey(username)')
      .single();
    
    if (error) {
      throw error;
    }
    
    // Adapter la réponse pour avoir le même format
    const track = {
      ...data,
      username: data.users?.username
    };
    
    return trackToSharedMusic(track);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la musique:', error);
    throw error;
  }
};

export const getAllSharedMusic = async (): Promise<SharedMusic[]> => {
  try {
    // Utiliser Supabase au lieu de pg-promise
    const { data, error } = await supabase
      .from('tracks')
      .select('*, users!tracks_artist_id_fkey(username)')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Adapter la réponse pour avoir le même format
    const tracks = data.map(track => ({
      ...track,
      username: track.users?.username
    }));
    
    return tracks.map(trackToSharedMusic);
  } catch (error) {
    console.error('Erreur lors de la récupération des musiques:', error);
    return [];
  }
};

export const getUserMusic = async (userId: string): Promise<SharedMusic[]> => {
  try {
    // Utiliser Supabase au lieu de pg-promise
    const { data, error } = await supabase
      .from('tracks')
      .select('*, users!tracks_artist_id_fkey(username)')
      .eq('artist_id', parseInt(userId))
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Adapter la réponse pour avoir le même format
    const tracks = data.map(track => ({
      ...track,
      username: track.users?.username
    }));
    
    return tracks.map(trackToSharedMusic);
  } catch (error) {
    console.error(`Erreur lors de la récupération des musiques de l'utilisateur ${userId}:`, error);
    return [];
  }
};

export const getMusicByCategory = async (category: MusicCategory): Promise<SharedMusic[]> => {
  try {
    // Utiliser Supabase au lieu de pg-promise
    const { data, error } = await supabase
      .from('tracks')
      .select('*, users!tracks_artist_id_fkey(username)')
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Adapter la réponse pour avoir le même format
    const tracks = data.map(track => ({
      ...track,
      username: track.users?.username
    }));
    
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
    
    // Utiliser Supabase au lieu de pg-promise (avec ILIKE pour la recherche case-insensitive)
    const { data, error } = await supabase
      .from('tracks')
      .select('*, users!tracks_artist_id_fkey(username)')
      .or(`title.ilike.${searchTerm},users.username.ilike.${searchTerm}`)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Adapter la réponse pour avoir le même format
    const tracks = data.map(track => ({
      ...track,
      username: track.users?.username
    }));
    
    return tracks.map(trackToSharedMusic);
  } catch (error) {
    console.error(`Erreur lors de la recherche de musiques avec la requête "${query}":`, error);
    return [];
  }
};

export const getSharedMusicById = async (id: string): Promise<SharedMusic | undefined> => {
  try {
    // Utiliser Supabase au lieu de pg-promise
    const { data, error } = await supabase
      .from('tracks')
      .select('*, users!tracks_artist_id_fkey(username)')
      .eq('track_id', parseInt(id))
      .single();
    
    if (error) {
      throw error;
    }
    
    // Adapter la réponse pour avoir le même format
    const track = {
      ...data,
      username: data.users?.username
    };
    
    return track ? trackToSharedMusic(track) : undefined;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la musique ${id}:`, error);
    return undefined;
  }
};

export const incrementPlayCount = async (id: string): Promise<void> => {
  try {
    // D'abord récupérer le nombre actuel de lectures
    const { data, error } = await supabase
      .from('tracks')
      .select('plays')
      .eq('track_id', parseInt(id))
      .single();
    
    if (error) {
      throw error;
    }
    
    // Ensuite mettre à jour avec le nouveau nombre
    const currentPlays = data?.plays || 0;
    const { error: updateError } = await supabase
      .from('tracks')
      .update({ plays: currentPlays + 1 })
      .eq('track_id', parseInt(id));
    
    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error(`Erreur lors de l'incrémentation du nombre de lectures pour la musique ${id}:`, error);
  }
};

// Fonctions côté client qui fonctionnent partout
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
};
