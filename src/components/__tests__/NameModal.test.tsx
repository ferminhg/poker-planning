import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NameModal from '../NameModal';

describe('NameModal', () => {
  const defaultProps = {
    isOpen: true,
    tempName: '',
    onTempNameChange: jest.fn(),
    onSave: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(<NameModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Enter your name')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(<NameModal {...defaultProps} />);
    
    expect(screen.getByText('Enter your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('displays the current tempName value', () => {
    render(<NameModal {...defaultProps} tempName="John Doe" />);
    
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });

  it('calls onTempNameChange when input changes', async () => {
    const user = userEvent.setup();
    const mockOnTempNameChange = jest.fn();
    
    render(<NameModal {...defaultProps} onTempNameChange={mockOnTempNameChange} />);
    
    const input = screen.getByPlaceholderText('Your name');
    await user.type(input, 'Jane');
    
    expect(mockOnTempNameChange).toHaveBeenCalledTimes(4); // One call per character
    expect(mockOnTempNameChange).toHaveBeenLastCalledWith('Jane');
  });

  it('calls onSave when Save button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSave = jest.fn();
    
    render(<NameModal {...defaultProps} tempName="John" onSave={mockOnSave} />);
    
    await user.click(screen.getByText('Save'));
    
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('calls onSave when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const mockOnSave = jest.fn();
    
    render(<NameModal {...defaultProps} tempName="John" onSave={mockOnSave} />);
    
    const input = screen.getByPlaceholderText('Your name');
    await user.type(input, '{Enter}');
    
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('disables Save button when tempName is empty', () => {
    render(<NameModal {...defaultProps} tempName="" />);
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();
  });

  it('disables Save button when tempName is only whitespace', () => {
    render(<NameModal {...defaultProps} tempName="   " />);
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();
  });

  it('enables Save button when tempName has content', () => {
    render(<NameModal {...defaultProps} tempName="John" />);
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeEnabled();
  });

  it('shows Cancel button when userName is provided', () => {
    render(<NameModal {...defaultProps} userName="Existing User" />);
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('does not show Cancel button when userName is not provided', () => {
    render(<NameModal {...defaultProps} />);
    
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnCancel = jest.fn();
    
    render(<NameModal {...defaultProps} userName="Existing User" onCancel={mockOnCancel} />);
    
    await user.click(screen.getByText('Cancel'));
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});