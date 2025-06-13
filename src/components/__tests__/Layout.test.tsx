import { render, screen } from '@testing-library/react';
import Layout from '../Layout';

// Mock Next.js usePathname
const mockUsePathname = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

// Mock Navbar and Footer components
jest.mock('../Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

jest.mock('../Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

describe('Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children content', () => {
    mockUsePathname.mockReturnValue('/some-page');
    
    render(
      <Layout>
        <div data-testid="child-content">Test Content</div>
      </Layout>
    );
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('always renders Footer', () => {
    mockUsePathname.mockReturnValue('/some-page');
    
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders Navbar only on home page', () => {
    mockUsePathname.mockReturnValue('/');
    
    render(
      <Layout>
        <div>Home Content</div>
      </Layout>
    );
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('does not render Navbar on non-home pages', () => {
    mockUsePathname.mockReturnValue('/room/123');
    
    render(
      <Layout>
        <div>Room Content</div>
      </Layout>
    );
    
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
  });

  it('applies different container styles for home page', () => {
    mockUsePathname.mockReturnValue('/');
    
    render(
      <Layout>
        <div data-testid="child-content">Home Content</div>
      </Layout>
    );
    
    const container = screen.getByTestId('child-content').parentElement;
    expect(container).toHaveClass('flex-1');
    expect(container).not.toHaveClass('container', 'mx-auto', 'px-4', 'py-8');
  });

  it('applies container styles for non-home pages', () => {
    mockUsePathname.mockReturnValue('/room/123');
    
    render(
      <Layout>
        <div data-testid="child-content">Room Content</div>
      </Layout>
    );
    
    const container = screen.getByTestId('child-content').parentElement;
    expect(container).toHaveClass('flex-1', 'container', 'mx-auto', 'px-4', 'py-8');
  });

  it('applies correct root layout classes', () => {
    mockUsePathname.mockReturnValue('/');
    
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    const rootDiv = screen.getByTestId('navbar').parentElement;
    expect(rootDiv).toHaveClass('min-h-screen', 'bg-gray-50', 'flex', 'flex-col');
  });
});