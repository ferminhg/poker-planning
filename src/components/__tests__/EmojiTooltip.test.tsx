import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmojiTooltip from '../EmojiTooltip';

describe('EmojiTooltip', () => {
  const defaultProps = {
    onEmojiSelect: jest.fn(),
    isVisible: true,
    position: { x: 100, y: 100 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isVisible is false', () => {
    render(<EmojiTooltip {...defaultProps} isVisible={false} />);
    
    expect(screen.queryByText('👍')).not.toBeInTheDocument();
  });

  it('renders all emoji options when visible', () => {
    render(<EmojiTooltip {...defaultProps} />);
    
    expect(screen.getByText('👍')).toBeInTheDocument();
    expect(screen.getByText('👎')).toBeInTheDocument();
    expect(screen.getByText('❤️')).toBeInTheDocument();
    expect(screen.getByText('😂')).toBeInTheDocument();
  });

  it('calls onEmojiSelect when emoji button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnEmojiSelect = jest.fn();
    
    render(<EmojiTooltip {...defaultProps} onEmojiSelect={mockOnEmojiSelect} />);
    
    await user.click(screen.getByText('👍'));
    
    expect(mockOnEmojiSelect).toHaveBeenCalledWith('👍');
    expect(mockOnEmojiSelect).toHaveBeenCalledTimes(1);
  });

  it('calls onEmojiSelect with correct emoji for each button', async () => {
    const user = userEvent.setup();
    const mockOnEmojiSelect = jest.fn();
    
    render(<EmojiTooltip {...defaultProps} onEmojiSelect={mockOnEmojiSelect} />);
    
    await user.click(screen.getByText('👎'));
    expect(mockOnEmojiSelect).toHaveBeenCalledWith('👎');
    
    await user.click(screen.getByText('❤️'));
    expect(mockOnEmojiSelect).toHaveBeenCalledWith('❤️');
    
    await user.click(screen.getByText('😂'));
    expect(mockOnEmojiSelect).toHaveBeenCalledWith('😂');
  });

  it('positions tooltip correctly based on position prop', () => {
    render(<EmojiTooltip {...defaultProps} position={{ x: 200, y: 150 }} />);
    
    const tooltip = screen.getByText('👍').closest('div')?.parentElement;
    expect(tooltip).toHaveStyle({
      left: '200px',
      top: '90px', // y - 60
      transform: 'translateX(-50%)',
    });
  });

  it('applies correct CSS classes for styling', () => {
    render(<EmojiTooltip {...defaultProps} />);
    
    const tooltip = screen.getByText('👍').closest('div')?.parentElement;
    expect(tooltip).toHaveClass(
      'absolute',
      'z-50',
      'bg-white',
      'border',
      'border-gray-200',
      'rounded-lg',
      'p-2',
      'shadow-lg'
    );
    
    const emojiContainer = screen.getByText('👍').parentElement;
    expect(emojiContainer).toHaveClass('flex', 'space-x-2');
  });

  it('applies correct styling to emoji buttons', () => {
    render(<EmojiTooltip {...defaultProps} />);
    
    const emojiButton = screen.getByText('👍');
    expect(emojiButton).toHaveClass(
      'w-8',
      'h-8',
      'flex',
      'items-center',
      'justify-center',
      'hover:bg-gray-100',
      'rounded-md',
      'transition-colors',
      'text-lg'
    );
  });

  it('has correct title attributes for accessibility', () => {
    render(<EmojiTooltip {...defaultProps} />);
    
    expect(screen.getByText('👍')).toHaveAttribute('title', 'Send 👍');
    expect(screen.getByText('👎')).toHaveAttribute('title', 'Send 👎');
    expect(screen.getByText('❤️')).toHaveAttribute('title', 'Send ❤️');
    expect(screen.getByText('😂')).toHaveAttribute('title', 'Send 😂');
  });

  it('calls mouse event handlers when provided', async () => {
    const user = userEvent.setup();
    const mockOnMouseEnter = jest.fn();
    const mockOnMouseLeave = jest.fn();
    
    render(
      <EmojiTooltip 
        {...defaultProps} 
        onMouseEnter={mockOnMouseEnter}
        onMouseLeave={mockOnMouseLeave}
      />
    );
    
    const tooltip = screen.getByText('👍').closest('div');
    
    await user.hover(tooltip!);
    expect(mockOnMouseEnter).toHaveBeenCalledTimes(1);
    
    await user.unhover(tooltip!);
    expect(mockOnMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('renders arrow pointing down', () => {
    render(<EmojiTooltip {...defaultProps} />);
    
    const tooltip = screen.getByText('👍').closest('div')?.parentElement;
    const arrow = tooltip?.querySelector('.border-t-gray-200');
    
    expect(arrow).toBeInTheDocument();
    expect(arrow).toHaveClass(
      'absolute',
      'top-full',
      'left-1/2',
      'transform',
      '-translate-x-1/2',
      'w-0',
      'h-0',
      'border-l-4',
      'border-r-4',
      'border-t-4',
      'border-l-transparent',
      'border-r-transparent',
      'border-t-gray-200'
    );
  });
});