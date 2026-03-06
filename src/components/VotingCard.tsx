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
        w-20 h-24 rounded-md border font-semibold text-xl transition-all duration-200
        ${isSelected 
          ? 'border-blue-600 bg-blue-600 text-white shadow-sm' 
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {value}
    </button>
  );
}