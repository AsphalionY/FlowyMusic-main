import { supabase } from '../config/supabase';
import { User, Track } from '../types/database';
// Playlist sera utilisé dans les futures implémentations

/**
 * Service pour l'adaptation des appels Supabase
 * Ce fichier sert d'interface entre l'ancienne logique PostgreSQL et la nouvelle logique Supabase
 */

// ===== USER SERVICES =====

/**
 * Cru00e9er un nouvel utilisateur
 */
export const createUser = async (userData: {
  username: string;
  email: string;
  password_hash: string;
  profile_image_url?: string | null;
  bio?: string | null;
}): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username: userData.username,
          email: userData.email,
          password_hash: userData.password_hash,
          profile_image_url: userData.profile_image_url,
          bio: userData.bio,
          created_at: new Date(),
          updated_at: new Date()
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data as User;
  } catch (error) {
    console.error('Erreur lors de la cru00e9ation de l\'utilisateur:', error);
    throw error;
  }
};

/**
 * Ru00e9cupu00e9rer un utilisateur par ID
 */
export const getUserById = async (userId: number): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    return data as User;
  } catch (error) {
    console.error(`Erreur lors de la ru00e9cupu00e9ration de l'utilisateur ${userId}:`, error);
    return null;
  }
};

/**
 * Ru00e9cupu00e9rer un utilisateur par email
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    return data as User;
  } catch (error) {
    console.error(`Erreur lors de la ru00e9cupu00e9ration de l'utilisateur avec l'email ${email}:`, error);
    return null;
  }
};

// ===== MUSIC SERVICES =====

/**
 * Ru00e9cupu00e9rer toutes les pistes partagées publiquement
 */
export const getAllSharedMusic = async (): Promise<Track[]> => {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Track[];
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration des pistes partagées:', error);
    return [];
  }
};

/**
 * Rechercher de la musique par titre, artiste ou catégorie
 */
export const searchMusic = async (query: string): Promise<Track[]> => {
  if (!query.trim()) return [];
  
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .or(`title.ilike.%${query}%,artist.ilike.%${query}%,category.ilike.%${query}%`)
      .eq('is_public', true)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Track[];
  } catch (error) {
    console.error('Erreur lors de la recherche de musique:', error);
    return [];
  }
};

/**
 * Incru00e9menter le compteur d'u00e9coutes d'une piste
 */
export const incrementPlayCount = async (trackId: string): Promise<void> => {
  try {
    // D'abord, ru00e9cupu00e9rer le nombre actuel d'u00e9coutes
    const { data, error } = await supabase
      .from('tracks')
      .select('plays')
      .eq('track_id', trackId)
      .single();
      
    if (error) throw error;
    
    // Ensuite, mettez u00e0 jour avec le nouveau nombre
    const newPlayCount = (data?.plays || 0) + 1;
    
    const { error: updateError } = await supabase
      .from('tracks')
      .update({ plays: newPlayCount })
      .eq('track_id', trackId);
      
    if (updateError) throw updateError;
  } catch (error) {
    console.error(`Erreur lors de l'incru00e9mentation du compteur d'u00e9coutes pour la piste ${trackId}:`, error);
  }
};
