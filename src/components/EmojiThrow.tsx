'use client';

import { useState, useEffect, useRef } from 'react';

interface EmojiThrowProps {
  emoji: string;
  targetPosition: { x: number; y: number };
  onComplete: () => void;
}

export default function EmojiThrow({ emoji, targetPosition, onComplete }: EmojiThrowProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!emojiRef.current) return;

    // Choose random corner (0: bottom-left, 1: bottom-right, 2: top-left, 3: top-right)
    const corner = Math.floor(Math.random() * 4);
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let startX, startY;
    switch (corner) {
      case 0: // bottom-left
        startX = 50;
        startY = windowHeight - 50;
        break;
      case 1: // bottom-right
        startX = windowWidth - 50;
        startY = windowHeight - 50;
        break;
      case 2: // top-left
        startX = 50;
        startY = 50;
        break;
      case 3: // top-right
        startX = windowWidth - 50;
        startY = 50;
        break;
      default:
        startX = windowWidth - 50;
        startY = windowHeight - 50;
    }

    // Calculate trajectory
    const deltaX = targetPosition.x - startX;
    const deltaY = targetPosition.y - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Animation duration based on distance (longer throws take more time)
    const duration = Math.min(Math.max(distance * 2, 1000), 2000);
    
    // Parabola height (higher for longer distances)
    const parabolaHeight = Math.min(distance * 0.5, 300);
    
    // Direction factor for parabola (up or down depending on start/end positions)
    const parabolaDirection = startY > targetPosition.y ? -1 : 1;

    const element = emojiRef.current;
    
    // Set initial position
    element.style.left = `${startX}px`;
    element.style.top = `${startY}px`;
    element.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';

    // Create keyframes for parabolic motion
    const keyframes = [
      {
        left: `${startX}px`,
        top: `${startY}px`,
        transform: 'translate(-50%, -50%) scale(1) rotate(0deg)',
        offset: 0
      },
      {
        left: `${startX + deltaX * 0.5}px`,
        top: `${startY + deltaY * 0.5 + parabolaDirection * parabolaHeight}px`,
        transform: 'translate(-50%, -50%) scale(1.2) rotate(180deg)',
        offset: 0.5
      },
      {
        left: `${targetPosition.x}px`,
        top: `${targetPosition.y}px`,
        transform: 'translate(-50%, -50%) scale(1) rotate(360deg)',
        offset: 1
      }
    ];

    // Start parabolic animation
    const animation = element.animate(keyframes, {
      duration: duration,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards'
    });

    animation.onfinish = () => {
      // Bounce effect
      const bounceAnimation = element.animate([
        { transform: 'translate(-50%, -50%) scale(1) rotate(360deg)' },
        { transform: 'translate(-50%, -50%) scale(1.3) rotate(390deg)' },
        { transform: 'translate(-50%, -50%) scale(1) rotate(420deg)' }
      ], {
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards'
      });

      bounceAnimation.onfinish = () => {
        // Fall and fade
        const fallAnimation = element.animate([
          { 
            transform: 'translate(-50%, -50%) scale(1) rotate(420deg)',
            opacity: 1
          },
          { 
            transform: 'translate(-50%, 20px) scale(0.5) rotate(540deg)',
            opacity: 0
          }
        ], {
          duration: 700,
          easing: 'ease-in',
          fill: 'forwards'
        });

        fallAnimation.onfinish = () => {
          onComplete();
        };
      };
    };

    // Cleanup function
    return () => {
      animation.cancel();
    };
  }, [targetPosition, onComplete]);

  if (!isAnimating) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <div
        ref={emojiRef}
        className="absolute text-3xl will-change-transform"
        style={{
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
        }}
      >
        {emoji}
      </div>
    </div>
  );
}