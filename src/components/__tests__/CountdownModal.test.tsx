import { render, screen, act } from '@testing-library/react';
import CountdownModal from '../CountdownModal';

// Mock timers
jest.useFakeTimers();

describe('CountdownModal', () => {
  const defaultProps = {
    isOpen: true,
    onComplete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('does not render when isOpen is false', () => {
    render(<CountdownModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Revealing votes in...')).not.toBeInTheDocument();
  });

  it('renders countdown modal when isOpen is true', () => {
    render(<CountdownModal {...defaultProps} />);
    
    expect(screen.getByText('Revealing votes in...')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('counts down from 3 to 1', async () => {
    render(<CountdownModal {...defaultProps} />);
    
    // Initially shows 3
    expect(screen.getByText('3')).toBeInTheDocument();
    
    // After 1 second, shows 2
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // After another second, shows 1
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows celebration emoji and text at the end', async () => {
    render(<CountdownModal {...defaultProps} />);
    
    // Fast forward through countdown
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    
    expect(screen.getByText('🎉')).toBeInTheDocument();
    expect(screen.getByText('Revealing votes!')).toBeInTheDocument();
  });

  it('calls onComplete after countdown finishes', async () => {
    const mockOnComplete = jest.fn();
    
    render(<CountdownModal {...defaultProps} onComplete={mockOnComplete} />);
    
    // Fast forward through countdown and completion delay
    await act(async () => {
      jest.advanceTimersByTime(4000); // 3 seconds countdown + 500ms delay + buffer
    });
    
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('resets countdown when isOpen changes from false to true', async () => {
    const { rerender } = render(<CountdownModal {...defaultProps} isOpen={false} />);
    
    // Start countdown
    rerender(<CountdownModal {...defaultProps} isOpen={true} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    
    // Advance time
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Close and reopen
    rerender(<CountdownModal {...defaultProps} isOpen={false} />);
    rerender(<CountdownModal {...defaultProps} isOpen={true} />);
    
    // Should reset to 3
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('applies correct CSS classes for styling', () => {
    render(<CountdownModal {...defaultProps} />);
    
    const overlay = screen.getByText('Revealing votes in...').closest('div')?.parentElement?.parentElement;
    expect(overlay).toHaveClass(
      'fixed',
      'inset-0',
      'bg-black',
      'bg-opacity-80',
      'flex',
      'items-center',
      'justify-center',
      'z-50'
    );
    
    const countdownNumber = screen.getByText('3');
    expect(countdownNumber).toHaveClass(
      'text-8xl',
      'font-bold',
      'text-white',
      'transition-all',
      'duration-500',
      'transform',
      'scale-100',
      'opacity-100',
      'animate-bounce'
    );
  });

  it('shows pulse ring animation during countdown', () => {
    render(<CountdownModal {...defaultProps} />);
    
    const pulseRing = screen.getByText('3').parentElement?.querySelector('.animate-ping');
    expect(pulseRing).toBeInTheDocument();
    expect(pulseRing).toHaveClass(
      'absolute',
      'inset-0',
      'rounded-full',
      'border-4',
      'border-blue-400',
      'animate-ping',
      'opacity-20'
    );
  });

  it('does not show pulse ring during celebration', () => {
    render(<CountdownModal {...defaultProps} />);
    
    // Fast forward to celebration
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    const pulseRing = screen.queryByText('🎉').parentElement?.querySelector('.animate-ping');
    expect(pulseRing).not.toBeInTheDocument();
  });

  it('applies scale transform for celebration emoji', () => {
    render(<CountdownModal {...defaultProps} />);
    
    // Fast forward to celebration
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    const celebrationEmoji = screen.getByText('🎉');
    expect(celebrationEmoji).toHaveClass('scale-150', 'opacity-0');
  });

  it('cleans up timers when component unmounts during countdown', async () => {
    const { unmount } = render(<CountdownModal {...defaultProps} />);
    
    // Start countdown
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    
    // Unmount during countdown
    unmount();
    
    // Advance time - onComplete should not be called
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    
    expect(defaultProps.onComplete).not.toHaveBeenCalled();
  });
});