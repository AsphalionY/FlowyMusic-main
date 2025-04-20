
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type MusicCategory = 'rap' | 'rock' | 'pop' | 'electro' | 'jazz' | 'classique' | 'autre';

type User = {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  createdAt: string;
  bio?: string;
  followers?: number;
  following?: number;
  tracks?: number;
  preferredCategories?: MusicCategory[];
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Vérifier si l'utilisateur a un token dans localStorage quand l'app démarre
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('harmonybot_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simuler un appel API avec timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pour démonstration, récupérer les utilisateurs stockés
      const usersJSON = localStorage.getItem('harmonybot_users') || '[]';
      const users = JSON.parse(usersJSON);
      
      const foundUser = users.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (foundUser) {
        // Ne pas stocker le mot de passe dans l'état utilisateur
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('harmonybot_user', JSON.stringify(userWithoutPassword));
        toast.success('Connexion réussie');
        setIsLoading(false);
        return true;
      } else {
        toast.error('Email ou mot de passe incorrect');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast.error('Erreur lors de la connexion');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, username: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pour démonstration, récupérer les utilisateurs stockés
      const usersJSON = localStorage.getItem('harmonybot_users') || '[]';
      const users = JSON.parse(usersJSON);
      
      // Vérifier si l'utilisateur existe déjà
      const userExists = users.some((u: any) => 
        u.email === email || u.username === username
      );
      
      if (userExists) {
        toast.error('Un utilisateur avec cet email ou nom d\'utilisateur existe déjà');
        setIsLoading(false);
        return false;
      }
      
      // Créer nouvel utilisateur
      const newUser = {
        id: `user_${Date.now()}`,
        username,
        email,
        password, // Dans une vraie app, ce serait haché
        createdAt: new Date().toISOString(),
        followers: 0,
        following: 0,
        tracks: 0,
        preferredCategories: []
      };
      
      // Ajouter au tableau d'utilisateurs
      users.push(newUser);
      localStorage.setItem('harmonybot_users', JSON.stringify(users));
      
      // Ne pas stocker le mot de passe dans l'état utilisateur
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('harmonybot_user', JSON.stringify(userWithoutPassword));
      
      toast.success('Inscription réussie');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      toast.error('Erreur lors de l\'inscription');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('harmonybot_user');
    toast.info('Vous êtes déconnecté');
  };

  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour les données utilisateur
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('harmonybot_user', JSON.stringify(updatedUser));
      
      // Mettre aussi à jour dans le tableau des utilisateurs
      const usersJSON = localStorage.getItem('harmonybot_users') || '[]';
      const users = JSON.parse(usersJSON);
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, ...profileData, password: u.password } : u
      );
      localStorage.setItem('harmonybot_users', JSON.stringify(updatedUsers));
      
      toast.success('Profil mis à jour');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
      setIsLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user,
      login, 
      register, 
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
