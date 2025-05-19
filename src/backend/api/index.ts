/**
 * Point d'entrée principal pour l'API backend
 * Centralise toutes les API exposées par le backend
 */

import * as musicService from '../services/musicService';
import * as userService from '../services/userService';
import * as authService from '../services/authService';

/**
 * API centrale pour toutes les fonctionnalités backend
 */
export const backendAPI = {
  /**
   * Services liés à la musique (création, recherche, etc.)
   */
  music: {
    /**
     * Récupère toutes les musiques publiques
     */
    getPublicMusic: musicService.getAllSharedMusic,
    
    /**
     * Récupère les musiques d'un utilisateur
     */
    getUserMusic: musicService.getUserMusic,
    
    /**
     * Sauvegarde une nouvelle musique
     */
    saveMusic: musicService.addSharedMusic,
    
    /**
     * Rend une musique publique dans la bibliothèque
     */
    makePublic: (id: string, isPublic: boolean) => {
      console.log(`Rendre la musique ${id} ${isPublic ? 'publique' : 'privée'}`);
      return Promise.resolve();
    },
  },
  
  /**
   * Services liés à l'utilisateur
   */
  users: {
    /**
     * Récupère le profil utilisateur
     */
    getProfile: (userId: string) => {
      console.log(`Récupérer le profil de l'utilisateur ${userId}`);
      return Promise.resolve({ id: userId, username: 'utilisateur', email: 'user@example.com' });
    },
    
    /**
     * Met à jour le profil utilisateur
     */
    updateProfile: (userId: string, data: any) => {
      console.log(`Mettre à jour le profil de l'utilisateur ${userId}`, data);
      return Promise.resolve({ id: userId, ...data });
    },
  },
  
  /**
   * Services liés à l'authentification
   */
  auth: {
    /**
     * Connecte un utilisateur
     */
    login: (email: string, password: string) => {
      console.log(`Connexion de l'utilisateur ${email}`);
      return Promise.resolve({ success: true, userId: '1', email });
    },
    
    /**
     * Inscrit un nouvel utilisateur
     */
    register: (email: string, password: string, username: string) => {
      console.log(`Inscription de l'utilisateur ${username} (${email})`);
      return Promise.resolve({ success: true, userId: '1', email, username });
    },
    
    /**
     * Déconnecte l'utilisateur courant
     */
    logout: () => {
      console.log('Déconnexion de l\'utilisateur');
      return Promise.resolve({ success: true });
    },
    
    /**
     * Réinitialise le mot de passe
     */
    resetPassword: (email: string) => {
      console.log('Réinitialisation du mot de passe pour:', email);
      return Promise.resolve({ success: true });
    },
  },
};

export default backendAPI;
