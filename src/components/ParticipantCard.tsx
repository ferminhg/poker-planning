import { useState, useRef } from 'react';
import { Participant } from '@/types';

interface ParticipantCardProps {
  participant: Participant;
  votesRevealed: boolean;
  onSendEmoji?: (targetUserId: string, emoji: string, targetElement?: HTMLElement) => void;
  currentUserId?: string;
}

export default function ParticipantCard({ participant, votesRevealed, onSendEmoji, currentUserId }: ParticipantCardProps) {
  const [showEmojiTooltip, setShowEmojiTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  const handleContainerMouseEnter = () => {
    // Don't show tooltip for current user
    if (participant.id === currentUserId || !onSendEmoji) return;
    setShowEmojiTooltip(true);
  };

  const handleContainerMouseLeave = () => {
    setShowEmojiTooltip(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    if (onSendEmoji && nameRef.current) {
      onSendEmoji(participant.id, emoji, nameRef.current);
    }
    setShowEmojiTooltip(false);
  };

  const canShowEmoji = participant.id !== currentUserId && onSendEmoji;

  return (
    <div 
      ref={containerRef}
      className="relative"
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
    >
      {/* Emoji Tooltip */}
      {showEmojiTooltip && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-2 shadow-lg">
            <div className="flex space-x-2">
              {['👍', '👎', '❤️', '😂'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors text-lg"
                  title={`Send ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            {/* Arrow pointing down */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-200 dark:border-t-gray-600"></div>
          </div>
        </div>
      )}
      
      {/* Participant Card */}
      <div
        className={`p-3 rounded-md border text-center transition-colors relative ${
          participant.hasVoted
            ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
            : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
        } ${canShowEmoji ? 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20' : ''}`}
      >
        <div ref={nameRef} className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{participant.name}</div>
        <div className="mt-2">
          {votesRevealed && participant.vote ? (
            <div className="inline-block bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
              {participant.vote}
            </div>
          ) : participant.hasVoted ? (
            <div className="text-green-600 dark:text-green-400 text-xs font-medium">✓ Voted</div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400 text-xs">Waiting...</div>
          )}
        </div>
        
        {/* Received emojis display - positioned absolutely to not affect layout */}
        {participant.receivedEmojis && participant.receivedEmojis.length > 0 && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
            {participant.receivedEmojis.slice(-3).map((emojiData, index) => {
              const emoji = typeof emojiData === 'string' ? emojiData : emojiData.emoji;
              return (
                <span key={index} className="text-sm animate-bounce bg-white dark:bg-gray-700 rounded-full px-1 shadow-sm">
                  {emoji}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}