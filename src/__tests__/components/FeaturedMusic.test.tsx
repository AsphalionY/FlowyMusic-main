import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import FeaturedMusic from '@/components/FeaturedMusic';

describe('FeaturedMusic Component', () => {
  it('renders the empty state message', () => {
    render(<FeaturedMusic />);
    
    expect(screen.getByText('Aucun contenu pour le moment')).toBeInTheDocument();
    expect(screen.getByText(/Les playlists et artistes recommandés/)).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<FeaturedMusic className="custom-class" />);
    
    const container = screen.getByText('Aucun contenu pour le moment').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('shows the empty state icon', () => {
    render(<FeaturedMusic />);
    
    const iconContainer = screen.getByText('Aucun contenu pour le moment').previousElementSibling;
    expect(iconContainer).toHaveClass('bg-secondary/30');
  });
}); 