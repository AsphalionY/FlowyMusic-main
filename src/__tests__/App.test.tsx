import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest } from '@jest/globals';
import '@testing-library/jest-dom';
import App from '../App';
import * as authContext from '@/contexts/AuthContext';

// Mock the components that use browser APIs
jest.mock('@/components/ui/sonner', () => ({
  Toaster: () => null,
}));

jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

// Mock the authentication context
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn<(email: string, password: string) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
    register: jest.fn<(email: string, password: string, username: string) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
    logout: jest.fn(),
    updateProfile: jest.fn<(profileData: any) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
  }),
}));

// Mock the router
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...(actual as object),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/' }),
  };
});

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeTruthy();
  });

  it('displays the main navigation elements', () => {
    render(<App />);
    const navigation = screen.getByRole('navigation');
    const createButton = screen.getByRole('button', { name: /commencer à créer/i });

    expect(navigation).toBeTruthy();
    expect(createButton).toBeTruthy();
  });

  it('handles user interactions', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Test the "Commencer à créer" button
    const createButton = screen.getByRole('button', { name: /commencer à créer/i });
    await user.click(createButton);
    expect(createButton).toBeTruthy();

    // Test navigation tabs
    const discoverTab = screen.getByRole('tab', { name: /découvrir/i });
    const searchTab = screen.getByRole('tab', { name: /rechercher/i });
    const playlistTab = screen.getByRole('tab', { name: /playlist/i });

    expect(discoverTab).toBeTruthy();
    expect(searchTab).toBeTruthy();
    expect(playlistTab).toBeTruthy();
  });

  it('handles authentication state changes', async () => {
    const mockAuth = {
      user: { id: '1', username: 'Test User', email: 'test@example.com', createdAt: new Date().toISOString() },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn<(email: string, password: string) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
      register: jest.fn<(email: string, password: string, username: string) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
      logout: jest.fn(),
      updateProfile: jest.fn<(profileData: any) => Promise<boolean>>().mockImplementation(() => Promise.resolve(true)),
    };

    jest.spyOn(authContext, 'useAuth').mockImplementation(() => mockAuth);

    render(<App />);
    const userElement = screen.getByText(/Test User/i);
    expect(userElement).toBeTruthy();
  });
});
