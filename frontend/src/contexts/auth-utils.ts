import { MusicCategory } from '@/types/music';

// Types
export type User = {
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

// Type pour l'utilisateur avec données sensibles
export type UserWithSensitiveData = User & {
  password: string;
  encryptionKey?: string;
};

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
}

// Fonction de hachage simple compatible entre différentes plateformes
export const hashPassword = async (password: string): Promise<string> => {
  // Implémentation cross-plateforme simple basée sur un algorithme de hachage de chaîne standard
  let hash = 0;
  // Algorithme simple de hachage de chaîne qui fonctionnera de manière identique sur toutes les plateformes
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Conversion en 32bit integer
  }
  
  // Convertir en string hexadécimal
  let hashStr = (hash >>> 0).toString(16);
  
  // Ajouter du padding pour assurer une longueur constante
  while (hashStr.length < 8) hashStr = '0' + hashStr;
  
  // Préfixe pour identifier que c'est un hachage cross-plateforme
  return `xp_${hashStr}`;
};

// Fonctions de chiffrement/déchiffrement avec Web Crypto API
export const generateKey = async (): Promise<CryptoKey> => {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
};

export const exportKey = async (key: CryptoKey): Promise<string> => {
  const exported = await crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
};

export const importKey = async (keyString: string): Promise<CryptoKey> => {
  const keyData = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
  return await crypto.subtle.importKey('raw', keyData, { name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt',
  ]);
};

export const encryptData = async (data: string, key: CryptoKey): Promise<string> => {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encoder.encode(data)
  );
  return btoa(String.fromCharCode(...iv) + String.fromCharCode(...new Uint8Array(encrypted)));
};

export const decryptData = async (encryptedData: string, key: CryptoKey): Promise<string> => {
  const decoded = atob(encryptedData);
  const iv = new Uint8Array(Array.from(decoded.slice(0, 12)).map(c => c.charCodeAt(0)));
  const data = new Uint8Array(Array.from(decoded.slice(12)).map(c => c.charCodeAt(0)));
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data
  );
  return new TextDecoder().decode(decrypted);
};

// Fonction pour séparer les données sensibles
export const separateSensitiveData = (userData: UserWithSensitiveData) => {
  const { password, ...publicData } = userData;
  return {
    sensitiveData: { password },
    publicData: publicData as User,
  };
};

// Fonction pour générer un ID sécurisé
export const generateSecureId = async (): Promise<string> => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
