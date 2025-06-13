import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserInfo from '@/components/UserInfo'

describe('UserInfo', () => {
  const mockOnChangeName = jest.fn()
  
  beforeEach(() => {
    mockOnChangeName.mockClear()
  })

  it('displays user name correctly', () => {
    const userName = 'John Doe'
    
    render(<UserInfo userName={userName} onChangeName={mockOnChangeName} />)
    
    expect(screen.getByText('You are:')).toBeInTheDocument()
    expect(screen.getByText(userName)).toBeInTheDocument()
  })

  it('calls onChangeName when change button is clicked', async () => {
    const user = userEvent.setup()
    
    render(<UserInfo userName="John Doe" onChangeName={mockOnChangeName} />)
    
    const changeButton = screen.getByRole('button', { name: 'Change' })
    await user.click(changeButton)
    
    expect(mockOnChangeName).toHaveBeenCalledTimes(1)
  })

  it('applies correct styling classes to container', () => {
    render(<UserInfo userName="John Doe" onChangeName={mockOnChangeName} />)
    
    const container = screen.getByText('You are:').parentElement
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
    )
  })

  it('has correct styling for username display', () => {
    const userName = 'John Doe'
    
    render(<UserInfo userName={userName} onChangeName={mockOnChangeName} />)
    
    const userNameElement = screen.getByText(userName)
    expect(userNameElement).toHaveClass('font-medium', 'text-gray-800', 'dark:text-gray-200')
  })

  it('has correct styling for change button', () => {
    render(<UserInfo userName="John Doe" onChangeName={mockOnChangeName} />)
    
    const changeButton = screen.getByRole('button', { name: 'Change' })
    expect(changeButton).toHaveClass(
      'ml-1',
      'text-blue-600',
      'dark:text-blue-400',
      'hover:text-blue-700',
      'dark:hover:text-blue-300',
      'text-sm',
      'hover:underline'
    )
  })

  it('handles empty username', () => {
    render(<UserInfo userName="" onChangeName={mockOnChangeName} />)
    
    expect(screen.getByText('You are:')).toBeInTheDocument()
    const userNameSpan = screen.getByText('You are:').nextElementSibling
    expect(userNameSpan).toHaveTextContent('')
    expect(userNameSpan?.tagName).toBe('SPAN')
  })

  it('handles special characters in username', () => {
    const userName = 'User@#$%123'
    
    render(<UserInfo userName={userName} onChangeName={mockOnChangeName} />)
    
    expect(screen.getByText(userName)).toBeInTheDocument()
  })

  it('has accessible button text', () => {
    render(<UserInfo userName="John Doe" onChangeName={mockOnChangeName} />)
    
    const changeButton = screen.getByRole('button', { name: 'Change' })
    expect(changeButton).toBeInTheDocument()
  })
})