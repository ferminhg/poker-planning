import ParticipantCard from './ParticipantCard';
import { Participant } from '@/types';

interface ParticipantsListProps {
  participants: Participant[];
  votesRevealed: boolean;
  currentUserId?: string;
  onSendEmoji?: (targetUserId: string, emoji: string) => void;
  allVoted?: boolean;
  onRevealVotes?: () => void;
}

export default function ParticipantsList({ participants, votesRevealed, currentUserId, onSendEmoji, allVoted, onRevealVotes }: ParticipantsListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Participants ({participants.length})
        </h3>
        
        {allVoted && !votesRevealed && onRevealVotes && (
          <button
            onClick={onRevealVotes}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Reveal Votes
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {participants.map((participant) => (
          <ParticipantCard
            key={participant.id}
            participant={participant}
            votesRevealed={votesRevealed}
            currentUserId={currentUserId}
            onSendEmoji={onSendEmoji}
          />
        ))}
      </div>
    </div>
  );
}