'use client';

export type AnimatedEmojiAnimation = 'bounce' | 'pulse' | 'float';

interface AnimatedEmojiProps {
  emoji: string;
  animation?: AnimatedEmojiAnimation;
  className?: string;
}

const animationClasses: Record<AnimatedEmojiAnimation, string> = {
  bounce: 'animate-emoji-bounce',
  pulse: 'animate-pulse',
  float: 'animate-emoji-bounce', // reuse bounce for now, can add float later
};

export default function AnimatedEmoji({
  emoji,
  animation = 'bounce',
  className = '',
}: AnimatedEmojiProps) {
  const animationClass = animationClasses[animation];

  return (
    <span
      className={`inline-block text-2xl select-none ${animationClass} ${className}`.trim()}
      role="img"
      aria-hidden
    >
      {emoji}
    </span>
  );
}
