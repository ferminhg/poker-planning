import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HowItWorks from '../HowItWorks';

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

// Mock Math.random for consistent room ID generation
const mockMathRandom = jest.fn();
Object.defineProperty(global.Math, 'random', {
  value: mockMathRandom,
});

describe('HowItWorks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMathRandom.mockReturnValue(0.111222333);
  });

  it('renders the main heading and description', () => {
    render(<HowItWorks />);
    
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Get started with planning poker in 5 simple steps')).toBeInTheDocument();
  });

  it('renders all 5 steps in order', () => {
    render(<HowItWorks />);
    
    const expectedSteps = [
      'Create or Join Room',
      'Set Your Name', 
      'Add User Story',
      'Vote Simultaneously',
      'Reveal & Discuss'
    ];
    
    expectedSteps.forEach((step, index) => {
      expect(screen.getByText(step)).toBeInTheDocument();
      expect(screen.getByText((index + 1).toString())).toBeInTheDocument();
    });
  });

  it('renders step descriptions', () => {
    render(<HowItWorks />);
    
    expect(screen.getByText(/Start a new planning session or join/)).toBeInTheDocument();
    expect(screen.getByText(/Choose a display name so your teammates/)).toBeInTheDocument();
    expect(screen.getByText(/Enter the user story or feature/)).toBeInTheDocument();
    expect(screen.getByText(/Everyone selects their story point estimate/)).toBeInTheDocument();
    expect(screen.getByText(/Watch the dramatic countdown and reveal/)).toBeInTheDocument();
  });

  it('renders call to action section', () => {
    render(<HowItWorks />);
    
    expect(screen.getByText('Ready to Start Planning?')).toBeInTheDocument();
    expect(screen.getByText(/Create your first planning session/)).toBeInTheDocument();
    expect(screen.getByText('Start Planning Session')).toBeInTheDocument();
  });

  it('creates a new room when CTA button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<HowItWorks />);
    
    await user.click(screen.getByText('Start Planning Session'));
    
    expect(mockTrackRoomCreated).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledTimes(1);
    
    // Verify the format of the generated room ID
    const roomId = mockTrackRoomCreated.mock.calls[0][0];
    expect(roomId).toMatch(/^[a-z0-9]+$/);
    expect(roomId.length).toBeGreaterThan(5);
    expect(mockPush).toHaveBeenCalledWith(`/room/${roomId}`);
  });

  it('has correct section id for navigation', () => {
    render(<HowItWorks />);
    
    const section = screen.getByText('How It Works').closest('div')?.parentElement;
    expect(section).toHaveAttribute('id', 'how-it-works');
  });

  it('renders step numbers in circular badges', () => {
    render(<HowItWorks />);
    
    for (let i = 1; i <= 5; i++) {
      const stepNumber = screen.getByText(i.toString());
      const badge = stepNumber.closest('div');
      expect(badge).toHaveClass('w-12', 'h-12', 'bg-blue-600', 'text-white', 'rounded-full');
    }
  });

  it('renders SVG icons for each step', () => {
    render(<HowItWorks />);
    
    // Check that SVG elements are present
    const svgElements = screen.getByText('How It Works')
      .closest('div')
      ?.parentElement
      ?.querySelectorAll('svg');
    
    expect(svgElements).toHaveLength(5); // One for each step
  });

  it('applies correct layout classes', () => {
    render(<HowItWorks />);
    
    const mainSection = screen.getByText('How It Works').closest('div');
    expect(mainSection).toHaveClass('py-20', 'px-4');
    
    const stepsContainer = screen.getByText('Create or Join Room').closest('div')?.parentElement;
    expect(stepsContainer).toHaveClass('space-y-12');
  });
});