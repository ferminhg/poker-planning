import ParticipantCard from './ParticipantCard';
import { Participant } from '@/types';

interface ParticipantsListProps {
  participants: Participant[];
  votesRevealed: boolean;
  currentUserId?: string;
  onSendEmoji?: (targetUserId: string, emoji: string) => void;
}

export default function ParticipantsList({ participants, votesRevealed, currentUserId, onSendEmoji }: ParticipantsListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Participants ({participants.length})
      </h3>
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