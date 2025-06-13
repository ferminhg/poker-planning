import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ParticipantsList from '../ParticipantsList';
import { Participant } from '@/types';

// Mock ParticipantCard component
jest.mock('../ParticipantCard', () => {
  return function MockParticipantCard({ participant, votesRevealed }: { 
    participant: { id: string; name: string };
    votesRevealed: boolean;
  }) {
    return (
      <div data-testid={`participant-card-${participant.id}`}>
        {participant.name} - {votesRevealed ? 'revealed' : 'hidden'}
      </div>
    );
  };
});

const mockParticipants: Participant[] = [
  { id: '1', name: 'Alice', hasVoted: true, vote: '5' },
  { id: '2', name: 'Bob', hasVoted: false },
  { id: '3', name: 'Charlie', hasVoted: true, vote: '8' },
];

describe('ParticipantsList', () => {
  const defaultProps = {
    participants: mockParticipants,
    votesRevealed: false,
  };

  it('renders participants count in header', () => {
    render(<ParticipantsList {...defaultProps} />);
    
    expect(screen.getByText('Participants (3)')).toBeInTheDocument();
  });

  it('renders all participant cards', () => {
    render(<ParticipantsList {...defaultProps} />);
    
    expect(screen.getByTestId('participant-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('participant-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('participant-card-3')).toBeInTheDocument();
  });

  it('passes correct props to ParticipantCard components', () => {
    render(
      <ParticipantsList 
        {...defaultProps} 
        votesRevealed={true}
        currentUserId="1"
      />
    );
    
    expect(screen.getByText('Alice - revealed')).toBeInTheDocument();
    expect(screen.getByText('Bob - revealed')).toBeInTheDocument();
    expect(screen.getByText('Charlie - revealed')).toBeInTheDocument();
  });

  it('shows Reveal Votes button when all voted and votes not revealed', () => {
    const allVotedParticipants = mockParticipants.map(p => ({ ...p, hasVoted: true }));
    const mockOnRevealVotes = jest.fn();
    
    render(
      <ParticipantsList
        participants={allVotedParticipants}
        votesRevealed={false}
        allVoted={true}
        onRevealVotes={mockOnRevealVotes}
      />
    );
    
    expect(screen.getByText('Reveal Votes')).toBeInTheDocument();
  });

  it('does not show Reveal Votes button when not all voted', () => {
    const mockOnRevealVotes = jest.fn();
    
    render(
      <ParticipantsList
        {...defaultProps}
        allVoted={false}
        onRevealVotes={mockOnRevealVotes}
      />
    );
    
    expect(screen.queryByText('Reveal Votes')).not.toBeInTheDocument();
  });

  it('does not show Reveal Votes button when votes already revealed', () => {
    const allVotedParticipants = mockParticipants.map(p => ({ ...p, hasVoted: true }));
    const mockOnRevealVotes = jest.fn();
    
    render(
      <ParticipantsList
        participants={allVotedParticipants}
        votesRevealed={true}
        allVoted={true}
        onRevealVotes={mockOnRevealVotes}
      />
    );
    
    expect(screen.queryByText('Reveal Votes')).not.toBeInTheDocument();
  });

  it('does not show Reveal Votes button when onRevealVotes is not provided', () => {
    const allVotedParticipants = mockParticipants.map(p => ({ ...p, hasVoted: true }));
    
    render(
      <ParticipantsList
        participants={allVotedParticipants}
        votesRevealed={false}
        allVoted={true}
      />
    );
    
    expect(screen.queryByText('Reveal Votes')).not.toBeInTheDocument();
  });

  it('calls onRevealVotes when Reveal Votes button is clicked', async () => {
    const user = userEvent.setup();
    const allVotedParticipants = mockParticipants.map(p => ({ ...p, hasVoted: true }));
    const mockOnRevealVotes = jest.fn();
    
    render(
      <ParticipantsList
        participants={allVotedParticipants}
        votesRevealed={false}
        allVoted={true}
        onRevealVotes={mockOnRevealVotes}
      />
    );
    
    await user.click(screen.getByText('Reveal Votes'));
    
    expect(mockOnRevealVotes).toHaveBeenCalledTimes(1);
  });

  it('renders with empty participants list', () => {
    render(
      <ParticipantsList
        participants={[]}
        votesRevealed={false}
      />
    );
    
    expect(screen.getByText('Participants (0)')).toBeInTheDocument();
  });

  it('applies correct CSS classes for layout', () => {
    render(<ParticipantsList {...defaultProps} />);
    
    const container = screen.getByText('Participants (3)').closest('div');
    expect(container).toHaveClass('bg-white', 'border', 'border-gray-200', 'rounded-lg', 'p-4');
    
    const participantsGrid = screen.getByTestId('participant-card-1').parentElement;
    expect(participantsGrid).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-4', 'gap-3', 'pb-8');
  });

  it('renders SVG icon in Reveal Votes button', () => {
    const allVotedParticipants = mockParticipants.map(p => ({ ...p, hasVoted: true }));
    const mockOnRevealVotes = jest.fn();
    
    render(
      <ParticipantsList
        participants={allVotedParticipants}
        votesRevealed={false}
        allVoted={true}
        onRevealVotes={mockOnRevealVotes}
      />
    );
    
    const button = screen.getByText('Reveal Votes').closest('button');
    const svg = button?.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-4', 'h-4');
  });
});