import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest } from '@jest/globals';
import MusicPlayer from '@/components/MusicPlayer';

// Mock the components that use browser APIs
jest.mock('@/components/ui/sonner', () => ({
  Toaster: () => null,
}));

jest.mock('wavesurfer.js', () => ({
  create: jest.fn(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    on: jest.fn(),
    destroy: jest.fn(),
  })),
}));

describe('MusicPlayer Component', () => {
  const mockTrack = {
    id: '1',
    title: 'Test Track',
    artist: 'Test Artist',
    duration: 180,
    url: 'test.mp3',
  };

  it('renders player controls', () => {
    render(<MusicPlayer currentTrack={mockTrack} />);
    
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    expect(screen.getByText(mockTrack.title)).toBeInTheDocument();
    expect(screen.getByText(mockTrack.artist)).toBeInTheDocument();
  });

  it('handles play/pause interaction', async () => {
    const user = userEvent.setup();
    render(<MusicPlayer currentTrack={mockTrack} />);

    const playButton = screen.getByRole('button', { name: /play/i });
    await user.click(playButton);

    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });
}); 