import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, jest } from '@jest/globals';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
}); 