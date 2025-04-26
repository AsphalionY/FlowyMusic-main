import { db } from '../config/database';
import { User } from '../types/database';

export const createUser = async (userData: {
  username: string;
  email: string;
  password_hash: string;
  profile_image_url?: string;
  bio?: string;
}): Promise<User> => {
  try {
    return db.one(`
      INSERT INTO users (username, email, password_hash, profile_image_url, bio)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      userData.username,
      userData.email,
      userData.password_hash,
      userData.profile_image_url,
      userData.bio
    ]);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    throw error;
  }
};

export const getUserById = async (userId: number): Promise<User | null> => {
  try {
    return db.oneOrNone('SELECT * FROM users WHERE user_id = $1', userId);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, error);
    return null;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    return db.oneOrNone('SELECT * FROM users WHERE email = $1', email);
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
    // Construire dynamiquement la requête de mise à jour
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Ajouter chaque champ non nul à la requête
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    // Ajouter l'ID utilisateur comme dernier paramètre
    values.push(userId);

    // Si aucun champ à mettre à jour, retourner l'utilisateur actuel
    if (updateFields.length === 0) {
      return getUserById(userId);
    }

    // Construire et exécuter la requête
    const query = `
      UPDATE users
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $${paramIndex}
      RETURNING *
    `;

    return db.oneOrNone(query, values);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'utilisateur ${userId}:`, error);
    return null;
  }
};

export const deleteUser = async (userId: number): Promise<boolean> => {
  try {
    const result = await db.result('DELETE FROM users WHERE user_id = $1', userId);
    return result.rowCount > 0;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'utilisateur ${userId}:`, error);
    return false;
  }
};
