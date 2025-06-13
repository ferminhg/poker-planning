import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '../ThemeToggle';

// Mock the ThemeContext
const mockToggleTheme = jest.fn();
const mockUseTheme = jest.fn();

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.log calls
    global.console.log = jest.fn();
    // Mock document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: {
        className: '',
      },
      writable: true,
    });
  });

  it('renders light theme button correctly', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);
    
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByTitle('Current theme: light. Click to switch.')).toBeInTheDocument();
  });

  it('renders dark theme button correctly', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);
    
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByTitle('Current theme: dark. Click to switch.')).toBeInTheDocument();
  });

  it('calls toggleTheme when clicked', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);
    
    await user.click(screen.getByRole('button'));
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('logs theme information when clicked', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);
    
    await user.click(screen.getByRole('button'));
    
    expect(console.log).toHaveBeenCalledWith('Toggle clicked, current theme:', 'light');
    expect(console.log).toHaveBeenCalledWith('HTML classes before toggle:', '');
  });
});