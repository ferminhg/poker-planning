import { render, screen } from '@testing-library/react';
import ParticipantCounter from '../ParticipantCounter';

describe('ParticipantCounter', () => {
  it('renders participant count with format', () => {
    render(<ParticipantCounter participantCount={3} maxParticipants={4} />);
    
    expect(screen.getByText('3/4 participants')).toBeInTheDocument();
  });

  it('renders with different participant counts', () => {
    const { rerender } = render(<ParticipantCounter participantCount={1} maxParticipants={5} />);
    
    expect(screen.getByText('1/5 participants')).toBeInTheDocument();
    
    rerender(<ParticipantCounter participantCount={0} maxParticipants={3} />);
    
    expect(screen.getByText('0/3 participants')).toBeInTheDocument();
    expect(screen.queryByText('1/5 participants')).not.toBeInTheDocument();
  });

  it('handles edge cases correctly', () => {
    render(<ParticipantCounter participantCount={4} maxParticipants={4} />);
    
    expect(screen.getByText('4/4 participants')).toBeInTheDocument();
  });

  it('handles zero participants', () => {
    render(<ParticipantCounter participantCount={0} maxParticipants={10} />);
    
    expect(screen.getByText('0/10 participants')).toBeInTheDocument();
  });

  it('applies correct CSS classes for styling', () => {
    render(<ParticipantCounter participantCount={2} maxParticipants={4} />);
    
    const container = screen.getByText('2/4 participants').closest('div');
    expect(container).toHaveClass(
      'inline-flex',
      'items-center',
      'gap-2',
      'bg-gray-100',
      'dark:bg-gray-700',
      'border',
      'border-gray-200',
      'dark:border-gray-600',
      'rounded-md',
      'px-3',
      'py-1'
    );
  });

  it('applies correct text styling', () => {
    render(<ParticipantCounter participantCount={1} maxParticipants={3} />);
    
    const text = screen.getByText('1/3 participants');
    expect(text).toHaveClass('text-sm', 'text-gray-600', 'dark:text-gray-300');
  });

  it('renders with large numbers', () => {
    render(<ParticipantCounter participantCount={99} maxParticipants={100} />);
    
    expect(screen.getByText('99/100 participants')).toBeInTheDocument();
  });

  it('maintains proper structure', () => {
    render(<ParticipantCounter participantCount={2} maxParticipants={4} />);
    
    const container = screen.getByText('2/4 participants').closest('div');
    
    // Should be a single container with the text
    expect(container?.children).toHaveLength(1);
    expect(container?.textContent).toBe('2/4 participants');
  });
});