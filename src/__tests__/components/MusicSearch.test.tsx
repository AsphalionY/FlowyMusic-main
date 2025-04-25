import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest } from '@jest/globals';
import MusicSearch from '@/components/MusicSearch';

// Mock the components that use browser APIs
jest.mock('@/components/ui/sonner', () => ({
  Toaster: () => null,
}));

jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

describe('MusicSearch Component', () => {
  const mockOnSearch = jest.fn();
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input and filters', () => {
    render(<MusicSearch onSearch={mockOnSearch} onSelect={mockOnSelect} isLoading={false} />);

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('handles search input', async () => {
    const user = userEvent.setup();
    render(<MusicSearch onSearch={mockOnSearch} onSelect={mockOnSelect} isLoading={false} />);

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'test search');

    // Vérifie que la recherche est déclenchée après un délai
    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });

  it('handles filter selection', async () => {
    const user = userEvent.setup();
    render(<MusicSearch onSearch={mockOnSearch} onSelect={mockOnSelect} isLoading={false} />);

    const filterSelect = screen.getByRole('combobox');
    await user.selectOptions(filterSelect, 'title');

    expect(mockOnSelect).toHaveBeenCalledWith('title');
  });

  it('shows loading state', () => {
    render(<MusicSearch onSearch={mockOnSearch} onSelect={mockOnSelect} isLoading={true} />);

    expect(screen.getByRole('searchbox')).toBeDisabled();
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('handles empty search', async () => {
    const user = userEvent.setup();
    render(<MusicSearch onSearch={mockOnSearch} onSelect={mockOnSelect} isLoading={false} />);

    const searchInput = screen.getByRole('searchbox');
    await user.clear(searchInput);

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});
