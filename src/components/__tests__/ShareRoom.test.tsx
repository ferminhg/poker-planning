import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareRoom from '../ShareRoom';

// Mock analytics hook
const mockTrackRoomShared = jest.fn();
jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackRoomShared: mockTrackRoomShared,
  }),
}));

// Mock navigator.clipboard
const mockWriteText = jest.fn();
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
});

// Mock window.location will be done in beforeEach

// Mock setTimeout
let mockSetTimeout: jest.Mock;

describe('ShareRoom', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://example.com',
      },
      writable: true,
      configurable: true,
    });
    
    mockSetTimeout = jest.fn((fn, delay) => {
      if (delay === 2000) {
        // For the copied state reset, execute immediately for testing
        fn();
      }
      return 123; // Mock timer ID
    });
    global.setTimeout = mockSetTimeout;
  });

  const defaultProps = {
    roomId: 'abc123',
    isOpen: true,
    onClose: jest.fn(),
  };

  it('does not render when isOpen is false', () => {
    render(<ShareRoom {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Invite Others')).not.toBeInTheDocument();
  });

  it('renders modal content when isOpen is true', () => {
    render(<ShareRoom {...defaultProps} />);
    
    expect(screen.getByText('Invite Others')).toBeInTheDocument();
    expect(screen.getByText('Room Link')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/room/abc123')).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('generates correct room URL', () => {
    render(<ShareRoom {...defaultProps} roomId="test123" />);
    
    expect(screen.getByDisplayValue('https://example.com/room/test123')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = jest.fn();
    
    render(<ShareRoom {...defaultProps} onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('copies room URL to clipboard when copy button is clicked', async () => {
    const user = userEvent.setup();
    mockWriteText.mockResolvedValue(undefined);
    
    render(<ShareRoom {...defaultProps} />);
    
    await user.click(screen.getByText('Copy'));
    
    expect(mockWriteText).toHaveBeenCalledWith('https://example.com/room/abc123');
    expect(mockTrackRoomShared).toHaveBeenCalledWith('abc123');
  });

  it('shows "Copied!" text after successful copy', async () => {
    const user = userEvent.setup();
    mockWriteText.mockResolvedValue(undefined);
    
    render(<ShareRoom {...defaultProps} />);
    
    expect(screen.getByText('Copy')).toBeInTheDocument();
    
    await user.click(screen.getByText('Copy'));
    
    expect(screen.getByText('Copied!')).toBeInTheDocument();
    expect(screen.queryByText('Copy')).not.toBeInTheDocument();
  });

  it('resets copy button text after timeout', async () => {
    const user = userEvent.setup();
    mockWriteText.mockResolvedValue(undefined);
    
    render(<ShareRoom {...defaultProps} />);
    
    await user.click(screen.getByText('Copy'));
    
    expect(screen.getByText('Copied!')).toBeInTheDocument();
    expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 2000);
    
    // The timeout should reset the text back to "Copy"
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('handles clipboard copy failure gracefully', async () => {
    const user = userEvent.setup();
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockWriteText.mockRejectedValue(new Error('Clipboard error'));
    
    render(<ShareRoom {...defaultProps} />);
    
    await user.click(screen.getByText('Copy'));
    
    expect(mockConsoleError).toHaveBeenCalledWith('Failed to copy:', expect.any(Error));
    
    mockConsoleError.mockRestore();
  });

  it('renders modal overlay with correct styling', () => {
    render(<ShareRoom {...defaultProps} />);
    
    const overlay = screen.getByText('Invite Others').closest('div')?.parentElement;
    expect(overlay).toHaveClass(
      'fixed',
      'inset-0',
      'bg-black',
      'bg-opacity-50',
      'flex',
      'items-center',
      'justify-center',
      'z-50'
    );
  });

  it('input field is read-only', () => {
    render(<ShareRoom {...defaultProps} />);
    
    const input = screen.getByDisplayValue('https://example.com/room/abc123');
    expect(input).toHaveAttribute('readOnly');
  });

  it('renders informational text about room capacity', () => {
    render(<ShareRoom {...defaultProps} />);
    
    expect(screen.getByText(/Share this link with your team members/)).toBeInTheDocument();
    expect(screen.getByText(/Up to 4 participants can join/)).toBeInTheDocument();
  });

  it('renders close button with correct icon', () => {
    render(<ShareRoom {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    const svg = closeButton.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-6', 'h-6');
  });

  it('handles empty room URL when window is undefined', () => {
    // Temporarily remove window for SSR simulation
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;
    
    render(<ShareRoom {...defaultProps} />);
    
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
    
    // Restore window
    global.window = originalWindow;
  });
});