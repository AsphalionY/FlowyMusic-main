import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import CreatorProfile from '@/components/CreatorProfile';

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    info: jest.fn(),
    success: jest.fn()
  }
}));

describe('CreatorProfile Component', () => {
  it('renders the empty state message', () => {
    render(<CreatorProfile />);
    
    expect(screen.getByText('Aucun profil disponible')).toBeInTheDocument();
    expect(screen.getByText(/Le profil du créateur apparaîtra ici/)).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<CreatorProfile className="custom-class" />);
    
    const container = screen.getByText('Aucun profil disponible').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('shows the empty state icon', () => {
    render(<CreatorProfile />);
    
    const iconContainer = screen.getByText('Aucun profil disponible').previousElementSibling;
    expect(iconContainer).toHaveClass('bg-secondary/30');
  });
}); 