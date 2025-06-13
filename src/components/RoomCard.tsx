'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function RoomCard() {
  const [roomCode, setRoomCode] = useState('');
  const router = useRouter();
  const { trackRoomCreated } = useAnalytics();

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 15);
    trackRoomCreated(newRoomId);
    router.push(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomCode.trim()) {
      router.push(`/room/${roomCode.trim()}`);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
      <div className="mb-6">
        <button 
          onClick={createRoom}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors border border-transparent"
        >
          Create New Room
        </button>
      </div>
      
      <div className="text-center text-gray-500 dark:text-gray-400 text-sm mb-4">or</div>
      
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button 
          onClick={joinRoom}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}