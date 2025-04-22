import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

describe('useAudioPlayer', () => {
  const mockAudio = {
    play: jest.fn(),
    pause: jest.fn(),
    currentTime: 0,
    duration: 180,
    volume: 1,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.Audio = jest.fn(() => mockAudio);
  });

  it('devrait initialiser correctement l\'état du lecteur', () => {
    const { result } = renderHook(() => useAudioPlayer('test.mp3'));

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTime).toBe(0);
    expect(result.current.duration).toBe(0);
    expect(result.current.volume).toBe(1);
  });

  it('devrait gérer la lecture et la pause', () => {
    const { result } = renderHook(() => useAudioPlayer('test.mp3'));

    act(() => {
      result.current.play();
    });

    expect(mockAudio.play).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.pause();
    });

    expect(mockAudio.pause).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  it('devrait gérer le changement de volume', () => {
    const { result } = renderHook(() => useAudioPlayer('test.mp3'));

    act(() => {
      result.current.setVolume(0.5);
    });

    expect(mockAudio.volume).toBe(0.5);
    expect(result.current.volume).toBe(0.5);
  });

  it('devrait gérer le changement de temps', () => {
    const { result } = renderHook(() => useAudioPlayer('test.mp3'));

    act(() => {
      result.current.seek(30);
    });

    expect(mockAudio.currentTime).toBe(30);
    expect(result.current.currentTime).toBe(30);
  });
}); 