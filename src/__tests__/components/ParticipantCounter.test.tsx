import { render, screen } from '@testing-library/react'
import ParticipantCounter from '@/components/ParticipantCounter'

describe('ParticipantCounter', () => {
  it('displays correct participant count and max participants', () => {
    render(<ParticipantCounter participantCount={2} maxParticipants={4} />)
    
    expect(screen.getByText('2/4 participants')).toBeInTheDocument()
  })

  it('handles zero participants', () => {
    render(<ParticipantCounter participantCount={0} maxParticipants={4} />)
    
    expect(screen.getByText('0/4 participants')).toBeInTheDocument()
  })

  it('handles full room', () => {
    render(<ParticipantCounter participantCount={4} maxParticipants={4} />)
    
    expect(screen.getByText('4/4 participants')).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    render(<ParticipantCounter participantCount={2} maxParticipants={4} />)
    
    const container = screen.getByText('2/4 participants').parentElement
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
    )
  })

  it('handles different max participant values', () => {
    render(<ParticipantCounter participantCount={1} maxParticipants={8} />)
    
    expect(screen.getByText('1/8 participants')).toBeInTheDocument()
  })

  it('handles edge case with participant count exceeding max', () => {
    render(<ParticipantCounter participantCount={5} maxParticipants={4} />)
    
    expect(screen.getByText('5/4 participants')).toBeInTheDocument()
  })

  it('has correct text styling', () => {
    render(<ParticipantCounter participantCount={2} maxParticipants={4} />)
    
    const text = screen.getByText('2/4 participants')
    expect(text).toHaveClass('text-sm', 'text-gray-600', 'dark:text-gray-300')
  })
})