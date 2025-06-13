interface ParticipantCounterProps {
  participantCount: number;
  maxParticipants: number;
}

export default function ParticipantCounter({ 
  participantCount, 
  maxParticipants 
}: ParticipantCounterProps) {
  return (
    <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-3 py-1">
      <span className="text-sm text-gray-600 dark:text-gray-300">
        {participantCount}/{maxParticipants} participants
      </span>
    </div>
  );
}