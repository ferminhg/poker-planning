interface RoomHeaderProps {
  roomId: string;
  userName?: string;
  onChangeName: () => void;
  participantCount?: number;
  maxParticipants?: number;
  onShareRoom?: () => void;
}

export default function RoomHeader({ 
  roomId, 
  userName, 
  onChangeName, 
  participantCount = 0, 
  maxParticipants = 4,
  onShareRoom
}: RoomHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-8">
      {/* Left side - Room info */}
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Room {roomId}</h1>
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-md px-3 py-1">
            <span className="text-sm text-gray-600">
              {participantCount}/{maxParticipants} participants
            </span>
          </div>
          {userName && (
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-md px-3 py-1">
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
      </div>
      
      {/* Right side - Share button */}
      {onShareRoom && (
        <button
          onClick={onShareRoom}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          Share
        </button>
      )}
    </div>
  );
}