'use client';

import { useState, useCallback } from 'react';

interface EmojiAnimation {
  id: string;
  emoji: string;
  targetPosition: { x: number; y: number };
}

export function useEmojiAnimations() {
  const [currentAnimation, setCurrentAnimation] = useState<EmojiAnimation | null>(null);

  const throwEmoji = useCallback((emoji: string, targetElement: HTMLElement) => {
    const rect = targetElement.getBoundingClientRect();
    const targetPosition = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    const animationId = Math.random().toString(36).substring(2, 15);
    
    // Replace any existing animation with the new one
    setCurrentAnimation({
      id: animationId,
      emoji,
      targetPosition
    });
  }, []);

  const clearAnimation = useCallback(() => {
    setCurrentAnimation(null);
  }, []);

  return {
    currentAnimation,
    throwEmoji,
    clearAnimation
  };
}