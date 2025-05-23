import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, jest } from '@jest/globals';
import UserNav from '@/components/UserNav';
import * as AuthContext from '@/contexts';

// Définition du type User pour les tests
type User = {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  createdAt: string;
  bio?: string;
};

// Mock useAuth hook
jest.mock('@/contexts', () => ({
  useAuth: () => ({
    user: {
      id: '123',
      username: 'testuser',
      email: 'test@example.com',
      profileImage: 'test.jpg',
      createdAt: new Date().toISOString(),
    },
    logout: jest.fn(),
    isAuthenticated: true,
    isLoading: false,
    login: jest.fn<(email: string, password: string) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
    register: jest.fn<(email: string, password: string, username: string) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
    updateProfile: jest.fn<(profileData: Partial<User>) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
  }),
}));

describe('UserNav Component', () => {
  const renderWithRouter = async (component: React.ReactNode) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('renders user avatar when authenticated', async () => {
    await renderWithRouter(<UserNav />);

    const avatar = screen.getByRole('button');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('rounded-full');
  });

  it('shows user info in dropdown', async () => {
    await renderWithRouter(<UserNav />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('renders login/register buttons when not authenticated', async () => {
    jest.spyOn(AuthContext, 'useAuth').mockImplementation(() => ({
      user: null,
      logout: jest.fn(),
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn<(email: string, password: string) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
      register: jest.fn<(email: string, password: string, username: string) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
      updateProfile: jest.fn<(profileData: Partial<User>) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
    }));

    await renderWithRouter(<UserNav />);

    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByText("S'inscrire")).toBeInTheDocument();
  });

  it('navigates to auth page when login button is clicked', async () => {
    jest.spyOn(AuthContext, 'useAuth').mockImplementation(() => ({
      user: null,
      logout: jest.fn(),
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn<(email: string, password: string) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
      register: jest.fn<(email: string, password: string, username: string) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
      updateProfile: jest.fn<(profileData: Partial<User>) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
    }));

    await renderWithRouter(<UserNav />);

    fireEvent.click(screen.getByText('Connexion'));

    expect(window.location.pathname).toBe('/auth');
  });

  it('navigates to auth page with register tab when register button is clicked', async () => {
    jest.spyOn(AuthContext, 'useAuth').mockImplementation(() => ({
      user: null,
      logout: jest.fn(),
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn<(email: string, password: string) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
      register: jest.fn<(email: string, password: string, username: string) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
      updateProfile: jest.fn<(profileData: Partial<User>) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
    }));

    await renderWithRouter(<UserNav />);

    fireEvent.click(screen.getByText("S'inscrire"));

    expect(window.location.pathname).toBe('/auth');
    expect(window.location.search).toBe('?tab=register');
  });
});
