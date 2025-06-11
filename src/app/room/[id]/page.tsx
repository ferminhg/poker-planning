'use client';

import { useState, useEffect } from 'react';
import VotingDeck from '@/components/VotingDeck';

interface Participant {
  id: string;
  name: string;
  vote?: string;
  hasVoted: boolean;
}

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const [roomId, setRoomId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [showNameModal, setShowNameModal] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>('');

  useEffect(() => {
    params.then((resolvedParams) => {
      setRoomId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    const savedName = localStorage.getItem('planningPokerUserName');
    if (savedName) {
      setUserName(savedName);
      setParticipants(prev => prev.map(p => 
        p.id === '1' ? { ...p, name: savedName } : p
      ));
    } else {
      setShowNameModal(true);
    }
  }, []);

  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: userName || 'You', hasVoted: false },
    { id: '2', name: 'Alice', hasVoted: true },
    { id: '3', name: 'Bob', hasVoted: false },
    { id: '4', name: 'Charlie', hasVoted: true },
  ]);
  
  const [currentStory, setCurrentStory] = useState('');
  const [votesRevealed, setVotesRevealed] = useState(false);
  const [myVote, setMyVote] = useState<string | null>(null);

  const handleVote = (value: string) => {
    setMyVote(value);
    setParticipants(prev => prev.map(p => 
      p.id === '1' ? { ...p, hasVoted: true, vote: value } : p
    ));
  };

  const handleRevealVotes = () => {
    setVotesRevealed(true);
    setParticipants(prev => prev.map(p => ({
      ...p,
      vote: p.hasVoted ? (p.id === '1' ? myVote : ['3', '5', '8'][Math.floor(Math.random() * 3)]) : undefined
    })));
  };

  const handleNewRound = () => {
    setVotesRevealed(false);
    setMyVote(null);
    setParticipants(prev => prev.map(p => ({ ...p, hasVoted: false, vote: undefined })));
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem('planningPokerUserName', tempName.trim());
      setParticipants(prev => prev.map(p => 
        p.id === '1' ? { ...p, name: tempName.trim() } : p
      ));
      setShowNameModal(false);
      setTempName('');
    }
  };

  const handleChangeName = () => {
    setTempName(userName);
    setShowNameModal(true);
  };

  const allVoted = participants.every(p => p.hasVoted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Planning Poker</h1>
          <p className="text-gray-600">Room: {roomId}</p>
          {userName && (
            <div className="mt-2">
              <span className="text-sm text-gray-500">You are: </span>
              <span className="font-medium text-gray-700">{userName}</span>
              <button
                onClick={handleChangeName}
                className="ml-2 text-blue-600 hover:text-blue-700 text-sm underline"
              >
                Change name
              </button>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Current Story</h2>
            <input
              type="text"
              value={currentStory}
              onChange={(e) => setCurrentStory(e.target.value)}
              placeholder="e.g. GRY-1234"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Participants ({participants.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className={`p-4 rounded-lg border-2 text-center ${
                    participant.hasVoted
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-800">{participant.name}</div>
                  <div className="mt-2">
                    {votesRevealed && participant.vote ? (
                      <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-lg font-semibold">
                        {participant.vote}
                      </div>
                    ) : participant.hasVoted ? (
                      <div className="text-green-600 text-sm">✓ Voted</div>
                    ) : (
                      <div className="text-gray-400 text-sm">Waiting...</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <VotingDeck onVote={handleVote} disabled={votesRevealed} />

          <div className="text-center space-x-4">
            {allVoted && !votesRevealed && (
              <button
                onClick={handleRevealVotes}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Reveal Votes
              </button>
            )}
            
            {votesRevealed && (
              <button
                onClick={handleNewRound}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                New Round
              </button>
            )}
          </div>
        </div>

        {/* Name Modal */}
        {showNameModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter your name</h2>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                placeholder="Your name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSaveName}
                  disabled={!tempName.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Save
                </button>
                {userName && (
                  <button
                    onClick={() => {
                      setShowNameModal(false);
                      setTempName('');
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}