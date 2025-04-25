import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest } from '@jest/globals';
import DrumPad from '@/components/instruments/DrumPad';

// Mock Audio API
const mockAudio = {
  play: jest.fn(),
  pause: jest.fn(),
  currentTime: 0,
  volume: 1,
  setAttribute: jest.fn(),
};

global.Audio = jest.fn(() => mockAudio);

describe('DrumPad Component', () => {
  const mockDrumSounds = [
    { id: 'kick', name: 'Kick', key: 'a', file: 'kick.mp3' },
    { id: 'snare', name: 'Snare', key: 's', file: 'snare.mp3' },
    { id: 'hihat', name: 'Hi-Hat', key: 'd', file: 'hihat.mp3' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders drum pads', () => {
    render(<DrumPad drumSounds={mockDrumSounds} />);

    mockDrumSounds.forEach(sound => {
      expect(screen.getByText(sound.name)).toBeInTheDocument();
      expect(screen.getByText(sound.key.toUpperCase())).toBeInTheDocument();
    });
  });

  it('plays sound on pad click', async () => {
    const user = userEvent.setup();
    render(<DrumPad drumSounds={mockDrumSounds} />);

    const kickPad = screen.getByText('Kick').closest('button');
    if (kickPad) {
      await user.click(kickPad);
      expect(mockAudio.play).toHaveBeenCalled();
    }
  });

  it('plays sound on key press', async () => {
    const user = userEvent.setup();
    render(<DrumPad drumSounds={mockDrumSounds} />);

    // Simule la pression de la touche 'a'
    await user.keyboard('{a}');
    expect(mockAudio.play).toHaveBeenCalled();
  });

  it('handles multiple key presses', async () => {
    const user = userEvent.setup();
    render(<DrumPad drumSounds={mockDrumSounds} />);

    // Simule plusieurs pressions de touches
    await user.keyboard('{a}{s}{d}');
    expect(mockAudio.play).toHaveBeenCalledTimes(3);
  });

  it('shows visual feedback on pad press', async () => {
    const user = userEvent.setup();
    render(<DrumPad drumSounds={mockDrumSounds} />);

    const kickPad = screen.getByText('Kick').closest('button');
    if (kickPad) {
      await user.click(kickPad);
      expect(kickPad).toHaveClass('active');
    }
  });

  it('handles volume change', async () => {
    const user = userEvent.setup();
    render(<DrumPad drumSounds={mockDrumSounds} />);

    const volumeSlider = screen.getByRole('slider');
    await user.type(volumeSlider, '0.5');

    expect(mockAudio.volume).toBe(0.5);
  });

  it('cleans up audio resources on unmount', () => {
    const { unmount } = render(<DrumPad drumSounds={mockDrumSounds} />);
    unmount();
    expect(mockAudio.pause).toHaveBeenCalled();
  });
});
