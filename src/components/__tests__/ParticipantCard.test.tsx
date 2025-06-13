import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ParticipantCard from '../ParticipantCard';
import { Participant } from '@/types';

const mockParticipant: Participant = {
  id: 'user-1',
  name: 'John Doe',
  hasVoted: false,
};

describe('ParticipantCard', () => {
  it('renders participant name', () => {
    render(
      <ParticipantCard 
        participant={mockParticipant} 
        votesRevealed={false} 
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('shows "Waiting..." when participant has not voted', () => {
    render(
      <ParticipantCard 
        participant={mockParticipant} 
        votesRevealed={false} 
      />
    );
    
    expect(screen.getByText('Waiting...')).toBeInTheDocument();
  });

  it('shows "✓ Voted" when participant has voted but votes not revealed', () => {
    const votedParticipant = { ...mockParticipant, hasVoted: true };
    
    render(
      <ParticipantCard 
        participant={votedParticipant} 
        votesRevealed={false} 
      />
    );
    
    expect(screen.getByText('✓ Voted')).toBeInTheDocument();
  });

  it('shows vote value when votes are revealed', () => {
    const votedParticipant = { 
      ...mockParticipant, 
      hasVoted: true, 
      vote: '5' 
    };
    
    render(
      <ParticipantCard 
        participant={votedParticipant} 
        votesRevealed={true} 
      />
    );
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('applies voted styles when participant has voted', () => {
    const votedParticipant = { ...mockParticipant, hasVoted: true };
    
    render(
      <ParticipantCard 
        participant={votedParticipant} 
        votesRevealed={false} 
      />
    );
    
    const card = screen.getByText('John Doe').closest('div');
    expect(card).toHaveClass('border-green-300', 'bg-green-50');
  });

  it('shows emoji tooltip on hover for other users', async () => {
    const user = userEvent.setup();
    const mockOnSendEmoji = jest.fn();
    
    render(
      <ParticipantCard 
        participant={mockParticipant} 
        votesRevealed={false}
        onSendEmoji={mockOnSendEmoji}
        currentUserId="current-user"
      />
    );
    
    const container = screen.getByText('John Doe').closest('div')?.parentElement;
    if (container) {
      await user.hover(container);
      
      expect(screen.getByText('👍')).toBeInTheDocument();
      expect(screen.getByText('👎')).toBeInTheDocument();
      expect(screen.getByText('❤️')).toBeInTheDocument();
      expect(screen.getByText('😂')).toBeInTheDocument();
    }
  });

  it('calls onSendEmoji when emoji is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSendEmoji = jest.fn();
    
    render(
      <ParticipantCard 
        participant={mockParticipant} 
        votesRevealed={false}
        onSendEmoji={mockOnSendEmoji}
        currentUserId="current-user"
      />
    );
    
    const container = screen.getByText('John Doe').closest('div')?.parentElement;
    if (container) {
      await user.hover(container);
      await user.click(screen.getByText('👍'));
      
      expect(mockOnSendEmoji).toHaveBeenCalledWith('user-1', '👍', expect.any(HTMLElement));
    }
  });

  it('does not show emoji tooltip for current user', async () => {
    const user = userEvent.setup();
    const mockOnSendEmoji = jest.fn();
    
    render(
      <ParticipantCard 
        participant={mockParticipant} 
        votesRevealed={false}
        onSendEmoji={mockOnSendEmoji}
        currentUserId="user-1" // Same as participant ID
      />
    );
    
    const container = screen.getByText('John Doe').closest('div')?.parentElement;
    if (container) {
      await user.hover(container);
      
      expect(screen.queryByText('👍')).not.toBeInTheDocument();
    }
  });

  it('displays received emojis', () => {
    const participantWithEmojis = {
      ...mockParticipant,
      receivedEmojis: ['👍', '❤️', '😂']
    };
    
    render(
      <ParticipantCard 
        participant={participantWithEmojis} 
        votesRevealed={false} 
      />
    );
    
    expect(screen.getByText('👍')).toBeInTheDocument();
    expect(screen.getByText('❤️')).toBeInTheDocument();
    expect(screen.getByText('😂')).toBeInTheDocument();
  });
});