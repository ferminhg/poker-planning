
interface EmojiTooltipProps {
  onEmojiSelect: (emoji: string) => void;
  isVisible: boolean;
  position: { x: number; y: number };
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const EMOJI_OPTIONS = ['👍', '👎', '❤️', '😂'];

export default function EmojiTooltip({ onEmojiSelect, isVisible, position, onMouseEnter, onMouseLeave }: EmojiTooltipProps) {
  if (!isVisible) return null;

  return (
    <div
      className="absolute z-50 bg-white border border-gray-200 rounded-lg p-2 shadow-lg"
      style={{
        left: position.x,
        top: position.y - 60,
        transform: 'translateX(-50%)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex space-x-2">
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onEmojiSelect(emoji)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors text-lg"
            title={`Send ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
      {/* Arrow pointing down */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-200"></div>
    </div>
  );
}