import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest } from '@jest/globals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';

// Mock the components that use browser APIs
jest.mock('@/components/ui/sonner', () => ({
  Toaster: () => null,
}));

jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
};

describe('Index Component', () => {
  it('renders main sections', () => {
    renderWithProviders(<Index />);

    // Vérifie les éléments principaux
    expect(
      screen.getByRole('heading', { name: /créez, enregistrez, partagez/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /commencer à créer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explorer la bibliothèque/i })).toBeInTheDocument();
  });

  it('renders navigation tabs', () => {
    renderWithProviders(<Index />);

    // Vérifie les onglets de navigation
    expect(screen.getByRole('tab', { name: /découvrir/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /rechercher/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /créer/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /playlist/i })).toBeInTheDocument();
  });

  it('handles tab navigation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Index />);

    // Test la navigation entre les onglets
    const searchTab = screen.getByRole('tab', { name: /rechercher/i });
    await user.click(searchTab);
    expect(searchTab).toHaveAttribute('aria-selected', 'true');
  });

  it('renders header with navigation', () => {
    renderWithProviders(<Index />);

    // Vérifie le header
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /flowy music creation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /bibliothèque/i })).toBeInTheDocument();
  });
});
