import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from '@jest/globals';
import Layout from '@/components/Layout';

// Mock UserNav component
jest.mock('@/components/UserNav', () => ({
  __esModule: true,
  default: () => <div data-testid="user-nav">UserNav</div>
}));

describe('Layout Component', () => {
  const renderWithRouter = async (component: React.ReactNode) => {
    let result;
    await act(async () => {
      result = render(
        <BrowserRouter>
          {component}
        </BrowserRouter>
      );
    });
    return result;
  };

  it('renders the layout with children', async () => {
    await renderWithRouter(
      <Layout>
        <div data-testid="test-child">Test Content</div>
      </Layout>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('renders the header with logo and navigation', async () => {
    await renderWithRouter(<Layout><div>Test</div></Layout>);

    expect(screen.getByText('Flowy')).toBeInTheDocument();
    expect(screen.getByText('Music Creation')).toBeInTheDocument();
    expect(screen.getByTestId('user-nav')).toBeInTheDocument();
  });

  it('renders the library link in header', async () => {
    await renderWithRouter(<Layout><div>Test</div></Layout>);

    const libraryLink = screen.getByText('Bibliothèque');
    expect(libraryLink).toBeInTheDocument();
    expect(libraryLink.closest('a')).toHaveAttribute('href', '/shared-music');
  });
}); 