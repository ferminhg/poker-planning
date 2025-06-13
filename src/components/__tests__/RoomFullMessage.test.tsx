import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoomFullMessage from '../RoomFullMessage';

describe('RoomFullMessage', () => {
  // Mock window.location
  const mockLocation = {
    href: '',
  };

  beforeEach(() => {
    mockLocation.href = '';
    // Mock window.location with configurable property
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
      configurable: true,
    });
  });

  it('renders room full message with correct content', () => {
    render(<RoomFullMessage roomId="abc123" />);
    
    expect(screen.getByText('Room is Full')).toBeInTheDocument();
    expect(screen.getByText('This room has reached its maximum capacity of 4 participants.')).toBeInTheDocument();
    expect(screen.getByText('Room: abc123')).toBeInTheDocument();
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });

  it('displays different room IDs correctly', () => {
    const { rerender } = render(<RoomFullMessage roomId="room123" />);
    
    expect(screen.getByText('Room: room123')).toBeInTheDocument();
    
    rerender(<RoomFullMessage roomId="xyz789" />);
    
    expect(screen.getByText('Room: xyz789')).toBeInTheDocument();
    expect(screen.queryByText('Room: room123')).not.toBeInTheDocument();
  });

  it('navigates to home when back button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<RoomFullMessage roomId="test123" />);
    
    await user.click(screen.getByText('Back to Home'));
    
    expect(mockLocation.href).toBe('/');
  });

  it('renders warning icon', () => {
    render(<RoomFullMessage roomId="test" />);
    
    const iconContainer = screen.getByText('Room is Full').parentElement?.querySelector('.bg-red-100');
    expect(iconContainer).toBeInTheDocument();
    
    const svg = iconContainer?.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-8', 'h-8', 'text-red-600');
  });

  it('applies correct CSS classes for styling', () => {
    render(<RoomFullMessage roomId="test" />);
    
    const mainContainer = screen.getByText('Room is Full').closest('div')?.parentElement?.parentElement;
    expect(mainContainer).toHaveClass('max-w-md', 'mx-auto', 'bg-white', 'border', 'border-red-200', 'rounded-lg', 'p-6');
    
    const roomIdText = screen.getByText(/Room: test/);
    expect(roomIdText).toHaveClass('text-sm', 'text-gray-500', 'font-mono');
    
    const button = screen.getByText('Back to Home');
    expect(button).toHaveClass('mt-4', 'bg-blue-600', 'hover:bg-blue-700', 'text-white', 'font-medium', 'py-2', 'px-4', 'rounded-md', 'transition-colors');
  });

  it('centers content correctly', () => {
    render(<RoomFullMessage roomId="test" />);
    
    const contentContainer = screen.getByText('Room is Full').closest('div');
    expect(contentContainer).toHaveClass('text-center');
  });

  it('handles special characters in room ID', () => {
    render(<RoomFullMessage roomId="room-123_test" />);
    
    expect(screen.getByText('Room: room-123_test')).toBeInTheDocument();
  });

  it('handles empty room ID', () => {
    render(<RoomFullMessage roomId="" />);
    
    expect(screen.getByText('Room: ')).toBeInTheDocument();
  });
});