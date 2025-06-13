import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Hero from '../Hero';

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

describe('Hero', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMathRandom.mockReturnValue(0.987654321);
  });

  it('renders main heading and subtitle', () => {
    render(<Hero />);
    
    expect(screen.getByText('Planning Poker for')).toBeInTheDocument();
    expect(screen.getByText('Agile Teams')).toBeInTheDocument();
    expect(screen.getByText(/Estimate user stories collaboratively/)).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<Hero />);
    
    expect(screen.getByText('Start Planning Session')).toBeInTheDocument();
    expect(screen.getByText('Join')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter room code')).toBeInTheDocument();
  });

  it('renders feature highlights', () => {
    render(<Hero />);
    
    expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    expect(screen.getByText('Remote Friendly')).toBeInTheDocument();
    expect(screen.getByText('Consensus Building')).toBeInTheDocument();
    
    expect(screen.getByText(/No registration required/)).toBeInTheDocument();
    expect(screen.getByText(/Perfect for distributed teams/)).toBeInTheDocument();
    expect(screen.getByText(/Reveal votes simultaneously/)).toBeInTheDocument();
  });

  it('creates a new room when Start Planning Session is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Hero />);
    
    await user.click(screen.getByText('Start Planning Session'));
    
    expect(mockTrackRoomCreated).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledTimes(1);
    
    // Verify the format of the generated room ID
    const roomId = mockTrackRoomCreated.mock.calls[0][0];
    expect(roomId).toMatch(/^[a-z0-9]+$/);
    expect(roomId.length).toBeGreaterThan(5);
    expect(mockPush).toHaveBeenCalledWith(`/room/${roomId}`);
  });

  it('updates room code input when typing', async () => {
    const user = userEvent.setup();
    
    render(<Hero />);
    
    const input = screen.getByPlaceholderText('Enter room code');
    await user.type(input, 'test123');
    
    expect(input).toHaveValue('test123');
  });

  it('joins room when Join button is clicked with valid code', async () => {
    const user = userEvent.setup();
    
    render(<Hero />);
    
    const input = screen.getByPlaceholderText('Enter room code');
    await user.type(input, 'hero123');
    await user.click(screen.getByText('Join'));
    
    expect(mockPush).toHaveBeenCalledWith('/room/hero123');
  });

  it('trims whitespace from room code when joining', async () => {
    const user = userEvent.setup();
    
    render(<Hero />);
    
    const input = screen.getByPlaceholderText('Enter room code');
    await user.type(input, '  hero456  ');
    await user.click(screen.getByText('Join'));
    
    expect(mockPush).toHaveBeenCalledWith('/room/hero456');
  });

  it('disables Join button when room code is empty', () => {
    render(<Hero />);
    
    const joinButton = screen.getByText('Join');
    expect(joinButton).toBeDisabled();
  });

  it('enables Join button when room code has content', async () => {
    const user = userEvent.setup();
    
    render(<Hero />);
    
    const input = screen.getByPlaceholderText('Enter room code');
    const joinButton = screen.getByText('Join');
    
    expect(joinButton).toBeDisabled();
    
    await user.type(input, 'test');
    
    expect(joinButton).toBeEnabled();
  });

  it('joins room when Enter key is pressed with valid code', async () => {
    const user = userEvent.setup();
    
    render(<Hero />);
    
    const input = screen.getByPlaceholderText('Enter room code');
    await user.type(input, 'hero789{Enter}');
    
    expect(mockPush).toHaveBeenCalledWith('/room/hero789');
  });

  it('does not join room when Enter key is pressed with empty code', async () => {
    const user = userEvent.setup();
    
    render(<Hero />);
    
    const input = screen.getByPlaceholderText('Enter room code');
    await user.type(input, '{Enter}');
    
    expect(mockPush).not.toHaveBeenCalled();
  });
});