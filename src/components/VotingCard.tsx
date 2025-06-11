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
        w-16 h-24 rounded-lg border-2 font-semibold text-lg transition-all duration-200
        ${isSelected 
          ? 'border-blue-500 bg-blue-100 text-blue-700 shadow-md' 
          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:shadow-sm'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {value}
    </button>
  );
}