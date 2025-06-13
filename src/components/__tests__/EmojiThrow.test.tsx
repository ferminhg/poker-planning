import { render } from '@testing-library/react';
import EmojiThrow from '../EmojiThrow';

// Mock Element.animate
const mockAnimate = jest.fn(() => ({
  onfinish: null,
  cancel: jest.fn(),
}));
Element.prototype.animate = mockAnimate;

// Mock Math.random for consistent corner selection
const mockMathRandom = jest.fn();
Object.defineProperty(global.Math, 'random', {
  value: mockMathRandom,
  configurable: true,
});

// Mock window dimensions
Object.defineProperty(window, 'innerWidth', {
  value: 1000,
  writable: true,
});

Object.defineProperty(window, 'innerHeight', {
  value: 800,
  writable: true,
});

describe('EmojiThrow', () => {
  const defaultProps = {
    emoji: '👍',
    targetPosition: { x: 500, y: 400 },
    onComplete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockMathRandom.mockReturnValue(0.25); // Will select corner 1 (bottom-right)
  });

  it('renders emoji element', () => {
    const { container } = render(<EmojiThrow {...defaultProps} />);
    
    const emojiElement = container.querySelector('.text-3xl');
    expect(emojiElement).toBeInTheDocument();
    expect(emojiElement?.textContent).toBe('👍');
  });

  it('renders different emojis correctly', () => {
    const { container, rerender } = render(<EmojiThrow {...defaultProps} emoji="❤️" />);
    
    expect(container.querySelector('.text-3xl')?.textContent).toBe('❤️');
    
    rerender(<EmojiThrow {...defaultProps} emoji="😂" />);
    expect(container.querySelector('.text-3xl')?.textContent).toBe('😂');
  });

  it('applies correct styling to container and emoji', () => {
    const { container } = render(<EmojiThrow {...defaultProps} />);
    
    const outerContainer = container.firstChild;
    expect(outerContainer).toHaveClass('fixed', 'inset-0', 'pointer-events-none', 'z-40');
    
    const emojiElement = container.querySelector('.text-3xl');
    expect(emojiElement).toHaveClass('absolute', 'text-3xl', 'will-change-transform');
    expect(emojiElement).toHaveStyle('filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3))');
  });

  it('initiates animation sequence on mount', () => {
    mockAnimate.mockReturnValue({
      onfinish: null,
      cancel: jest.fn(),
    });

    render(<EmojiThrow {...defaultProps} />);
    
    expect(mockAnimate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          left: '950px', // bottom-right corner (1000 - 50)
          top: '750px',  // bottom-right corner (800 - 50)
          offset: 0
        }),
        expect.objectContaining({
          offset: 0.5
        }),
        expect.objectContaining({
          left: '500px', // target x
          top: '400px',  // target y
          offset: 1
        })
      ]),
      expect.objectContaining({
        duration: expect.any(Number),
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      })
    );
  });

  it('selects different corners based on random value', () => {
    mockAnimate.mockReturnValue({
      onfinish: null,
      cancel: jest.fn(),
    });

    // Test bottom-left corner (corner 0)
    mockMathRandom.mockReturnValue(0.1);
    const { unmount } = render(<EmojiThrow {...defaultProps} />);
    
    expect(mockAnimate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          left: '50px',  // bottom-left
          top: '750px',
          offset: 0
        })
      ]),
      expect.any(Object)
    );
    
    unmount();
    mockAnimate.mockClear();
    
    // Test top-left corner (corner 2)
    mockMathRandom.mockReturnValue(0.6);
    render(<EmojiThrow {...defaultProps} />);
    
    expect(mockAnimate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          left: '50px',  // top-left
          top: '50px',
          offset: 0
        })
      ]),
      expect.any(Object)
    );
  });

  it('calculates animation duration based on distance', () => {
    mockAnimate.mockReturnValue({
      onfinish: null,
      cancel: jest.fn(),
    });

    // Short distance
    render(<EmojiThrow {...defaultProps} targetPosition={{ x: 900, y: 700 }} />);
    
    const firstCall = mockAnimate.mock.calls[0];
    const shortDuration = firstCall[1].duration;
    
    mockAnimate.mockClear();
    
    // Long distance
    render(<EmojiThrow {...defaultProps} targetPosition={{ x: 100, y: 100 }} />);
    
    const secondCall = mockAnimate.mock.calls[0];
    const longDuration = secondCall[1].duration;
    
    expect(longDuration).toBeGreaterThan(shortDuration);
  });

  it('executes bounce and fall animations after main animation', () => {
    const mockMainAnimation = {
      onfinish: null,
      cancel: jest.fn(),
    };
    const mockBounceAnimation = {
      onfinish: null,
      cancel: jest.fn(),
    };
    const mockFallAnimation = {
      onfinish: null,
      cancel: jest.fn(),
    };

    mockAnimate
      .mockReturnValueOnce(mockMainAnimation)
      .mockReturnValueOnce(mockBounceAnimation)
      .mockReturnValueOnce(mockFallAnimation);

    render(<EmojiThrow {...defaultProps} />);
    
    // Trigger main animation finish
    mockMainAnimation.onfinish?.();
    
    // Should start bounce animation
    expect(mockAnimate).toHaveBeenCalledTimes(2);
    expect(mockAnimate).toHaveBeenLastCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          transform: 'translate(-50%, -50%) scale(1) rotate(360deg)'
        }),
        expect.objectContaining({
          transform: 'translate(-50%, -50%) scale(1.3) rotate(390deg)'
        }),
        expect.objectContaining({
          transform: 'translate(-50%, -50%) scale(1) rotate(420deg)'
        })
      ]),
      expect.objectContaining({
        duration: 300,
        easing: 'ease-out'
      })
    );
    
    // Trigger bounce animation finish
    mockBounceAnimation.onfinish?.();
    
    // Should start fall animation
    expect(mockAnimate).toHaveBeenCalledTimes(3);
    
    // Trigger fall animation finish
    mockFallAnimation.onfinish?.();
    
    // Should call onComplete
    expect(defaultProps.onComplete).toHaveBeenCalledTimes(1);
  });

  it('cancels animation on cleanup', () => {
    const mockAnimation = {
      onfinish: null,
      cancel: jest.fn(),
    };
    
    mockAnimate.mockReturnValue(mockAnimation);
    
    const { unmount } = render(<EmojiThrow {...defaultProps} />);
    
    unmount();
    
    expect(mockAnimation.cancel).toHaveBeenCalledTimes(1);
  });

  it('handles different target positions correctly', () => {
    mockAnimate.mockReturnValue({
      onfinish: null,
      cancel: jest.fn(),
    });

    render(<EmojiThrow {...defaultProps} targetPosition={{ x: 200, y: 300 }} />);
    
    expect(mockAnimate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          left: '200px',
          top: '300px',
          offset: 1
        })
      ]),
      expect.any(Object)
    );
  });
});