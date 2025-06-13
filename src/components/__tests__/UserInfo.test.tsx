import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserInfo from '../UserInfo';

describe('UserInfo', () => {
  const defaultProps = {
    userName: 'John Doe',
    onChangeName: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user name', () => {
    render(<UserInfo {...defaultProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('You are:')).toBeInTheDocument();
  });

  it('renders change button', () => {
    render(<UserInfo {...defaultProps} />);
    
    expect(screen.getByText('Change')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onChangeName when change button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChangeName = jest.fn();
    
    render(<UserInfo {...defaultProps} onChangeName={mockOnChangeName} />);
    
    await user.click(screen.getByText('Change'));
    
    expect(mockOnChangeName).toHaveBeenCalledTimes(1);
  });

  it('displays different user names correctly', () => {
    const { rerender } = render(<UserInfo {...defaultProps} userName="Alice" />);
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    
    rerender(<UserInfo {...defaultProps} userName="Bob Smith" />);
    
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes for styling', () => {
    render(<UserInfo {...defaultProps} />);
    
    const container = screen.getByText('You are:').closest('div');
    expect(container).toHaveClass(
      'inline-flex',
      'items-center',
      'gap-2',
      'bg-blue-50',
      'dark:bg-blue-900/20',
      'border',
      'border-blue-200',
      'dark:border-blue-600',
      'rounded-md',
      'px-3',
      'py-1'
    );
  });

  it('applies correct text styling', () => {
    render(<UserInfo {...defaultProps} />);
    
    const label = screen.getByText('You are:');
    expect(label).toHaveClass('text-sm', 'text-gray-600', 'dark:text-gray-300');
    
    const userName = screen.getByText('John Doe');
    expect(userName).toHaveClass('font-medium', 'text-gray-800', 'dark:text-gray-200');
    
    const changeButton = screen.getByText('Change');
    expect(changeButton).toHaveClass(
      'ml-1',
      'text-blue-600',
      'dark:text-blue-400',
      'hover:text-blue-700',
      'dark:hover:text-blue-300',
      'text-sm',
      'hover:underline'
    );
  });

  it('renders with correct structure', () => {
    render(<UserInfo {...defaultProps} />);
    
    const container = screen.getByText('You are:').closest('div');
    
    // Should contain label, username, and button
    expect(container?.textContent).toContain('You are:');
    expect(container?.textContent).toContain('John Doe');
    expect(container?.textContent).toContain('Change');
  });
});