import { createContext } from 'react';
import { AuthContextType } from './auth-utils';

// Création du contexte d'authentification
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
