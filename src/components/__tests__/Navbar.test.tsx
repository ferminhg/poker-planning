import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../Navbar';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock analytics hook
const mockTrackRoomCreated = jest.fn();
jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackRoomCreated: mockTrackRoomCreated,
  }),
}));

// Mock ClientThemeToggle component
jest.mock('../ClientThemeToggle', () => {
  return function MockClientThemeToggle() {
    return <div data-testid="client-theme-toggle">Theme Toggle</div>;
  };
});

// Mock Math.random for consistent room ID generation
const mockMathRandom = jest.fn();
Object.defineProperty(global.Math, 'random', {
  value: mockMathRandom,
  configurable: true,
});

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMathRandom.mockReturnValue(0.555666777);
  });

  it('renders logo and navigation items', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Planning Poker')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('How it works')).toBeInTheDocument();
    expect(screen.getAllByTestId('client-theme-toggle')).toHaveLength(2); // Desktop and mobile
  });

  it('renders Start Session buttons for both desktop and mobile', () => {
    render(<Navbar />);
    
    const startSessionButtons = screen.getAllByText('Start Session');
    expect(startSessionButtons).toHaveLength(2); // Desktop and mobile versions
  });

  it('navigates to home when logo is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Navbar />);
    
    await user.click(screen.getByText('Planning Poker'));
    
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('creates a new room when Start Session button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Navbar />);
    
    const startSessionButtons = screen.getAllByText('Start Session');
    await user.click(startSessionButtons[0]); // Click the first one (desktop)
    
    expect(mockTrackRoomCreated).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledTimes(1);
    
    // Verify the format of the generated room ID
    const roomId = mockTrackRoomCreated.mock.calls[0][0];
    expect(roomId).toMatch(/^[a-z0-9]+$/);
    expect(roomId.length).toBeGreaterThan(5);
    expect(mockPush).toHaveBeenCalledWith(`/room/${roomId}`);
  });

  it('creates a new room when mobile Start Session button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Navbar />);
    
    const startSessionButtons = screen.getAllByText('Start Session');
    await user.click(startSessionButtons[1]); // Click the second one (mobile)
    
    expect(mockTrackRoomCreated).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledTimes(1);
    
    // Verify the format of the generated room ID
    const roomId = mockTrackRoomCreated.mock.calls[0][0];
    expect(roomId).toMatch(/^[a-z0-9]+$/);
    expect(roomId.length).toBeGreaterThan(5);
    expect(mockPush).toHaveBeenCalledWith(`/room/${roomId}`);
  });

  it('has correct navigation links with href attributes', () => {
    render(<Navbar />);
    
    const featuresLink = screen.getByText('Features');
    const howItWorksLink = screen.getByText('How it works');
    
    expect(featuresLink).toHaveAttribute('href', '#features');
    expect(howItWorksLink).toHaveAttribute('href', '#how-it-works');
  });

  it('applies correct CSS classes for responsive design', () => {
    render(<Navbar />);
    
    // Check for hidden class on desktop navigation
    const desktopNav = screen.getByText('Features').closest('div');
    expect(desktopNav).toHaveClass('hidden', 'md:flex');
    
    // Check for mobile menu
    const mobileMenu = screen.getAllByTestId('client-theme-toggle')[1].closest('div');
    expect(mobileMenu).toHaveClass('md:hidden');
  });

  it('renders navigation structure correctly', () => {
    render(<Navbar />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bg-white', 'dark:bg-gray-800', 'border-b');
    
    const container = nav.firstChild;
    expect(container).toHaveClass('max-w-7xl', 'mx-auto');
  });
});