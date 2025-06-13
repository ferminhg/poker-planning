import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VotingCard from '../VotingCard';

describe('VotingCard', () => {
  it('renders with correct value', () => {
    render(<VotingCard value="5" />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();
    
    render(<VotingCard value="3" onClick={mockOnClick} />);
    
    await user.click(screen.getByRole('button'));
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies selected styles when isSelected is true', () => {
    render(<VotingCard value="8" isSelected={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-blue-600', 'bg-blue-600', 'text-white');
  });

  it('applies default styles when isSelected is false', () => {
    render(<VotingCard value="13" isSelected={false} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-gray-300', 'bg-white', 'text-gray-700');
  });

  it('is disabled when disabled prop is true', () => {
    render(<VotingCard value="21" disabled={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();
    
    render(<VotingCard value="1" onClick={mockOnClick} disabled={true} />);
    
    await user.click(screen.getByRole('button'));
    
    expect(mockOnClick).not.toHaveBeenCalled();
  });
});