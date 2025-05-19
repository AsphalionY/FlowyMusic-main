import { AuthUser } from '../services/authService';

// Clu00e9 pour le stockage de l'utilisateur dans localStorage
const USER_STORAGE_KEY = 'flowymusic_user';

/**
 * Enregistrer un utilisateur connectu00e9 dans localStorage
 */
export const saveUserSession = (user: AuthUser): void => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

/**
 * Ru00e9cupu00e9rer l'utilisateur actuellement connectu00e9
 */
export const getCurrentUser = (): AuthUser | null => {
  const userData = localStorage.getItem(USER_STORAGE_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData) as AuthUser;
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration de la session utilisateur:', error);
    return null;
  }
};

/**
 * Vu00e9rifier si un utilisateur est connectu00e9
 */
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

/**
 * Du00e9connecter l'utilisateur
 */
export const logoutUser = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
};
