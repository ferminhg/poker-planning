'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Participant, RoomAction } from '@/types';
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

  // Perform an atomic action on the server
  const performAction = useCallback(async (action: RoomAction) => {
    if (!roomId) return;

    isUpdatingRef.current = true;
    
    try {
      const response = await fetch(`/api/room/${roomId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to perform action');
      }

      const result = await response.json();
      if (result.state) {
        setRoomState(result.state);
        lastServerUpdateRef.current = result.state.lastUpdated;
        
        const userId = currentUserIdRef.current;
        if (userId) {
          const user = result.state.participants.find((p: Participant) => p.id === userId);
          setCurrentUser(user || null);
        }
      }
      setError(null);
    } catch (err) {
      console.error('Error performing action:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync with server');
      await fetchRoomState();
    } finally {
      isUpdatingRef.current = false;
    }
  }, [roomId, fetchRoomState]);

  // Join room
  const joinRoom = useCallback(async (userName: string): Promise<boolean> => {
    let userId = currentUserIdRef.current;
    if (!userId) {
      userId = generateUserId();
      currentUserIdRef.current = userId;
      localStorage.setItem(`planningPoker_userId_${roomId}`, userId);
    }

    localStorage.setItem('planningPokerUserName', userName);

    try {
      await performAction({ 
        type: 'JOIN', 
        userName, 
        userId 
      });
      
      // Track join event
      analytics.trackRoomJoined(roomId, roomState?.participants.length || 0);
      return true;
    } catch (err) {
      return false;
    }
  }, [roomId, performAction, analytics, roomState]);

  // Leave room
  const leaveRoom = useCallback(async () => {
    const userId = currentUserIdRef.current;
    if (!userId) return;

    await performAction({ type: 'LEAVE', userId });
    
    // Track leave event
    const sessionDuration = Math.floor((Date.now() - sessionStartRef.current) / 1000);
    analytics.trackRoomLeft(roomId, sessionDuration);
    
    setCurrentUser(null);
    currentUserIdRef.current = null;
    localStorage.removeItem(`planningPoker_userId_${roomId}`);
  }, [roomId, performAction, analytics]);

  // Vote
  const vote = useCallback(async (value: string) => {
    const userId = currentUserIdRef.current;
    if (!userId) return;

    await performAction({ type: 'VOTE', userId, vote: value });
    
    // Track vote event
    analytics.trackVoteCast(roomId, value, roomState?.participants.length || 0);
  }, [roomId, performAction, analytics, roomState]);

  // Reveal votes
  const revealVotes = useCallback(async () => {
    await performAction({ type: 'REVEAL' });
    
    // Track reveal votes event
    if (roomState) {
      const voteValues = roomState.participants
        .filter(p => p.hasVoted)
        .map(p => p.vote || '');
      analytics.trackVotesRevealed(roomId, roomState.participants.length, voteValues);
    }
  }, [roomId, performAction, analytics, roomState]);

  // New round
  const newRound = useCallback(async () => {
    await performAction({ type: 'NEW_ROUND' });
    
    // Track new round event
    analytics.trackNewRoundStarted(roomId, roomState?.participants.length || 0);
  }, [roomId, performAction, analytics, roomState]);

  // Update story
  const updateStory = useCallback(async (story: string) => {
    await performAction({ type: 'UPDATE_STORY', story });
    
    // Track story update event
    analytics.trackStoryUpdated(roomId, story.length);
  }, [roomId, performAction, analytics]);

  // Reset votes (clear votes without revealing)
  const resetVotes = useCallback(async () => {
    await performAction({ type: 'NEW_ROUND' });
    
    // Track reset votes event
    analytics.trackEvent('votes_reset', { 
      room_id: roomId, 
      participant_count: roomState?.participants.length || 0
    });
  }, [roomId, performAction, analytics, roomState]);

  // Send emoji to participant
  const sendEmoji = useCallback(async (targetUserId: string, emoji: string) => {
    const timestamp = Date.now();
    await performAction({ 
      type: 'SEND_EMOJI', 
      targetUserId, 
      emoji, 
      timestamp 
    });
    
    // Track emoji sent event
    analytics.trackEvent('emoji_sent', { 
      room_id: roomId, 
      emoji: emoji,
      participant_count: roomState?.participants.length || 0
    });

    // Auto-remove emoji after 2 seconds
    setTimeout(async () => {
      await performAction({ 
        type: 'REMOVE_EMOJI', 
        targetUserId, 
        timestamp 
      });
    }, 2000);
  }, [roomId, performAction, analytics, roomState]);

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
