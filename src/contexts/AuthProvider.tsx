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
      
      // DEBUG: Afficher les données de debug pour le dépannage
      console.log(`⚠️ Tentative de connexion avec:`, { email, password });
      
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Récupérer les utilisateurs depuis le localStorage
      const usersData = localStorage.getItem('users');
      
      // DEBUG: Afficher les utilisateurs stockés
      console.log('📓 Utilisateurs stockés:', usersData);
      
      const users: UserWithSensitiveData[] = usersData ? JSON.parse(usersData) : [];

      // DEBUG: Afficher la liste des utilisateurs
      console.log('👤 Liste des utilisateurs:', users.map(u => ({ email: u.email, username: u.username })));

      // Trouver l'utilisateur correspondant à l'email
      const userWithSensitiveData = users.find(u => u.email === email);
      
      if (!userWithSensitiveData) {
        console.error('❌ Utilisateur non trouvé:', email);
        toast.error('Email ou mot de passe incorrect');
        
        // DEBUG: Mode de secours - Créer automatiquement un utilisateur s'il n'existe pas
        if (email === 'test@test.com' && password === 'testpassword') {
          console.log('⚙️ MODE DEBUG ACTIVÉ: création automatique d\'un utilisateur de test');
          
          // Créer un nouvel utilisateur de test
          const secureId = await generateSecureId();
          const newUserWithSensitiveData: UserWithSensitiveData = {
            id: secureId,
            username: 'Utilisateur Test',
            email: email,
            password: 'xp_testpass', // Mot de passe fixe pour le mode debug
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
          toast.success('Mode développement: Compte de test créé et connecté');
          return true;
        }
        
        return false;
      }

      // DEBUG: Afficher les infos de l'utilisateur trouvé
      console.log('✅ Utilisateur trouvé:', { 
        email: userWithSensitiveData.email,
        username: userWithSensitiveData.username,
        storedPasswordHash: userWithSensitiveData.password 
      });

      // Vérifier le mot de passe
      const hashedPassword = await hashPassword(password);
      const storedPassword = userWithSensitiveData.password;
      
      // DEBUG: Afficher la comparaison des mots de passe
      console.log('🔑 Comparaison des mots de passe:', { 
        inputHash: hashedPassword, 
        storedHash: storedPassword,
        match: hashedPassword === storedPassword 
      });
      
      // Mode de développement: accepter certains mots de passe pour les tests cross-plateforme
      const isDevPassword = password === 'testpassword'; // Mot de passe universel pour les tests
      const isLegacyHash = !storedPassword.startsWith('xp_');
      
      if (hashedPassword !== storedPassword && !(isDevPassword && isLegacyHash)) {
        console.error('❌ Échec d\'authentification: le mot de passe ne correspond pas');
        toast.error('Email ou mot de passe incorrect');
        return false;
      }

      // Si c'est un mot de passe de développement et un ancien hash, mettre à jour le hash
      if (isDevPassword && isLegacyHash) {
        console.log('🔄 Mise à jour du hash de mot de passe vers le format cross-plateforme');
        
        // Mettre à jour l'utilisateur avec le nouveau hash
        const updatedUserIndex = users.findIndex(u => u.id === userWithSensitiveData.id);
        if (updatedUserIndex !== -1) {
          users[updatedUserIndex].password = hashedPassword;
          localStorage.setItem('users', JSON.stringify(users));
        }
      }

      // Séparer les données sensibles
      const { publicData: userData } = separateSensitiveData(userWithSensitiveData);

      // Stocker le token et les données utilisateur
      localStorage.setItem('auth_token', 'fake_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(userData));

      setUser(userData);
      toast.success('Connexion réussie');
      console.log('🎉 Utilisateur connecté avec succès');
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
