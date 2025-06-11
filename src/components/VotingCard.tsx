interface VotingCardProps {
  value: string;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function VotingCard({ value, isSelected, onClick, disabled }: VotingCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-16 h-20 rounded-md border font-medium text-base transition-all duration-200
        ${isSelected 
          ? 'border-blue-600 bg-blue-600 text-white shadow-sm' 
          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {value}
    </button>
  );
}