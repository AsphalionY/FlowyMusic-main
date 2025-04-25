import { formatTime } from '@/lib/utils';

describe('formatTime', () => {
  it('devrait formater correctement les secondes en minutes:secondes', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(30)).toBe('0:30');
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(90)).toBe('1:30');
    expect(formatTime(3600)).toBe('60:00');
  });

  it('devrait gérer les nombres négatifs', () => {
    expect(formatTime(-30)).toBe('-0:30');
    expect(formatTime(-60)).toBe('-1:00');
  });

  it('devrait gérer les nombres décimaux', () => {
    expect(formatTime(30.5)).toBe('0:30');
    expect(formatTime(60.7)).toBe('1:00');
  });
});
