import { render, screen } from '@testing-library/react'
import RoomTitle from '@/components/RoomTitle'

describe('RoomTitle', () => {
  it('renders room title with correct room ID', () => {
    const roomId = 'test-room-123'
    
    render(<RoomTitle roomId={roomId} />)
    
    expect(screen.getByText(`Room ${roomId}`)).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    const roomId = 'test-room'
    
    render(<RoomTitle roomId={roomId} />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('text-4xl', 'font-bold', 'text-gray-900', 'dark:text-gray-100', 'mb-3')
  })

  it('renders as h1 element', () => {
    const roomId = 'test-room'
    
    render(<RoomTitle roomId={roomId} />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.tagName).toBe('H1')
  })

  it('handles special characters in room ID', () => {
    const roomId = 'test-room-@#$%'
    
    render(<RoomTitle roomId={roomId} />)
    
    expect(screen.getByText(`Room ${roomId}`)).toBeInTheDocument()
  })

  it('handles empty room ID', () => {
    const roomId = ''
    
    render(<RoomTitle roomId={roomId} />)
    
    expect(screen.getByText('Room ')).toBeInTheDocument()
  })
})