import { Participant } from '@/types';

interface ParticipantCardProps {
  participant: Participant;
  votesRevealed: boolean;
}

export default function ParticipantCard({ participant, votesRevealed }: ParticipantCardProps) {
  return (
    <div
      className={`p-3 rounded-md border text-center transition-colors ${
        participant.hasVoted
          ? 'border-green-300 bg-green-50'
          : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="font-medium text-gray-900 text-sm truncate">{participant.name}</div>
      <div className="mt-2">
        {votesRevealed && participant.vote ? (
          <div className="inline-block bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
            {participant.vote}
          </div>
        ) : participant.hasVoted ? (
          <div className="text-green-600 text-xs font-medium">✓ Voted</div>
        ) : (
          <div className="text-gray-500 text-xs">Waiting...</div>
        )}
      </div>
    </div>
  );
}