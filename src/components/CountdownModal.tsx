'use client';

import { useState, useEffect } from 'react';

interface CountdownModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function CountdownModal({ isOpen, onComplete }: CountdownModalProps) {
  const [count, setCount] = useState(3);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCount(3);
      setIsVisible(true);
      
      const timer = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer);
            setTimeout(() => {
              setIsVisible(false);
              onComplete();
            }, 500); // Wait for animation to complete
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-white mb-2">Revealing votes in...</h2>
        </div>
        
        <div className="relative">
          <div 
            className={`text-8xl font-bold text-white transition-all duration-500 transform ${
              count === 0 
                ? 'scale-150 opacity-0' 
                : 'scale-100 opacity-100 animate-bounce'
            }`}
            key={count}
          >
            {count === 0 ? '🎉' : count}
          </div>
          
          {/* Pulse ring animation */}
          {count > 0 && (
            <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-20"></div>
          )}
        </div>
        
        {count === 0 && (
          <div className="mt-4 text-xl text-white animate-fade-in">
            Revealing votes!
          </div>
        )}
      </div>
    </div>
  );
}