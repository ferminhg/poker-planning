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
import { useRoomSync } from '@/hooks/useRoomSync';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const [roomId, setRoomId] = useState<string>('');
  const [showNameModal, setShowNameModal] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>('');
  const [isJoining, setIsJoining] = useState<boolean>(false);
  
  const { trackUserNameChanged } = useAnalytics();

  useEffect(() => {
    params.then((resolvedParams) => {
      setRoomId(resolvedParams.id);
    });
  }, [params]);

  const {
    roomState,
    currentUser,
    isLoading,
    error,
    joinRoom,
    leaveRoom,
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

  const handleSaveName = async () => {
    if (tempName.trim()) {
      setIsJoining(true);
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
      } finally {
        setIsJoining(false);
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

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom();
      window.location.href = '/';
    } catch (error) {
      console.error('Error leaving room:', error);
      // Still redirect even if there's an error
      window.location.href = '/';
    }
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
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <ShareRoom roomId={roomId} />
        
        <StoryInput 
          value={roomState?.currentStory || ''}
          onChange={updateStory}
        />

        <ParticipantsList 
          participants={roomState?.participants || []}
          votesRevealed={roomState?.votesRevealed || false}
          currentUserId={currentUser?.id}
          onSendEmoji={sendEmoji}
        />

        <VotingDeck 
          onVote={vote} 
          disabled={roomState?.votesRevealed || false} 
        />

        <VotingControls
          allVoted={allVoted}
          votesRevealed={roomState?.votesRevealed || false}
          hasAnyVotes={roomState?.participants.some(p => p.hasVoted) || false}
          onRevealVotes={revealVotes}
          onNewRound={newRound}
          onResetVotes={resetVotes}
        />

        <div className="text-center mt-8">
          <button
            onClick={handleLeaveRoom}
            className="text-red-600 hover:text-red-700 text-sm underline"
          >
            Leave Room
          </button>
        </div>
      </div>

      <NameModal
        isOpen={showNameModal}
        tempName={tempName}
        userName={currentUser?.name}
        onTempNameChange={setTempName}
        onSave={handleSaveName}
        onCancel={handleCancelName}
      />
    </Layout>
  );
}