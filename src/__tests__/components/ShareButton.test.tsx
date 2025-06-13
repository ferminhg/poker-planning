import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShareButton from '@/components/ShareButton'

describe('ShareButton', () => {
  const mockOnShare = jest.fn()
  
  beforeEach(() => {
    mockOnShare.mockClear()
  })

  it('renders share button with correct text', () => {
    render(<ShareButton onShare={mockOnShare} />)
    
    expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument()
    expect(screen.getByText('Share')).toBeInTheDocument()
  })

  it('calls onShare when button is clicked', async () => {
    const user = userEvent.setup()
    
    render(<ShareButton onShare={mockOnShare} />)
    
    const shareButton = screen.getByRole('button', { name: 'Share' })
    await user.click(shareButton)
    
    expect(mockOnShare).toHaveBeenCalledTimes(1)
  })

  it('applies correct styling classes', () => {
    render(<ShareButton onShare={mockOnShare} />)
    
    const button = screen.getByRole('button', { name: 'Share' })
    expect(button).toHaveClass(
      'bg-blue-600',
      'hover:bg-blue-700',
      'text-white',
      'font-medium',
      'py-2',
      'px-4',
      'rounded-md',
      'transition-colors',
      'flex',
      'items-center',
      'gap-2'
    )
  })

  it('contains share icon SVG', () => {
    render(<ShareButton onShare={mockOnShare} />)
    
    const svg = screen.getByRole('button').querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('w-4', 'h-4')
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('stroke', 'currentColor')
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
  })

  it('has correct SVG path for share icon', () => {
    render(<ShareButton onShare={mockOnShare} />)
    
    const path = screen.getByRole('button').querySelector('svg path')
    expect(path).toBeInTheDocument()
    expect(path).toHaveAttribute('stroke-linecap', 'round')
    expect(path).toHaveAttribute('stroke-linejoin', 'round')
    expect(path).toHaveAttribute('stroke-width', '2')
  })

  it('handles multiple clicks correctly', async () => {
    const user = userEvent.setup()
    
    render(<ShareButton onShare={mockOnShare} />)
    
    const shareButton = screen.getByRole('button', { name: 'Share' })
    await user.click(shareButton)
    await user.click(shareButton)
    await user.click(shareButton)
    
    expect(mockOnShare).toHaveBeenCalledTimes(3)
  })

  it('is accessible via keyboard', async () => {
    const user = userEvent.setup()
    
    render(<ShareButton onShare={mockOnShare} />)
    
    const shareButton = screen.getByRole('button', { name: 'Share' })
    shareButton.focus()
    await user.keyboard('{Enter}')
    
    expect(mockOnShare).toHaveBeenCalledTimes(1)
  })
})