import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoomCard from '../RoomCard';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock analytics hook
const mockTrackRoomCreated = jest.fn();
jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackRoomCreated: mockTrackRoomCreated,
  }),
}));

// Mock Math.random for consistent room ID generation
const mockMathRandom = jest.fn();
Object.defineProperty(global.Math, 'random', {
  value: mockMathRandom,
  configurable: true,
});

describe('RoomCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMathRandom.mockReturnValue(0.123456789);
  });

  it('renders create and join room options', () => {
    render(<RoomCard />);
    
    expect(screen.getByText('Create New Room')).toBeInTheDocument();
    expect(screen.getByText('or')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter room code')).toBeInTheDocument();
    expect(screen.getByText('Join Room')).toBeInTheDocument();
  });

  it('creates a new room when Create New Room button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<RoomCard />);
    
    await user.click(screen.getByText('Create New Room'));
    
    expect(mockTrackRoomCreated).toHaveBeenCalledWith('4fzzzxjylrx');
    expect(mockPush).toHaveBeenCalledWith('/room/4fzzzxjylrx');
  });

  it('updates room code input when typing', async () => {
    const user = userEvent.setup();
    
    render(<RoomCard />);
    
    const input = screen.getByPlaceholderText('Enter room code');
    await user.type(input, 'abc123');
    
    expect(input).toHaveValue('abc123');
  });

  it('joins room when Join Room button is clicked with valid code', async () => {
    const user = userEvent.setup();
    
    render(<RoomCard />);
    
    const input = screen.getByPlaceholderText('Enter room code');
    await user.type(input, 'room123');
    await user.click(screen.getByText('Join Room'));
    
    expect(mockPush).toHaveBeenCalledWith('/room/room123');
  });

  it('trims whitespace from room code when joining', async () => {
    const user = userEvent.setup();
    
    render(<RoomCard />);
    
    const input = screen.getByPlaceholderText('Enter room code');
    await user.type(input, '  room123  ');
    await user.click(screen.getByText('Join Room'));
    
    expect(mockPush).toHaveBeenCalledWith('/room/room123');
  });

  it('does not join room when room code is empty', async () => {
    const user = userEvent.setup();
    
    render(<RoomCard />);
    
    await user.click(screen.getByText('Join Room'));
    
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not join room when room code is only whitespace', async () => {
    const user = userEvent.setup();
    
    render(<RoomCard />);
    
    const input = screen.getByPlaceholderText('Enter room code');
    await user.type(input, '   ');
    await user.click(screen.getByText('Join Room'));
    
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('joins room when Enter key is pressed with valid code', async () => {
    const user = userEvent.setup();
    
    render(<RoomCard />);
    
    const input = screen.getByPlaceholderText('Enter room code');
    await user.type(input, 'room456{Enter}');
    
    expect(mockPush).toHaveBeenCalledWith('/room/room456');
  });

  it('does not join room when Enter key is pressed with empty code', async () => {
    const user = userEvent.setup();
    
    render(<RoomCard />);
    
    const input = screen.getByPlaceholderText('Enter room code');
    await user.type(input, '{Enter}');
    
    expect(mockPush).not.toHaveBeenCalled();
  });
});