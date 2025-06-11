'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Planning Poker</h1>
          <p className="text-gray-600 text-lg">Collaborative story point estimation for agile teams</p>
        </div>
        
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
      </div>
    </div>
  );
}
