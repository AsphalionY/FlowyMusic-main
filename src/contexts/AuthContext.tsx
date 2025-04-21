import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MusicCategory } from '@/types/music';

// Fonction de hachage simple (à remplacer par une vraie fonction de hachage côté serveur)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Fonctions de chiffrement/déchiffrement avec Web Crypto API
const generateKey = async (): Promise<CryptoKey> => {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
};

const exportKey = async (key: CryptoKey): Promise<string> => {
  const exported = await crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
};

const importKey = async (keyString: string): Promise<CryptoKey> => {
  const keyData = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

const encryptData = async (data: string, key: CryptoKey): Promise<string> => {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    encoder.encode(data)
  );
  return btoa(String.fromCharCode(...iv) + String.fromCharCode(...new Uint8Array(encrypted)));
};

const decryptData = async (encryptedData: string, key: CryptoKey): Promise<string> => {
  const decoded = atob(encryptedData);
  const iv = new Uint8Array(Array.from(decoded.slice(0, 12)).map(c => c.charCodeAt(0)));
  const data = new Uint8Array(Array.from(decoded.slice(12)).map(c => c.charCodeAt(0)));
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    data
  );
  return new TextDecoder().decode(decrypted);
};

// Fonction pour séparer les données sensibles
const separateSensitiveData = (userData: any) => {
  const { password, ...publicData } = userData;
  return {
    sensitiveData: { password },
    publicData
  };
};

// Fonction pour générer des nombres aléatoires sécurisés
const getSecureRandomNumber = async (min: number, max: number): Promise<number> => {
  const range = max - min;
  const bytes = new Uint8Array(4);
  await crypto.getRandomValues(bytes);
  const randomValue = new DataView(bytes.buffer).getUint32(0, true);
  return min + (randomValue % range);
};

// Fonction pour générer un ID sécurisé
const generateSecureId = async (): Promise<string> => {
  const bytes = new Uint8Array(16);
  await crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const usersJSON = localStorage.getItem('harmonybot_users') || '[]';
      const users = JSON.parse(usersJSON);
      
      const hashedPassword = await hashPassword(password);
      const foundUser = users.find((u: any) => u.email === email);
      
      if (foundUser) {
        // Récupérer la clé de chiffrement
        const encryptionKey = await importKey(foundUser.encryptionKey);
        
        // Déchiffrer le mot de passe stocké
        const decryptedPassword = await decryptData(foundUser.password, encryptionKey);
        
        if (decryptedPassword === hashedPassword) {
          // Séparer les données sensibles et publiques
          const { sensitiveData, publicData } = separateSensitiveData(foundUser);
          
          // Ne stocker que les données publiques
          setUser(publicData);
          localStorage.setItem('harmonybot_user', JSON.stringify(publicData));
          
          toast.success('Connexion réussie');
          setIsLoading(false);
          return true;
        }
      }
      
      toast.error('Email ou mot de passe incorrect');
      setIsLoading(false);
      return false;
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const usersJSON = localStorage.getItem('harmonybot_users') || '[]';
      const users = JSON.parse(usersJSON);
      
      const userExists = users.some((u: any) => 
        u.email === email || u.username === username
      );
      
      if (userExists) {
        toast.error('Un utilisateur avec cet email ou nom d\'utilisateur existe déjà');
        setIsLoading(false);
        return false;
      }
      
      const hashedPassword = await hashPassword(password);
      const encryptionKey = await generateKey();
      const keyString = await exportKey(encryptionKey);
      const secureId = await generateSecureId();
      
      const newUser = {
        id: secureId,
        username,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        followers: 0,
        following: 0,
        tracks: 0,
        preferredCategories: []
      };
      
      // Séparer les données sensibles et publiques
      const { sensitiveData, publicData } = separateSensitiveData(newUser);
      
      // Chiffrer les données sensibles
      const encryptedPassword = await encryptData(sensitiveData.password, encryptionKey);
      
      // Stocker les données séparément
      const encryptedUsers = users.map((u: any) => {
        const { sensitiveData: uSensitive, publicData: uPublic } = separateSensitiveData(u);
        return { ...uPublic, password: uSensitive.password };
      });
      
      encryptedUsers.push({ ...publicData, password: encryptedPassword, encryptionKey: keyString });
      
      localStorage.setItem('harmonybot_users', JSON.stringify(encryptedUsers));
      setUser(publicData);
      localStorage.setItem('harmonybot_user', JSON.stringify(publicData));
      
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create updated user data
      const updatedUser = { ...user, ...profileData };
      
      // Separate sensitive and public data
      const { publicData } = separateSensitiveData(updatedUser);
      
      // Only store public data in user state and localStorage
      setUser(publicData);
      localStorage.setItem('harmonybot_user', JSON.stringify(publicData));
      
      // Update users array while preserving sensitive data
      const usersJSON = localStorage.getItem('harmonybot_users') || '[]';
      const users = JSON.parse(usersJSON);
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          // Preserve existing sensitive data while updating public data
          const { sensitiveData: existingSensitive } = separateSensitiveData(u);
          return { ...publicData, password: existingSensitive.password };
        }
        return u;
      });
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
