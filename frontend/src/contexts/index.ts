// Réexportation des composants, contextes et hooks
// AuthContext et AuthProvider
export { AuthContext } from './auth-context';
export { AuthProvider } from './AuthProvider';
// Nouveau provider basé sur Supabase
export { SupabaseAuthProvider } from './SupabaseAuthProvider';
export { useAuth } from './useAuth';

// Types et utilitaires
export {
  type User,
  type UserWithSensitiveData,
  type AuthContextType,
  hashPassword,
  generateKey,
  exportKey,
  importKey,
  encryptData,
  decryptData,
  separateSensitiveData,
  generateSecureId
} from './auth-utils';
