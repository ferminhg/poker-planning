interface RoomHeaderProps {
  roomId: string;
  userName?: string;
  onChangeName: () => void;
  participantCount?: number;
  maxParticipants?: number;
}

export default function RoomHeader({ 
  roomId, 
  userName, 
  onChangeName, 
  participantCount = 0, 
  maxParticipants = 4 
}: RoomHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">Planning Poker</h1>
      <div className="flex flex-col items-center gap-2">
        <p className="text-gray-600 font-mono text-sm">Room: {roomId}</p>
        <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-md px-3 py-1">
          <span className="text-sm text-gray-600">
            {participantCount}/{maxParticipants} participants
          </span>
        </div>
      </div>
      {userName && (
        <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md px-3 py-1">
          <span className="text-sm text-gray-600">You are:</span>
          <span className="font-medium text-gray-800">{userName}</span>
          <button
            onClick={onChangeName}
            className="ml-1 text-blue-600 hover:text-blue-700 text-sm hover:underline"
          >
            Change
          </button>
        </div>
      )}
    </div>
  );
}