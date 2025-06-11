'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RoomCard() {
  const [roomCode, setRoomCode] = useState('');
  const router = useRouter();

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 15);
    router.push(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomCode.trim()) {
      router.push(`/room/${roomCode.trim()}`);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <button 
          onClick={createRoom}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Create New Room
        </button>
      </div>
      
      <div className="text-center text-gray-500 mb-4">or</div>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button 
          onClick={joinRoom}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}