import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StoryInput from '../StoryInput';

describe('StoryInput', () => {
  it('renders with correct title and placeholder', () => {
    const mockOnChange = jest.fn();
    
    render(<StoryInput value="" onChange={mockOnChange} />);
    
    expect(screen.getByText('Current Story')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. GRY-1234')).toBeInTheDocument();
    expect(screen.getByText('Enter ticket format: GRY-XYZ')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    const mockOnChange = jest.fn();
    
    render(<StoryInput value="GRY-123" onChange={mockOnChange} />);
    
    const input = screen.getByDisplayValue('GRY-123');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    const mockOnChange = jest.fn();
    
    render(<StoryInput value="" onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('e.g. GRY-1234');
    
    // Use fireEvent for more predictable behavior
    fireEvent.change(input, { target: { value: 'GRY-456' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('GRY-456');
  });

  it('updates value when prop changes', () => {
    const mockOnChange = jest.fn();
    const { rerender } = render(<StoryInput value="GRY-123" onChange={mockOnChange} />);
    
    expect(screen.getByDisplayValue('GRY-123')).toBeInTheDocument();
    
    rerender(<StoryInput value="GRY-456" onChange={mockOnChange} />);
    
    expect(screen.getByDisplayValue('GRY-456')).toBeInTheDocument();
  });
});