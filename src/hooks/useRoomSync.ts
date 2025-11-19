'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Participant } from '@/types';
import { useAnalytics } from '@/hooks/useAnalytics';

interface RoomState {
  id: string;
  currentStory: string;
  votesRevealed: boolean;
  participants: Participant[];
  maxParticipants: number;
  lastUpdated: number;
  createdAt: number;
}

interface UseRoomSyncReturn {
  roomState: RoomState | null;
  currentUser: Participant | null;
  isLoading: boolean;
  error: string | null;
  updateRoom: (newState: Partial<RoomState>) => Promise<void>;
  joinRoom: (userName: string) => Promise<boolean>;
  leaveRoom: () => Promise<void>;
  vote: (value: string) => Promise<void>;
  revealVotes: () => Promise<void>;
  newRound: () => Promise<void>;
  updateStory: (story: string) => Promise<void>;
  resetVotes: () => Promise<void>;
  sendEmoji: (targetUserId: string, emoji: string) => Promise<void>;
  isRoomFull: boolean;
  allVoted: boolean;
}

const generateUserId = () => Math.random().toString(36).substring(2, 15);
const POLLING_INTERVAL = 2000; // 2 seconds
const MAX_PARTICIPANTS = 10;

export function useRoomSync(roomId: string): UseRoomSyncReturn {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const currentUserIdRef = useRef<string | null>(null);
  const lastServerUpdateRef = useRef<number>(0);
  const isUpdatingRef = useRef<boolean>(false);
  const sessionStartRef = useRef<number>(Date.now());
  
  const analytics = useAnalytics();

  // Get or create user ID
  useEffect(() => {
    if (!roomId) return;
    
    const savedUserId = localStorage.getItem(`planningPoker_userId_${roomId}`);
    if (savedUserId) {
      currentUserIdRef.current = savedUserId;
    }
  }, [roomId]);

  // Fetch room state from server
  const fetchRoomState = useCallback(async () => {
    if (!roomId || isUpdatingRef.current) return;

    try {
      const response = await fetch(`/api/room/${roomId}`);
      
      if (response.status === 404) {
        // Room doesn't exist, create default state
        setRoomState({
          id: roomId,
          currentStory: '',
          votesRevealed: false,
          participants: [],
          maxParticipants: MAX_PARTICIPANTS,
          lastUpdated: Date.now(),
          createdAt: Date.now()
        });
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch room state');
      }

      const serverState = await response.json();
      
      if (serverState && serverState.lastUpdated > lastServerUpdateRef.current) {
        setRoomState(serverState);
        lastServerUpdateRef.current = serverState.lastUpdated;
        
        // Update current user if exists in participants
        const userId = currentUserIdRef.current;
        if (userId) {
          const user = serverState.participants.find((p: Participant) => p.id === userId);
          setCurrentUser(user || null);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching room state:', err);
      setError('Failed to sync with server');
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  // Update room state on server
  const updateRoom = useCallback(async (newState: Partial<RoomState>) => {
    if (!roomState || isUpdatingRef.current) return;

    isUpdatingRef.current = true;
    
    try {
      const updatedState = {
        ...roomState,
        ...newState,
        lastUpdated: Date.now()
      };

      // Optimistic update
      setRoomState(updatedState);

      const response = await fetch(`/api/room/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedState)
      });

      if (!response.ok) {
        throw new Error('Failed to update room');
      }

      const result = await response.json();
      if (result.state) {
        setRoomState(result.state);
        lastServerUpdateRef.current = result.state.lastUpdated;
      }

      setError(null);
    } catch (err) {
      console.error('Error updating room:', err);
      setError('Failed to update room');
      // Revert optimistic update by fetching current state
      await fetchRoomState();
    } finally {
      isUpdatingRef.current = false;
    }
  }, [roomState, roomId, fetchRoomState]);

  // Join room
  const joinRoom = useCallback(async (userName: string): Promise<boolean> => {
    if (!roomState || roomState.participants.length >= roomState.maxParticipants) {
      return false;
    }

    let userId = currentUserIdRef.current;
    if (!userId) {
      userId = generateUserId();
      currentUserIdRef.current = userId;
      localStorage.setItem(`planningPoker_userId_${roomId}`, userId);
    }

    localStorage.setItem('planningPokerUserName', userName);

    const newUser: Participant = {
      id: userId,
      name: userName,
      hasVoted: false
    };

    setCurrentUser(newUser);

    const existingUserIndex = roomState.participants.findIndex(p => p.id === userId);
    let newParticipants;

    if (existingUserIndex >= 0) {
      newParticipants = [...roomState.participants];
      newParticipants[existingUserIndex] = { ...newParticipants[existingUserIndex], name: userName };
    } else {
      newParticipants = [...roomState.participants, newUser];
    }

    await updateRoom({ participants: newParticipants });
    
    // Track join event
    analytics.trackRoomJoined(roomId, newParticipants.length);
    
    return true;
  }, [roomState, roomId, updateRoom, analytics]);

  // Leave room
  const leaveRoom = useCallback(async () => {
    if (!roomState || !currentUserIdRef.current) return;

    const userId = currentUserIdRef.current;
    const newParticipants = roomState.participants.filter(p => p.id !== userId);

    await updateRoom({ participants: newParticipants });
    
    // Track leave event
    const sessionDuration = Math.floor((Date.now() - sessionStartRef.current) / 1000);
    analytics.trackRoomLeft(roomId, sessionDuration);
    
    setCurrentUser(null);
    currentUserIdRef.current = null;
    localStorage.removeItem(`planningPoker_userId_${roomId}`);
  }, [roomState, roomId, updateRoom, analytics]);

  // Vote
  const vote = useCallback(async (value: string) => {
    if (!roomState || !currentUserIdRef.current) return;

    const userId = currentUserIdRef.current;
    const newParticipants = roomState.participants.map(p => 
      p.id === userId ? { ...p, hasVoted: true, vote: value } : p
    );

    await updateRoom({ participants: newParticipants });
    
    // Track vote event
    analytics.trackVoteCast(roomId, value, roomState.participants.length);
  }, [roomState, updateRoom, analytics, roomId]);

  // Reveal votes
  const revealVotes = useCallback(async () => {
    if (!roomState) return;

    const newParticipants = roomState.participants.map(p => ({
      ...p,
      vote: p.hasVoted ? (p.vote || generateRandomVote()) : undefined
    }));

    await updateRoom({ 
      votesRevealed: true,
      participants: newParticipants
    });
    
    // Track reveal votes event
    const voteValues = newParticipants
      .filter(p => p.vote)
      .map(p => p.vote as string);
    analytics.trackVotesRevealed(roomId, roomState.participants.length, voteValues);
  }, [roomState, updateRoom, analytics, roomId]);

  // New round
  const newRound = useCallback(async () => {
    if (!roomState) return;

    const newParticipants = roomState.participants.map(p => ({
      ...p,
      hasVoted: false,
      vote: undefined
    }));

    await updateRoom({
      votesRevealed: false,
      participants: newParticipants
    });
    
    // Track new round event
    analytics.trackNewRoundStarted(roomId, roomState.participants.length);
  }, [roomState, updateRoom, analytics, roomId]);

  // Update story
  const updateStory = useCallback(async (story: string) => {
    await updateRoom({ currentStory: story });
    
    // Track story update event
    analytics.trackStoryUpdated(roomId, story.length);
  }, [updateRoom, analytics, roomId]);

  // Reset votes (clear votes without revealing)
  const resetVotes = useCallback(async () => {
    if (!roomState) return;

    const newParticipants = roomState.participants.map(p => ({
      ...p,
      hasVoted: false,
      vote: undefined
    }));

    await updateRoom({
      votesRevealed: false,
      participants: newParticipants
    });
    
    // Track reset votes event
    analytics.trackEvent('votes_reset', { 
      room_id: roomId, 
      participant_count: roomState.participants.length 
    });
  }, [roomState, updateRoom, analytics, roomId]);

  // Send emoji to participant
  const sendEmoji = useCallback(async (targetUserId: string, emoji: string) => {
    if (!roomState) return;

    const emojiWithTimestamp = {
      emoji,
      timestamp: Date.now()
    };

    const newParticipants = roomState.participants.map(p => {
      if (p.id === targetUserId) {
        const currentEmojis = p.receivedEmojis || [];
        return {
          ...p,
          receivedEmojis: [...currentEmojis, emojiWithTimestamp]
        };
      }
      return p;
    });

    await updateRoom({ participants: newParticipants });
    
    // Track emoji sent event
    analytics.trackEvent('emoji_sent', { 
      room_id: roomId, 
      emoji: emoji,
      participant_count: roomState.participants.length 
    });

    // Auto-remove emoji after 2 seconds
    setTimeout(async () => {
      if (!roomState) return;
      
      const updatedParticipants = roomState.participants.map(p => {
        if (p.id === targetUserId) {
          const filteredEmojis = (p.receivedEmojis || []).filter(
            e => typeof e === 'string' || (e.timestamp && Date.now() - e.timestamp < 2000)
          );
          return {
            ...p,
            receivedEmojis: filteredEmojis
          };
        }
        return p;
      });

      await updateRoom({ participants: updatedParticipants });
    }, 2000);
  }, [roomState, updateRoom, analytics, roomId]);

  // Generate random vote for demo
  const generateRandomVote = () => {
    const votes = ['1', '2', '3', '5', '8'];
    return votes[Math.floor(Math.random() * votes.length)];
  };

  // Initial fetch
  useEffect(() => {
    fetchRoomState();
  }, [fetchRoomState]);

  // Polling for updates
  useEffect(() => {
    if (!roomId) return;

    const interval = setInterval(fetchRoomState, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [roomId, fetchRoomState]);

  // Computed values
  const isRoomFull = roomState ? roomState.participants.length >= roomState.maxParticipants : false;
  const allVoted = roomState ? roomState.participants.length > 0 && roomState.participants.every(p => p.hasVoted) : false;

  return {
    roomState,
    currentUser,
    isLoading,
    error,
    updateRoom,
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
  };
}