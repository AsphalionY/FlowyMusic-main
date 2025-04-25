import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest } from '@jest/globals';
import WaveformPlayer from '@/components/WaveformPlayer';

// Mock wavesurfer.js
const mockWaveSurfer = {
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  on: jest.fn(),
  destroy: jest.fn(),
  setVolume: jest.fn(),
  getDuration: jest.fn(() => 180),
  getCurrentTime: jest.fn(() => 0),
  seekTo: jest.fn(),
};

jest.mock('wavesurfer.js', () => ({
  create: jest.fn(() => mockWaveSurfer),
}));

describe('WaveformPlayer Component', () => {
  const mockProps = {
    audioUrl: 'test.mp3',
    playing: false,
    height: 100,
    waveColor: '#000',
    progressColor: '#fff',
    onPlay: jest.fn(),
    onPause: jest.fn(),
    onFinish: jest.fn(),
    onSeek: jest.fn(),
    onReady: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders waveform container', () => {
    render(<WaveformPlayer {...mockProps} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('initializes wavesurfer with correct options', () => {
    render(<WaveformPlayer {...mockProps} />);
    expect(mockWaveSurfer.on).toHaveBeenCalledWith('ready', expect.any(Function));
    expect(mockWaveSurfer.on).toHaveBeenCalledWith('play', expect.any(Function));
    expect(mockWaveSurfer.on).toHaveBeenCalledWith('pause', expect.any(Function));
    expect(mockWaveSurfer.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });

  it('handles play/pause', async () => {
    const user = userEvent.setup();
    render(<WaveformPlayer {...mockProps} />);

    // Simule le clic sur la forme d'onde
    const waveform = screen.getByRole('region');
    await user.click(waveform);

    expect(mockWaveSurfer.play).toHaveBeenCalled();
    expect(mockProps.onPlay).toHaveBeenCalled();

    // Simule la pause
    await user.click(waveform);
    expect(mockWaveSurfer.pause).toHaveBeenCalled();
    expect(mockProps.onPause).toHaveBeenCalled();
  });

  it('handles volume change', async () => {
    const user = userEvent.setup();
    render(<WaveformPlayer {...mockProps} />);

    const volumeInput = screen.getByRole('slider');
    await user.type(volumeInput, '0.5');

    expect(mockWaveSurfer.setVolume).toHaveBeenCalledWith(0.5);
  });

  it('cleans up on unmount', () => {
    const { unmount } = render(<WaveformPlayer {...mockProps} />);
    unmount();
    expect(mockWaveSurfer.destroy).toHaveBeenCalled();
  });

  it('handles seek', async () => {
    const user = userEvent.setup();
    render(<WaveformPlayer {...mockProps} />);

    const waveform = screen.getByRole('region');
    await user.click(waveform);

    // Simule un événement de recherche
    // Créer un événement de clic avec les propriétés correctes
    const seekEvent = new MouseEvent('click', {
      clientX: 100,
      bubbles: true,
      cancelable: true,
      view: window
    });
    waveform.dispatchEvent(seekEvent);

    expect(mockWaveSurfer.seekTo).toHaveBeenCalled();
    expect(mockProps.onSeek).toHaveBeenCalled();
  });
});
