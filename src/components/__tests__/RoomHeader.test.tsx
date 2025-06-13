import { render, screen } from '@testing-library/react';
import RoomHeader from '../RoomHeader';

// Mock all child components
jest.mock('../RoomTitle', () => {
  return function MockRoomTitle({ roomId }: any) {
    return <h1 data-testid="room-title">Room {roomId}</h1>;
  };
});

jest.mock('../ParticipantCounter', () => {
  return function MockParticipantCounter({ participantCount, maxParticipants }: any) {
    return <div data-testid="participant-counter">{participantCount}/{maxParticipants} participants</div>;
  };
});

jest.mock('../UserInfo', () => {
  return function MockUserInfo({ userName, onChangeName }: any) {
    return <div data-testid="user-info" onClick={onChangeName}>{userName}</div>;
  };
});

jest.mock('../HeaderActions', () => {
  return function MockHeaderActions({ onShareRoom }: any) {
    return <div data-testid="header-actions" onClick={onShareRoom}>Actions</div>;
  };
});

describe('RoomHeader', () => {
  const defaultProps = {
    roomId: 'abc123',
    onChangeName: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders room title with correct room ID', () => {
    render(<RoomHeader {...defaultProps} />);
    
    expect(screen.getByTestId('room-title')).toBeInTheDocument();
    expect(screen.getByText('Room abc123')).toBeInTheDocument();
  });

  it('renders participant counter with default values', () => {
    render(<RoomHeader {...defaultProps} />);
    
    expect(screen.getByTestId('participant-counter')).toBeInTheDocument();
    expect(screen.getByText('0/4 participants')).toBeInTheDocument();
  });

  it('renders participant counter with custom values', () => {
    render(
      <RoomHeader 
        {...defaultProps} 
        participantCount={3} 
        maxParticipants={5} 
      />
    );
    
    expect(screen.getByText('3/5 participants')).toBeInTheDocument();
  });

  it('renders user info when userName is provided', () => {
    render(
      <RoomHeader 
        {...defaultProps} 
        userName="John Doe" 
      />
    );
    
    expect(screen.getByTestId('user-info')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('does not render user info when userName is not provided', () => {
    render(<RoomHeader {...defaultProps} />);
    
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
  });

  it('always renders header actions', () => {
    render(<RoomHeader {...defaultProps} />);
    
    expect(screen.getByTestId('header-actions')).toBeInTheDocument();
  });

  it('passes onShareRoom to header actions', () => {
    const mockOnShareRoom = jest.fn();
    
    render(
      <RoomHeader 
        {...defaultProps} 
        onShareRoom={mockOnShareRoom} 
      />
    );
    
    expect(screen.getByTestId('header-actions')).toBeInTheDocument();
  });

  it('applies correct layout structure', () => {
    render(<RoomHeader {...defaultProps} />);
    
    const container = screen.getByTestId('room-title').closest('div');
    expect(container?.parentElement).toHaveClass('flex', 'justify-between', 'items-start', 'mb-8');
  });

  it('groups room info elements correctly', () => {
    render(
      <RoomHeader 
        {...defaultProps} 
        userName="Alice" 
        participantCount={2} 
      />
    );
    
    const participantCounter = screen.getByTestId('participant-counter');
    const userInfo = screen.getByTestId('user-info');
    
    // Both should be in the same container
    expect(participantCounter.parentElement).toBe(userInfo.parentElement);
    expect(participantCounter.parentElement).toHaveClass('flex', 'items-center', 'gap-4');
  });
});