import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VotingDeck from '../VotingDeck';

// Mock VotingCard component
jest.mock('../VotingCard', () => {
  return function MockVotingCard({ value, isSelected, onClick, disabled }: {
    value: string;
    isSelected: boolean;
    onClick: () => void;
    disabled: boolean;
  }) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        data-testid={`voting-card-${value}`}
        data-selected={isSelected}
      >
        {value}
      </button>
    );
  };
});

describe('VotingDeck', () => {
  const fibonacciValues = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '?', '☕'];

  it('renders all fibonacci voting cards', () => {
    render(<VotingDeck />);
    
    expect(screen.getByText('Choose your estimate')).toBeInTheDocument();
    
    fibonacciValues.forEach(value => {
      expect(screen.getByTestId(`voting-card-${value}`)).toBeInTheDocument();
    });
  });

  it('calls onVote when a card is clicked', async () => {
    const user = userEvent.setup();
    const mockOnVote = jest.fn();
    
    render(<VotingDeck onVote={mockOnVote} />);
    
    await user.click(screen.getByTestId('voting-card-5'));
    
    expect(mockOnVote).toHaveBeenCalledWith('5');
  });

  it('selects a card when clicked', async () => {
    const user = userEvent.setup();
    
    render(<VotingDeck />);
    
    await user.click(screen.getByTestId('voting-card-8'));
    
    const selectedCard = screen.getByTestId('voting-card-8');
    expect(selectedCard).toHaveAttribute('data-selected', 'true');
  });

  it('shows selected value text when a card is selected', async () => {
    const user = userEvent.setup();
    
    render(<VotingDeck />);
    
    await user.click(screen.getByTestId('voting-card-13'));
    
    expect(screen.getByText('Selected:')).toBeInTheDocument();
    // Look for the selected value in a more robust way
    const selectedElement = screen.getByText('Selected:').parentElement;
    expect(selectedElement).toHaveTextContent('Selected:13');
  });

  it('does not show selected value text when no card is selected', () => {
    render(<VotingDeck />);
    
    expect(screen.queryByText('Selected:')).not.toBeInTheDocument();
  });

  it('changes selection when different card is clicked', async () => {
    const user = userEvent.setup();
    
    render(<VotingDeck />);
    
    // Click first card
    await user.click(screen.getByTestId('voting-card-3'));
    expect(screen.getByTestId('voting-card-3')).toHaveAttribute('data-selected', 'true');
    
    // Click second card
    await user.click(screen.getByTestId('voting-card-21'));
    expect(screen.getByTestId('voting-card-3')).toHaveAttribute('data-selected', 'false');
    expect(screen.getByTestId('voting-card-21')).toHaveAttribute('data-selected', 'true');
  });

  it('disables all cards when disabled prop is true', () => {
    render(<VotingDeck disabled={true} />);
    
    fibonacciValues.forEach(value => {
      expect(screen.getByTestId(`voting-card-${value}`)).toBeDisabled();
    });
  });

  it('does not call onVote when disabled and card is clicked', async () => {
    const user = userEvent.setup();
    const mockOnVote = jest.fn();
    
    render(<VotingDeck onVote={mockOnVote} disabled={true} />);
    
    await user.click(screen.getByTestId('voting-card-5'));
    
    expect(mockOnVote).not.toHaveBeenCalled();
  });

  it('resets selection when resetSelection prop changes to true', () => {
    const { rerender } = render(<VotingDeck resetSelection={false} />);
    
    // Initially no cards should be selected
    fibonacciValues.forEach(value => {
      expect(screen.getByTestId(`voting-card-${value}`)).toHaveAttribute('data-selected', 'false');
    });
    
    rerender(<VotingDeck resetSelection={true} />);
    
    // After reset, still no cards should be selected
    fibonacciValues.forEach(value => {
      expect(screen.getByTestId(`voting-card-${value}`)).toHaveAttribute('data-selected', 'false');
    });
  });
});