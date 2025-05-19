import { getUserByEmail } from './userService';
import { User } from '../types/database';

// Type pour les informations d'authentification
export interface AuthCredentials {
  email: string;
  password: string;
}

// Type pour les informations de l'utilisateur connectu00e9
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  profile_image_url: string | null;
  bio: string | null;
}

/**
 * Authentifier un utilisateur avec email et mot de passe
 */
export const authenticateUser = async (
  credentials: AuthCredentials
): Promise<AuthUser | null> => {
  try {
    const { email, password } = credentials;
    
    // Ru00e9cupu00e9rer l'utilisateur par email
    const user = await getUserByEmail(email);
    
    // Si l'utilisateur n'existe pas, retourner null
    if (!user) {
      console.log(`Tentative de connexion avec un email inexistant: ${email}`);
      return null;
    }
    
    // Pour des tests rapides, accepter le mot de passe 'hashed_password' directement
    // Ceci est temporaire et ne doit pas u00eatre utilisu00e9 en production
    if (user.password_hash === 'hashed_password' && password === 'testpassword') {
      return transformUserToAuthUser(user);
    }
    
    // Pour un vrai mot de passe hashu00e9, on utiliserait bcrypt.compare
    // Mais pour simplifier le du00e9veloppement, nous utilisons une comparaison simple
    // ATTENTION: Cette approche n'est PAS su00e9curisu00e9e pour la production
    if (password === 'testpassword' || password === user.password_hash) {
      return transformUserToAuthUser(user);
    } else {
      console.log(`Mot de passe incorrect pour l'utilisateur: ${email}`);
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    return null;
  }
};

/**
 * Transformer un objet User de la DB en AuthUser pour l'authentification
 */
const transformUserToAuthUser = (user: User): AuthUser => {
  return {
    id: user.user_id,
    username: user.username,
    email: user.email,
    profile_image_url: user.profile_image_url || null,
    bio: user.bio || null
  };
};

/**
 * Hasher un mot de passe
 * Note: Cette fonction est un stub pour simuler le hachage
 * En production, utilisez bcrypt ou argon2
 */
export const hashPassword = async (password: string): Promise<string> => {
  console.warn('ATTENTION: Utilisation d\'une version non su00e9curisu00e9e de hashPassword');
  // Simplement ajouter un pru00e9fixe pour indiquer que c'est un mot de passe hashu00e9
  return `hashed_${password}`;
};
