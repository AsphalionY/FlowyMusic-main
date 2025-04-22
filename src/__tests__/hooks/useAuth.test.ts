import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';

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

    await act(async () => {
      const success = await result.current.login('test@example.com', 'password123');
      expect(success).toBe(false); // Should be false as credentials are not valid
    });

    expect(result.current.isAuthenticated).toBe(false);
  });
}); 