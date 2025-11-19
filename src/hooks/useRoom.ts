'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Participant } from '@/types';

interface RoomState {
  id: string;
  currentStory: string;
  votesRevealed: boolean;
  participants: Participant[];
  maxParticipants: number;
  lastUpdated: number;
}

interface UseRoomReturn {
  roomState: RoomState;
  currentUser: Participant | null;
  updateStory: (story: string) => void;
  joinRoom: (userName: string) => boolean;
  leaveRoom: () => void;
  vote: (value: string) => void;
  revealVotes: () => void;
  newRound: () => void;
  isRoomFull: boolean;
  allVoted: boolean;
}

const generateUserId = () => Math.random().toString(36).substring(2, 15);
const MAX_PARTICIPANTS = 10;

// Storage keys
const getRoomStorageKey = (roomId: string) => `planningPoker_room_${roomId}`;
const getUserIdKey = (roomId: string) => `planningPoker_userId_${roomId}`;

export function useRoom(roomId: string): UseRoomReturn {
  const currentUserIdRef = useRef<string | null>(null);
  
  const [roomState, setRoomState] = useState<RoomState>({
    id: roomId,
    currentStory: '',
    votesRevealed: false,
    participants: [],
    maxParticipants: MAX_PARTICIPANTS,
    lastUpdated: Date.now()
  });

  const [currentUser, setCurrentUser] = useState<Participant | null>(null);

  // Load room state from localStorage
  const loadRoomState = useCallback(() => {
    try {
      const savedRoom = localStorage.getItem(getRoomStorageKey(roomId));
      if (savedRoom) {
        const parsedRoom: RoomState = JSON.parse(savedRoom);
        setRoomState(parsedRoom);
        return parsedRoom;
      }
    } catch (error) {
      console.error('Error loading room state:', error);
    }
    return null;
  }, [roomId]);

  // Save room state to localStorage
  const saveRoomState = useCallback((newState: RoomState) => {
    try {
      const stateToSave = { ...newState, lastUpdated: Date.now() };
      localStorage.setItem(getRoomStorageKey(roomId), JSON.stringify(stateToSave));
      setRoomState(stateToSave);
      
      // Dispatch custom event to notify other tabs
      window.dispatchEvent(new CustomEvent('roomStateChanged', { 
        detail: { roomId, state: stateToSave } 
      }));
    } catch (error) {
      console.error('Error saving room state:', error);
    }
  }, [roomId]);

  // Listen for room state changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === getRoomStorageKey(roomId) && e.newValue) {
        try {
          const newState: RoomState = JSON.parse(e.newValue);
          setRoomState(newState);
        } catch (error) {
          console.error('Error parsing room state from storage:', error);
        }
      }
    };

    const handleRoomStateChange = (e: CustomEvent) => {
      if (e.detail.roomId === roomId) {
        setRoomState(e.detail.state);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('roomStateChanged', handleRoomStateChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('roomStateChanged', handleRoomStateChange as EventListener);
    };
  }, [roomId]);

  // Initialize room and user
  useEffect(() => {
    if (!roomId) return;

    // Load existing room state
    const existingRoom = loadRoomState();
    
    // Get or create user ID
    const savedUserId = localStorage.getItem(getUserIdKey(roomId));
    const savedUserName = localStorage.getItem('planningPokerUserName');
    
    if (savedUserId && savedUserName) {
      currentUserIdRef.current = savedUserId;
      
      // Check if user exists in room state
      const existingUser = existingRoom?.participants.find(p => p.id === savedUserId);
      if (existingUser) {
        setCurrentUser(existingUser);
      } else {
        // User not in room, will need to join again
        setCurrentUser(null);
      }
    }
  }, [roomId, loadRoomState]);

  // Update current user when room state changes
  useEffect(() => {
    const userId = currentUserIdRef.current;
    if (userId) {
      const updatedUser = roomState.participants.find(p => p.id === userId);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      } else {
        // User was removed from room
        setCurrentUser(null);
      }
    }
  }, [roomState.participants]);

  const joinRoom = (userName: string): boolean => {
    if (roomState.participants.length >= roomState.maxParticipants) {
      return false; // Room is full
    }

    let userId = currentUserIdRef.current;
    
    // If user doesn't have an ID or is rejoining, create/use one
    if (!userId) {
      userId = generateUserId();
      currentUserIdRef.current = userId;
      localStorage.setItem(getUserIdKey(roomId), userId);
    }
    
    localStorage.setItem('planningPokerUserName', userName);

    const newUser: Participant = {
      id: userId,
      name: userName,
      hasVoted: false
    };

    setCurrentUser(newUser);
    
    // Update room state and save to localStorage
    const newRoomState = { ...roomState };
    const existingUserIndex = newRoomState.participants.findIndex(p => p.id === userId);
    
    if (existingUserIndex >= 0) {
      // Update existing user
      newRoomState.participants[existingUserIndex] = { ...newRoomState.participants[existingUserIndex], name: userName };
    } else {
      // Add new user
      newRoomState.participants = [...newRoomState.participants, newUser];
    }
    
    saveRoomState(newRoomState);
    return true;
  };

  const leaveRoom = () => {
    const userId = currentUserIdRef.current;
    if (!userId) return;

    const newRoomState = {
      ...roomState,
      participants: roomState.participants.filter(p => p.id !== userId)
    };

    saveRoomState(newRoomState);
    setCurrentUser(null);
    currentUserIdRef.current = null;
    localStorage.removeItem(getUserIdKey(roomId));
  };

  const updateStory = (story: string) => {
    const newRoomState = {
      ...roomState,
      currentStory: story
    };
    saveRoomState(newRoomState);
  };

  const vote = (value: string) => {
    const userId = currentUserIdRef.current;
    if (!userId) return;

    const newRoomState = {
      ...roomState,
      participants: roomState.participants.map(p => 
        p.id === userId ? { ...p, hasVoted: true, vote: value } : p
      )
    };
    saveRoomState(newRoomState);
  };

  const revealVotes = () => {
    const newRoomState = {
      ...roomState,
      votesRevealed: true,
      participants: roomState.participants.map(p => ({
        ...p,
        vote: p.hasVoted ? (p.vote || generateRandomVote()) : undefined
      }))
    };
    saveRoomState(newRoomState);
  };

  const newRound = () => {
    const newRoomState = {
      ...roomState,
      votesRevealed: false,
      participants: roomState.participants.map(p => ({ 
        ...p, 
        hasVoted: false, 
        vote: undefined 
      }))
    };
    saveRoomState(newRoomState);
  };

  const generateRandomVote = () => {
    const votes = ['1', '2', '3', '5', '8'];
    return votes[Math.floor(Math.random() * votes.length)];
  };

  const isRoomFull = roomState.participants.length >= roomState.maxParticipants;
  const allVoted = roomState.participants.length > 0 && roomState.participants.every(p => p.hasVoted);

  return {
    roomState,
    currentUser,
    updateStory,
    joinRoom,
    leaveRoom,
    vote,
    revealVotes,
    newRound,
    isRoomFull,
    allVoted
  };
}