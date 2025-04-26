import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import {
  User,
  UserWithSensitiveData,
  hashPassword,
  separateSensitiveData,
  generateSecureId
} from './auth-utils';

// Import du contexte depuis auth-context.ts
import { AuthContext } from './auth-context';

// Le composant AuthProvider est le seul export de ce fichier
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Vérifier si l'utilisateur a un token dans localStorage quand l'app démarre
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Dans une vraie app, on vérifierait le token côté serveur
          const userData = JSON.parse(localStorage.getItem('user_data') ?? '{}');
          if (userData?.id) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        toast.error('Erreur lors de la vérification de l\'authentification');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fonction pour se connecter
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Récupérer les utilisateurs depuis le localStorage
      const usersData = localStorage.getItem('users');
      const users: UserWithSensitiveData[] = usersData ? JSON.parse(usersData) : [];

      // Trouver l'utilisateur correspondant à l'email
      const userWithSensitiveData = users.find(u => u.email === email);
      
      if (!userWithSensitiveData) {
        toast.error('Email ou mot de passe incorrect');
        return false;
      }

      // Vérifier le mot de passe
      // Dans une vraie application, on utiliserait bcrypt.compare ou similaire
      // Ici, on simule une vérification simple
      const hashedPassword = await hashPassword(password);
      const storedPassword = userWithSensitiveData.password;
      if (hashedPassword !== storedPassword) {
        toast.error('Email ou mot de passe incorrect');
        return false;
      }

      // Séparer les données sensibles
      const { publicData: userData } = separateSensitiveData(userWithSensitiveData);

      // Stocker le token et les données utilisateur
      localStorage.setItem('auth_token', 'fake_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(userData));

      setUser(userData);
      toast.success('Connexion réussie');
      return true;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      toast.error('Erreur lors de la connexion');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fonction pour s'inscrire
  const register = useCallback(async (email: string, password: string, username: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Récupérer les utilisateurs existants
      const usersData = localStorage.getItem('users');
      const users: UserWithSensitiveData[] = usersData ? JSON.parse(usersData) : [];

      // Vérifier si l'email est déjà utilisé
      if (users.some(u => u.email === email)) {
        toast.error('Cet email est déjà utilisé');
        return false;
      }

      // Hacher le mot de passe
      const hashedPassword = await hashPassword(password);

      // Créer un nouvel utilisateur
      const newUserWithSensitiveData: UserWithSensitiveData = {
        id: await generateSecureId(),
        username,
        email,
        password: hashedPassword, // hashedPassword est déjà résolu car on utilise await
        createdAt: new Date().toISOString(),
      };

      // Séparer les données sensibles
      const { publicData: newUser } = separateSensitiveData(newUserWithSensitiveData);

      // Ajouter l'utilisateur à la liste
      users.push(newUserWithSensitiveData);
      localStorage.setItem('users', JSON.stringify(users));

      // Connecter automatiquement l'utilisateur
      localStorage.setItem('auth_token', 'fake_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(newUser));

      setUser(newUser);
      toast.success('Inscription réussie');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      toast.error('Erreur lors de l\'inscription');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fonction pour se déconnecter
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    toast.success('Déconnexion réussie');
  }, []);

  // Fonction pour mettre à jour le profil
  const updateProfile = useCallback(async (profileData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!user) {
        toast.error('Vous devez être connecté pour mettre à jour votre profil');
        return false;
      }

      // Récupérer les utilisateurs
      const usersData = localStorage.getItem('users');
      const users: UserWithSensitiveData[] = usersData ? JSON.parse(usersData) : [];

      // Trouver l'utilisateur à mettre à jour
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex === -1) {
        toast.error('Utilisateur non trouvé');
        return false;
      }

      // Mettre à jour les données
      const updatedUserWithSensitiveData = {
        ...users[userIndex],
        ...profileData,
      };

      // Séparer les données sensibles
      const { publicData: updatedUser } = separateSensitiveData(updatedUserWithSensitiveData);

      // Mettre à jour la liste des utilisateurs
      users[userIndex] = updatedUserWithSensitiveData;
      localStorage.setItem('users', JSON.stringify(users));

      // Mettre à jour les données utilisateur
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success('Profil mis à jour avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Créer le contexte avec les valeurs
  const authContextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  }), [user, isLoading, login, register, logout, updateProfile]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
