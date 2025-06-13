import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareButton from '../ShareButton';

describe('ShareButton', () => {
  it('renders share button with text and icon', () => {
    const mockOnShare = jest.fn();
    
    render(<ShareButton onShare={mockOnShare} />);
    
    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onShare when clicked', async () => {
    const user = userEvent.setup();
    const mockOnShare = jest.fn();
    
    render(<ShareButton onShare={mockOnShare} />);
    
    await user.click(screen.getByRole('button'));
    
    expect(mockOnShare).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes for styling', () => {
    const mockOnShare = jest.fn();
    
    render(<ShareButton onShare={mockOnShare} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'bg-blue-600',
      'hover:bg-blue-700',
      'text-white',
      'font-medium',
      'py-2',
      'px-4',
      'rounded-md',
      'transition-colors',
      'flex',
      'items-center',
      'gap-2'
    );
  });

  it('renders SVG icon with correct attributes', () => {
    const mockOnShare = jest.fn();
    
    render(<ShareButton onShare={mockOnShare} />);
    
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-4', 'h-4');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('renders with correct button structure', () => {
    const mockOnShare = jest.fn();
    
    render(<ShareButton onShare={mockOnShare} />);
    
    const button = screen.getByRole('button');
    
    // Should have SVG and text content
    expect(button.querySelector('svg')).toBeInTheDocument();
    expect(button.textContent).toContain('Share');
  });
});