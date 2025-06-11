'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function Hero() {
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
    <div className="text-center py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Main heading */}
        <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Planning Poker for
          <span className="block text-blue-600">Agile Teams</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Estimate user stories collaboratively with your remote team. 
          Fast, simple, and effective story point estimation for agile development.
        </p>

        {/* Action buttons */}
        <div className="max-w-md mx-auto space-y-4 mb-16">
          <button 
            onClick={createRoom}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Start Planning Session
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">or join existing</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center font-mono"
            />
            <button 
              onClick={joinRoom}
              disabled={!roomCode.trim()}
              className="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Join
            </button>
          </div>
        </div>

        {/* Features highlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Lightning Fast</h3>
            <p className="text-gray-600 text-sm">No registration required. Create and join rooms instantly.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Remote Friendly</h3>
            <p className="text-gray-600 text-sm">Perfect for distributed teams. Up to 4 participants per room.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Consensus Building</h3>
            <p className="text-gray-600 text-sm">Reveal votes simultaneously and celebrate team alignment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}