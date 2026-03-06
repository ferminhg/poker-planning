import { render, screen } from '@testing-library/react';
import AnimatedEmoji from '../AnimatedEmoji';

describe('AnimatedEmoji', () => {
  it('renders the emoji', () => {
    render(<AnimatedEmoji emoji="🐙" />);
    expect(screen.getByText('🐙')).toBeInTheDocument();
  });

  it('applies bounce animation by default', () => {
    const { container } = render(<AnimatedEmoji emoji="🍮" />);
    const span = container.querySelector('span');
    expect(span).toHaveClass('animate-emoji-bounce');
  });

  it('applies pulse animation when specified', () => {
    const { container } = render(<AnimatedEmoji emoji="🦑" animation="pulse" />);
    const span = container.querySelector('span');
    expect(span).toHaveClass('animate-pulse');
  });

  it('applies custom className', () => {
    const { container } = render(
      <AnimatedEmoji emoji="🐸" className="custom-class" />
    );
    const span = container.querySelector('span');
    expect(span).toHaveClass('custom-class');
  });

  it('has role img and aria-hidden for accessibility', () => {
    const { container } = render(<AnimatedEmoji emoji="🍕" />);
    const span = container.querySelector('span[role="img"]');
    expect(span).toBeInTheDocument();
    expect(span).toHaveAttribute('aria-hidden');
  });

  it('renders different emojis correctly', () => {
    const { rerender } = render(<AnimatedEmoji emoji="🐙" />);
    expect(screen.getByText('🐙')).toBeInTheDocument();

    rerender(<AnimatedEmoji emoji="🦩" />);
    expect(screen.getByText('🦩')).toBeInTheDocument();
  });
});
