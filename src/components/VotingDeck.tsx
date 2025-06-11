'use client';

import { useState, useEffect } from 'react';
import VotingCard from './VotingCard';

const FIBONACCI_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '?', '☕'];

interface VotingDeckProps {
  onVote?: (value: string) => void;
  disabled?: boolean;
  resetSelection?: boolean;
}

export default function VotingDeck({ onVote, disabled, resetSelection }: VotingDeckProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  // Reset selection when resetSelection prop changes
  useEffect(() => {
    if (resetSelection) {
      setSelectedValue(null);
    }
  }, [resetSelection]);

  const handleCardClick = (value: string) => {
    if (disabled) return;
    
    setSelectedValue(value);
    onVote?.(value);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        Choose your estimate
      </h3>
      
      <div className="grid grid-cols-6 gap-2 justify-items-center">
        {FIBONACCI_VALUES.map((value) => (
          <VotingCard
            key={value}
            value={value}
            isSelected={selectedValue === value}
            onClick={() => handleCardClick(value)}
            disabled={disabled}
          />
        ))}
      </div>
      
      {selectedValue && (
        <div className="mt-4 text-center text-gray-600 text-sm">
          Selected: <span className="font-medium text-blue-600">{selectedValue}</span>
        </div>
      )}
    </div>
  );
}