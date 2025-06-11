'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import RoomHeader from '@/components/RoomHeader';
import StoryInput from '@/components/StoryInput';
import ParticipantsList from '@/components/ParticipantsList';
import VotingDeck from '@/components/VotingDeck';
import VotingControls from '@/components/VotingControls';
import NameModal from '@/components/NameModal';
import RoomFullMessage from '@/components/RoomFullMessage';
import ShareRoom from '@/components/ShareRoom';
import CountdownModal from '@/components/CountdownModal';
import { useRoomSync } from '@/hooks/useRoomSync';
import { useAnalytics } from '@/hooks/useAnalytics';
import Confetti from 'react-confetti';

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const [roomId, setRoomId] = useState<string>('');
  const [showNameModal, setShowNameModal] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [lastAllVotedState, setLastAllVotedState] = useState<boolean>(false);
  const [resetVotingDeck, setResetVotingDeck] = useState<boolean>(false);
  const [lastVotesRevealed, setLastVotesRevealed] = useState<boolean>(false);
  const [lastUserHasVoted, setLastUserHasVoted] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  
  const { trackUserNameChanged } = useAnalytics();

  useEffect(() => {
    params.then((resolvedParams) => {
      setRoomId(resolvedParams.id);
    });
  }, [params]);

  // Set window dimensions for confetti
  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);

    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  const {
    roomState,
    currentUser,
    isLoading,
    error,
    joinRoom,
    vote,
    revealVotes,
    newRound,
    updateStory,
    resetVotes,
    sendEmoji,
    isRoomFull,
    allVoted
  } = useRoomSync(roomId);

  useEffect(() => {
    if (!roomId || isLoading) return;
    
    const savedName = localStorage.getItem('planningPokerUserName');
    if (savedName && !currentUser && !isRoomFull) {
      // Try to join automatically with saved name
      joinRoom(savedName).then((success) => {
        if (!success) {
          setShowNameModal(true);
        }
      });
    } else if (!currentUser && !isRoomFull) {
      setShowNameModal(true);
    }
  }, [roomId, currentUser, isRoomFull, isLoading, joinRoom]);

  // Auto-trigger countdown when all participants have voted
  useEffect(() => {
    if (allVoted && !lastAllVotedState && !roomState?.votesRevealed && (roomState?.participants?.length || 0) > 0) {
      setShowCountdown(true);
    }
    setLastAllVotedState(allVoted);
  }, [allVoted, lastAllVotedState, roomState?.votesRevealed, roomState?.participants?.length]);

  // Detect when votes are reset by another user (new round or reset votes)
  useEffect(() => {
    if (roomState && currentUser) {
      const currentUserParticipant = roomState.participants.find(p => p.id === currentUser.id);
      const currentVotesRevealed = roomState.votesRevealed;
      const currentUserHasVoted = currentUserParticipant?.hasVoted || false;
      
      // If votes were revealed before but now they're not, it means a new round started
      if (lastVotesRevealed && !currentVotesRevealed) {
        setResetVotingDeck(true);
        setTimeout(() => setResetVotingDeck(false), 100);
      }
      
      // If user had voted before but now hasVoted is false, votes were reset
      if (lastUserHasVoted && !currentUserHasVoted && !currentVotesRevealed) {
        setResetVotingDeck(true);
        setTimeout(() => setResetVotingDeck(false), 100);
      }
      
      setLastVotesRevealed(currentVotesRevealed);
      setLastUserHasVoted(currentUserHasVoted);
    }
  }, [roomState, currentUser, lastVotesRevealed, lastUserHasVoted]);

  // Check for unanimous votes and trigger confetti
  useEffect(() => {
    if (roomState && roomState.votesRevealed && !lastVotesRevealed) {
      const validVotes = roomState.participants
        .filter(p => p.vote && p.vote !== '?' && p.vote !== '☕')
        .map(p => p.vote);
      
      if (validVotes.length >= 2 && new Set(validVotes).size === 1) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // Show confetti for 5 seconds
      }
    }
  }, [roomState?.votesRevealed, lastVotesRevealed, roomState?.participants]);

  const handleSaveName = async () => {
    if (tempName.trim()) {
      try {
        const success = await joinRoom(tempName.trim());
        
        if (success) {
          setShowNameModal(false);
          setTempName('');
          
          // Track name change if user already existed
          if (currentUser) {
            trackUserNameChanged(roomId);
          }
        } else {
          // Room is full, could show error message
          alert('Room is full. Maximum 4 participants allowed.');
        }
      } catch (error) {
        console.error('Error joining room:', error);
        alert('Failed to join room. Please try again.');
      }
    }
  };

  const handleChangeName = () => {
    if (currentUser) {
      setTempName(currentUser.name);
      setShowNameModal(true);
    }
  };

  const handleCancelName = () => {
    setShowNameModal(false);
    setTempName('');
  };

  const handleOpenShare = () => {
    setShowShareModal(true);
  };

  const handleCloseShare = () => {
    setShowShareModal(false);
  };

  const handleRevealVotes = () => {
    setShowCountdown(true);
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    revealVotes();
  };

  const handleNewRound = async () => {
    await newRound();
    setResetVotingDeck(true);
    setTimeout(() => setResetVotingDeck(false), 100); // Reset the flag after a brief delay
  };

  const handleResetVotes = async () => {
    await resetVotes();
    setResetVotingDeck(true);
    setTimeout(() => setResetVotingDeck(false), 100); // Reset the flag after a brief delay
  };

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading room...</p>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Show room full message if room is full and user is not in the room
  if (isRoomFull && !currentUser) {
    return (
      <Layout>
        <RoomFullMessage roomId={roomId} />
      </Layout>
    );
  }

  // Show loading or name modal if user hasn't joined yet
  if (!currentUser) {
    return (
      <Layout>
        <NameModal
          isOpen={showNameModal}
          tempName={tempName}
          onTempNameChange={setTempName}
          onSave={handleSaveName}
          onCancel={handleCancelName}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <RoomHeader 
        roomId={roomId}
        userName={currentUser.name}
        onChangeName={handleChangeName}
        participantCount={roomState?.participants.length || 0}
        maxParticipants={roomState?.maxParticipants || 4}
        onShareRoom={handleOpenShare}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        
        <StoryInput 
          value={roomState?.currentStory || ''}
          onChange={updateStory}
        />

        <ParticipantsList 
          participants={roomState?.participants || []}
          votesRevealed={roomState?.votesRevealed || false}
          currentUserId={currentUser?.id}
          onSendEmoji={sendEmoji}
          allVoted={allVoted}
          onRevealVotes={handleRevealVotes}
        />

        <VotingDeck 
          onVote={vote} 
          disabled={roomState?.votesRevealed || false}
          resetSelection={resetVotingDeck}
        />

        <VotingControls
          votesRevealed={roomState?.votesRevealed || false}
          hasAnyVotes={roomState?.participants.some(p => p.hasVoted) || false}
          onNewRound={handleNewRound}
          onResetVotes={handleResetVotes}
        />

      </div>

      <NameModal
        isOpen={showNameModal}
        tempName={tempName}
        userName={currentUser?.name}
        onTempNameChange={setTempName}
        onSave={handleSaveName}
        onCancel={handleCancelName}
      />

      <ShareRoom
        roomId={roomId}
        isOpen={showShareModal}
        onClose={handleCloseShare}
      />

      <CountdownModal
        isOpen={showCountdown}
        onComplete={handleCountdownComplete}
      />

      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
    </Layout>
  );
}