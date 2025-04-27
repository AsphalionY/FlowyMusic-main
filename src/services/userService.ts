// Import Supabase au lieu de pg-promise
import { supabase } from '../config/supabase';
import { User } from '../types/database';

export const createUser = async (userData: {
  username: string;
  email: string;
  password_hash: string;
  profile_image_url?: string;
  bio?: string;
}): Promise<User> => {
  try {
    // Utiliser Supabase insert plutôt que pg-promise
    const { data, error } = await supabase
      .from('users')
      .insert({
        username: userData.username,
        email: userData.email,
        password_hash: userData.password_hash,
        profile_image_url: userData.profile_image_url,
        bio: userData.bio
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as User;
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    throw error;
  }
};

export const getUserById = async (userId: number): Promise<User | null> => {
  try {
    // Utiliser Supabase select avec filtres
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as User;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, error);
    return null;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    // Utiliser Supabase select avec filtres sur email
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as User;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur avec l'email ${email}:`, error);
    return null;
  }
};

export const updateUser = async (
  userId: number,
  userData: Partial<Omit<User, 'user_id' | 'created_at' | 'updated_at'>>
): Promise<User | null> => {
  try {
    // Filtrer les champs non définis
    const updateData: Record<string, any> = {};
    
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateData[key] = value;
      }
    });
    
    // Si aucun champ à mettre à jour, retourner l'utilisateur actuel
    if (Object.keys(updateData).length === 0) {
      return getUserById(userId);
    }
    
    // Ajouter updated_at
    updateData.updated_at = new Date().toISOString();
    
    // Utiliser Supabase update
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as User;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'utilisateur ${userId}:`, error);
    return null;
  }
};

export const deleteUser = async (userId: number): Promise<boolean> => {
  try {
    // Utiliser Supabase delete
    const { error, count } = await supabase
      .from('users')
      .delete()
      .eq('user_id', userId)
      .select('count');
    
    if (error) {
      throw error;
    }
    
    return count !== null && count > 0;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'utilisateur ${userId}:`, error);
    return false;
  }
};
