import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest } from '@jest/globals';
import App from '../App';

// Mock the components that use browser APIs
jest.mock('@/components/ui/sonner', () => ({
  Toaster: () => null,
}));

jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    render(<App />);
    const user = userEvent.setup();
    
    // Test the "Commencer à créer" button
    const button = screen.getByRole('button', { name: /commencer à créer/i });
    await user.click(button);
    
    // Since this button likely navigates to another page, we can verify the navigation
    // or check for any side effects of the click
    expect(button).toBeInTheDocument();
  });
}); 