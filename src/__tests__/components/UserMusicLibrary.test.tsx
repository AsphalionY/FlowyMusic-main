import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import UserMusicLibrary from '@/components/UserMusicLibrary';

describe('UserMusicLibrary Component', () => {
  it('renders the empty library message', () => {
    render(<UserMusicLibrary />);

    expect(screen.getByText('Bibliothèque vide')).toBeInTheDocument();
    expect(
      screen.getByText(/Aucune musique disponible dans votre bibliothèque/)
    ).toBeInTheDocument();
  });

  it('shows the empty state icon', () => {
    render(<UserMusicLibrary />);

    const iconContainer = screen.getByText('Bibliothèque vide').previousElementSibling;
    expect(iconContainer).toHaveClass('bg-secondary/30');
  });

  it('has responsive padding classes', () => {
    render(<UserMusicLibrary />);

    const container = screen.getByText('Bibliothèque vide').closest('div');
    expect(container).toHaveClass('py-8', 'md:py-12');
  });
});
