import { render, screen } from '@testing-library/react';
import HeaderActions from '../HeaderActions';

// Mock child components
jest.mock('../ClientThemeToggle', () => {
  return function MockClientThemeToggle() {
    return <div data-testid="client-theme-toggle">Theme Toggle</div>;
  };
});

jest.mock('../ShareButton', () => {
  return function MockShareButton({ onShare }: { onShare: () => void }) {
    return <button data-testid="share-button" onClick={onShare}>Share</button>;
  };
});

describe('HeaderActions', () => {
  it('always renders theme toggle', () => {
    render(<HeaderActions />);
    
    expect(screen.getByTestId('client-theme-toggle')).toBeInTheDocument();
  });

  it('renders share button when onShareRoom is provided', () => {
    const mockOnShareRoom = jest.fn();
    
    render(<HeaderActions onShareRoom={mockOnShareRoom} />);
    
    expect(screen.getByTestId('share-button')).toBeInTheDocument();
  });

  it('does not render share button when onShareRoom is not provided', () => {
    render(<HeaderActions />);
    
    expect(screen.queryByTestId('share-button')).not.toBeInTheDocument();
  });

  it('passes onShareRoom correctly to ShareButton', () => {
    const mockOnShareRoom = jest.fn();
    
    render(<HeaderActions onShareRoom={mockOnShareRoom} />);
    
    const shareButton = screen.getByTestId('share-button');
    shareButton.click();
    
    expect(mockOnShareRoom).toHaveBeenCalledTimes(1);
  });

  it('applies correct layout classes', () => {
    render(<HeaderActions />);
    
    const container = screen.getByTestId('client-theme-toggle').parentElement;
    expect(container).toHaveClass('flex', 'items-center', 'gap-3');
  });

  it('renders both components when share is available', () => {
    const mockOnShareRoom = jest.fn();
    
    render(<HeaderActions onShareRoom={mockOnShareRoom} />);
    
    expect(screen.getByTestId('client-theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('share-button')).toBeInTheDocument();
  });

  it('renders only theme toggle when share is not available', () => {
    render(<HeaderActions />);
    
    expect(screen.getByTestId('client-theme-toggle')).toBeInTheDocument();
    expect(screen.queryByTestId('share-button')).not.toBeInTheDocument();
  });

  it('maintains correct structure with conditional rendering', () => {
    const { rerender } = render(<HeaderActions />);
    
    let container = screen.getByTestId('client-theme-toggle').parentElement;
    expect(container?.children).toHaveLength(1);
    
    const mockOnShareRoom = jest.fn();
    rerender(<HeaderActions onShareRoom={mockOnShareRoom} />);
    
    container = screen.getByTestId('client-theme-toggle').parentElement;
    expect(container?.children).toHaveLength(2);
  });
});