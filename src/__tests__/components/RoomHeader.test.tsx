import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RoomHeader from '@/components/RoomHeader'

// Mock the ClientThemeToggle since it uses React context
jest.mock('@/components/ClientThemeToggle', () => {
  return function MockedClientThemeToggle() {
    return <div data-testid="theme-toggle">Theme Toggle</div>
  }
})

describe('RoomHeader', () => {
  const defaultProps = {
    roomId: 'test-room-123',
    onChangeName: jest.fn(),
    participantCount: 2,
    maxParticipants: 4,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders room title correctly', () => {
    render(<RoomHeader {...defaultProps} />)
    
    expect(screen.getByText('Room test-room-123')).toBeInTheDocument()
  })

  it('renders participant counter with correct values', () => {
    render(<RoomHeader {...defaultProps} />)
    
    expect(screen.getByText('2/4 participants')).toBeInTheDocument()
  })

  it('renders user info when username is provided', () => {
    const propsWithUser = { ...defaultProps, userName: 'John Doe' }
    
    render(<RoomHeader {...propsWithUser} />)
    
    expect(screen.getByText('You are:')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Change' })).toBeInTheDocument()
  })

  it('does not render user info when username is not provided', () => {
    render(<RoomHeader {...defaultProps} />)
    
    expect(screen.queryByText('You are:')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Change' })).not.toBeInTheDocument()
  })

  it('renders theme toggle', () => {
    render(<RoomHeader {...defaultProps} />)
    
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
  })

  it('renders share button when onShareRoom is provided', () => {
    const mockOnShareRoom = jest.fn()
    const propsWithShare = { ...defaultProps, onShareRoom: mockOnShareRoom }
    
    render(<RoomHeader {...propsWithShare} />)
    
    expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument()
  })

  it('does not render share button when onShareRoom is not provided', () => {
    render(<RoomHeader {...defaultProps} />)
    
    expect(screen.queryByRole('button', { name: 'Share' })).not.toBeInTheDocument()
  })

  it('calls onChangeName when change button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnChangeName = jest.fn()
    const propsWithUser = { 
      ...defaultProps, 
      userName: 'John Doe', 
      onChangeName: mockOnChangeName 
    }
    
    render(<RoomHeader {...propsWithUser} />)
    
    const changeButton = screen.getByRole('button', { name: 'Change' })
    await user.click(changeButton)
    
    expect(mockOnChangeName).toHaveBeenCalledTimes(1)
  })

  it('calls onShareRoom when share button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnShareRoom = jest.fn()
    const propsWithShare = { ...defaultProps, onShareRoom: mockOnShareRoom }
    
    render(<RoomHeader {...propsWithShare} />)
    
    const shareButton = screen.getByRole('button', { name: 'Share' })
    await user.click(shareButton)
    
    expect(mockOnShareRoom).toHaveBeenCalledTimes(1)
  })

  it('uses default values for optional props', () => {
    const minimalProps = {
      roomId: 'test-room',
      onChangeName: jest.fn(),
    }
    
    render(<RoomHeader {...minimalProps} />)
    
    expect(screen.getByText('0/4 participants')).toBeInTheDocument()
  })

  it('applies correct layout structure', () => {
    render(<RoomHeader {...defaultProps} />)
    
    const container = screen.getByText('Room test-room-123').closest('.flex')
    expect(container).toHaveClass('flex', 'justify-between', 'items-start', 'mb-8')
  })

  it('handles all props together correctly', async () => {
    const user = userEvent.setup()
    const mockOnChangeName = jest.fn()
    const mockOnShareRoom = jest.fn()
    const fullProps = {
      roomId: 'full-test-room',
      userName: 'Jane Doe',
      onChangeName: mockOnChangeName,
      participantCount: 3,
      maxParticipants: 6,
      onShareRoom: mockOnShareRoom,
    }
    
    render(<RoomHeader {...fullProps} />)
    
    // Check all elements are rendered
    expect(screen.getByText('Room full-test-room')).toBeInTheDocument()
    expect(screen.getByText('3/6 participants')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    
    // Test interactions
    await user.click(screen.getByRole('button', { name: 'Change' }))
    expect(mockOnChangeName).toHaveBeenCalledTimes(1)
    
    await user.click(screen.getByRole('button', { name: 'Share' }))
    expect(mockOnShareRoom).toHaveBeenCalledTimes(1)
  })
})