import { render, screen } from '@testing-library/react';
import RoomTitle from '../RoomTitle';

describe('RoomTitle', () => {
  it('renders room title with room ID', () => {
    render(<RoomTitle roomId="abc123" />);
    
    expect(screen.getByText('Room abc123')).toBeInTheDocument();
  });

  it('renders with different room IDs', () => {
    const { rerender } = render(<RoomTitle roomId="room1" />);
    
    expect(screen.getByText('Room room1')).toBeInTheDocument();
    
    rerender(<RoomTitle roomId="xyz789" />);
    
    expect(screen.getByText('Room xyz789')).toBeInTheDocument();
    expect(screen.queryByText('Room room1')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes for styling', () => {
    render(<RoomTitle roomId="test123" />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass(
      'text-4xl',
      'font-bold',
      'text-gray-900',
      'dark:text-gray-100',
      'mb-3'
    );
  });

  it('renders as h1 element', () => {
    render(<RoomTitle roomId="test456" />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('handles special characters in room ID', () => {
    render(<RoomTitle roomId="room-123_test" />);
    
    expect(screen.getByText('Room room-123_test')).toBeInTheDocument();
  });

  it('handles empty room ID', () => {
    render(<RoomTitle roomId="" />);
    
    expect(screen.getByText(/^Room\s*$/)).toBeInTheDocument();
  });
});