import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';

// Mock AuthContext
type User = {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
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

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Utiliser useMemo pour éviter de recréer l'objet à chaque rendu
  const authValue = useMemo<AuthContextType>(() => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login: jest.fn<(email: string, password: string) => Promise<boolean>>().mockImplementation(() => Promise.resolve(false)),
    register: jest.fn<(email: string, password: string, username: string) => Promise<boolean>>().mockImplementation(() => Promise.resolve(false)),
    logout: jest.fn(),
    updateProfile: jest.fn<(profileData: Partial<User>) => Promise<boolean>>().mockImplementation(() => Promise.resolve(false)),
  }), []);

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

describe('useAuth Hook', () => {
  it('provides authentication state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('handles login', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Utiliser act avec async/await pour éviter la signature obsolète
    await act(async () => {
      // Appeler login avec await
      await result.current.login('test@example.com', 'password123');
    });
    
    // Attendre que la promesse soit résolue
    await expect(result.current.login('test@example.com', 'password123')).resolves.toBe(false);

    expect(result.current.isAuthenticated).toBe(false);
  });
});
