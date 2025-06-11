interface RoomFullMessageProps {
  roomId: string;
}

export default function RoomFullMessage({ roomId }: RoomFullMessageProps) {
  return (
    <div className="max-w-md mx-auto bg-white border border-red-200 rounded-lg p-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Room is Full</h2>
        <p className="text-gray-600 mb-4">
          This room has reached its maximum capacity of 4 participants.
        </p>
        <p className="text-sm text-gray-500 font-mono">Room: {roomId}</p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}