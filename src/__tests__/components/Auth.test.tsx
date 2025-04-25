import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest } from '@jest/globals';
import { AuthProvider } from '@/contexts';
import Auth from '@/pages/Auth';

// Mock the components that use browser APIs
jest.mock('@/components/ui/sonner', () => ({
  Toaster: () => null,
}));

describe('Auth Component', () => {
  it('renders login form by default', () => {
    render(
      <AuthProvider>
        <Auth />
      </AuthProvider>
    );

    expect(screen.getByRole('tab', { name: /connexion/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /inscription/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  });

  it('switches to register form when clicking register tab', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Auth />
      </AuthProvider>
    );

    const registerTab = screen.getByRole('tab', { name: /inscription/i });
    await user.click(registerTab);

    expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeInTheDocument();
  });
});
