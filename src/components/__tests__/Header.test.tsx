import { render, screen } from '@testing-library/react';
import Header from '../Header';

// Mock ThemeToggle component
jest.mock('../ThemeToggle', () => {
  return function MockThemeToggle() {
    return <div data-testid="theme-toggle">Theme Toggle</div>;
  };
});

describe('Header', () => {
  it('renders with default props', () => {
    render(<Header />);
    
    expect(screen.getByText('Planning Poker')).toBeInTheDocument();
    expect(screen.getByText('Collaborative story point estimation for agile teams')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('renders with custom title and subtitle', () => {
    render(
      <Header 
        title="Custom Title" 
        subtitle="Custom Subtitle" 
      />
    );
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(
      <Header>
        <div data-testid="child-content">Child Content</div>
      </Header>
    );
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('does not render theme toggle when showThemeToggle is false', () => {
    render(<Header showThemeToggle={false} />);
    
    expect(screen.queryByTestId('theme-toggle')).not.toBeInTheDocument();
  });
});