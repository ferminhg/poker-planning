'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import RoomHeader from '@/components/RoomHeader';
import StoryInput from '@/components/StoryInput';
import ParticipantsList from '@/components/ParticipantsList';
import VotingDeck from '@/components/VotingDeck';
import VotingControls from '@/components/VotingControls';
import NameModal from '@/components/NameModal';
import { Participant } from '@/types';

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

  const handleCancelName = () => {
    setShowNameModal(false);
    setTempName('');
  };

  const allVoted = participants.every(p => p.hasVoted);

  return (
    <Layout>
      <RoomHeader 
        roomId={roomId}
        userName={userName}
        onChangeName={handleChangeName}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <StoryInput 
          value={currentStory}
          onChange={setCurrentStory}
        />

        <ParticipantsList 
          participants={participants}
          votesRevealed={votesRevealed}
        />

        <VotingDeck onVote={handleVote} disabled={votesRevealed} />

        <VotingControls
          allVoted={allVoted}
          votesRevealed={votesRevealed}
          onRevealVotes={handleRevealVotes}
          onNewRound={handleNewRound}
        />
      </div>

      <NameModal
        isOpen={showNameModal}
        tempName={tempName}
        userName={userName}
        onTempNameChange={setTempName}
        onSave={handleSaveName}
        onCancel={handleCancelName}
      />
    </Layout>
  );
}