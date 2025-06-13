import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VotingControls from '../VotingControls';

describe('VotingControls', () => {
  const defaultProps = {
    votesRevealed: false,
    hasAnyVotes: false,
    onNewRound: jest.fn(),
    onResetVotes: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when no votes exist and votes not revealed', () => {
    render(<VotingControls {...defaultProps} />);
    
    expect(screen.queryByText('Reset Votes')).not.toBeInTheDocument();
    expect(screen.queryByText('New Round')).not.toBeInTheDocument();
  });

  it('shows Reset Votes button when there are votes but not revealed', () => {
    render(
      <VotingControls 
        {...defaultProps} 
        hasAnyVotes={true} 
        votesRevealed={false} 
      />
    );
    
    expect(screen.getByText('Reset Votes')).toBeInTheDocument();
    expect(screen.queryByText('New Round')).not.toBeInTheDocument();
  });

  it('shows New Round button when votes are revealed', () => {
    render(
      <VotingControls 
        {...defaultProps} 
        votesRevealed={true} 
      />
    );
    
    expect(screen.getByText('New Round')).toBeInTheDocument();
    expect(screen.queryByText('Reset Votes')).not.toBeInTheDocument();
  });

  it('does not show Reset Votes button when votes are revealed', () => {
    render(
      <VotingControls 
        {...defaultProps} 
        hasAnyVotes={true} 
        votesRevealed={true} 
      />
    );
    
    expect(screen.queryByText('Reset Votes')).not.toBeInTheDocument();
    expect(screen.getByText('New Round')).toBeInTheDocument();
  });

  it('calls onResetVotes when Reset Votes button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnResetVotes = jest.fn();
    
    render(
      <VotingControls 
        {...defaultProps} 
        hasAnyVotes={true} 
        votesRevealed={false}
        onResetVotes={mockOnResetVotes}
      />
    );
    
    await user.click(screen.getByText('Reset Votes'));
    
    expect(mockOnResetVotes).toHaveBeenCalledTimes(1);
  });

  it('calls onNewRound when New Round button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnNewRound = jest.fn();
    
    render(
      <VotingControls 
        {...defaultProps} 
        votesRevealed={true}
        onNewRound={mockOnNewRound}
      />
    );
    
    await user.click(screen.getByText('New Round'));
    
    expect(mockOnNewRound).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes to buttons', () => {
    const { rerender } = render(
      <VotingControls 
        {...defaultProps} 
        hasAnyVotes={true} 
        votesRevealed={false}
      />
    );
    
    const resetButton = screen.getByText('Reset Votes');
    expect(resetButton).toHaveClass('bg-orange-600', 'hover:bg-orange-700', 'text-white');
    
    rerender(
      <VotingControls 
        {...defaultProps} 
        votesRevealed={true}
      />
    );
    
    const newRoundButton = screen.getByText('New Round');
    expect(newRoundButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
  });
});