import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from '@jest/globals';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    render(<App />);
    const user = userEvent.setup();
    
    // Example of testing user interaction
    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);
    
    expect(screen.getByText(/clicked/i)).toBeInTheDocument();
  });
}); 