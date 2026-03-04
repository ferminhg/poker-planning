import { NextRequest, NextResponse } from 'next/server';
import { Participant, RoomAction } from '@/types';

// KV availability check
let kvAvailable: boolean | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let kvInstance: any = null;

async function initializeKV() {
  if (kvAvailable !== null) return;

  try {
    const { kv } = await import('@vercel/kv');
    kvInstance = kv;

    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      kvAvailable = true;
    } else {
      kvAvailable = false;
    }
  } catch (error) {
    kvAvailable = false;
  }
}

// Fallback in-memory storage for development
const memoryStore = new Map<string, RoomState>();

interface RoomState {
  id: string;
  currentStory: string;
  votesRevealed: boolean;
  participants: Participant[];
  maxParticipants: number;
  lastUpdated: number;
  createdAt: number;
}

const ROOM_TTL = 3600; // 1 hour

// Storage abstraction layer
async function getRoom(id: string): Promise<RoomState | null> {
  await initializeKV();

  if (kvAvailable && kvInstance) {
    try {
      return (await kvInstance.get(`room:${id}`)) as RoomState | null;
    } catch (error) {
      console.warn('KV get failed, using memory store:', error);
      // Fall back to memory store
    }
  }

  // Use memory store as fallback
  return memoryStore.get(`room:${id}`) ?? null;
}

async function setRoom(id: string, data: RoomState): Promise<void> {
  await initializeKV();

  if (kvAvailable && kvInstance) {
    try {
      await kvInstance.set(`room:${id}`, data, { ex: ROOM_TTL });
      return;
    } catch (error) {
      console.warn('KV set failed, using memory store:', error);
      // Fall back to memory store
    }
  }

  // Use memory store as fallback
  memoryStore.set(`room:${id}`, data);

  // Clean up memory store after TTL (simple cleanup)
  setTimeout(() => {
    memoryStore.delete(`room:${id}`);
  }, ROOM_TTL * 1000);
}

async function deleteRoom(id: string): Promise<void> {
  await initializeKV();

  if (kvAvailable && kvInstance) {
    try {
      await kvInstance.del(`room:${id}`);
      return;
    } catch (error) {
      console.warn('KV delete failed, using memory store:', error);
      // Fall back to memory store
    }
  }

  // Use memory store as fallback
  memoryStore.delete(`room:${id}`);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roomData = await getRoom(id);

    return NextResponse.json(roomData || null, { status: roomData ? 200 : 404 });
  } catch (error) {
    console.error('Error getting room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const MAX_PARTICIPANTS = 10;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roomState: RoomState = await request.json();
    
    // Validate room state
    if (!roomState || typeof roomState !== 'object') {
      return NextResponse.json({ error: 'Invalid room state' }, { status: 400 });
    }

    // Ensure required fields
    const validatedState: RoomState = {
      id,
      currentStory: roomState.currentStory || '',
      votesRevealed: Boolean(roomState.votesRevealed),
      participants: Array.isArray(roomState.participants) ? roomState.participants : [],
      maxParticipants: roomState.maxParticipants || MAX_PARTICIPANTS,
      lastUpdated: Date.now(),
      createdAt: roomState.createdAt || Date.now()
    };

    // Limit participants to maxParticipants
    if (validatedState.participants.length > validatedState.maxParticipants) {
      validatedState.participants = validatedState.participants.slice(0, validatedState.maxParticipants);
    }

    // Save to storage
    await setRoom(id, validatedState);

    return NextResponse.json({ success: true, state: validatedState });
  } catch (error) {
    console.error('Error saving room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const action: RoomAction = await request.json();
    
    // Get current state
    let roomState = await getRoom(id);
    
    // If room doesn't exist and it's not a JOIN action, return error
    if (!roomState && action.type !== 'JOIN') {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Initialize room if it doesn't exist (only for JOIN)
    if (!roomState) {
      roomState = {
        id,
        currentStory: '',
        votesRevealed: false,
        participants: [],
        maxParticipants: MAX_PARTICIPANTS,
        lastUpdated: Date.now(),
        createdAt: Date.now()
      };
    }

    const newState = { ...roomState };
    newState.lastUpdated = Date.now();

    switch (action.type) {
      case 'JOIN': {
        const existingUserIndex = newState.participants.findIndex(p => p.id === action.userId);
        if (existingUserIndex >= 0) {
          newState.participants[existingUserIndex] = { 
            ...newState.participants[existingUserIndex], 
            name: action.userName 
          };
        } else {
          if (newState.participants.length >= newState.maxParticipants) {
            return NextResponse.json({ error: 'Room is full' }, { status: 400 });
          }
          newState.participants.push({
            id: action.userId,
            name: action.userName,
            hasVoted: false
          });
        }
        break;
      }
      case 'LEAVE': {
        newState.participants = newState.participants.filter(p => p.id !== action.userId);
        break;
      }
      case 'VOTE': {
        newState.participants = newState.participants.map(p => 
          p.id === action.userId ? { ...p, hasVoted: true, vote: action.vote } : p
        );
        break;
      }
      case 'REVEAL': {
        newState.votesRevealed = true;
        // Ensure all participants who voted have their vote set (fallback for logic in reveal)
        newState.participants = newState.participants.map(p => ({
          ...p,
          vote: p.hasVoted ? (p.vote || '1') : undefined
        }));
        break;
      }
      case 'NEW_ROUND': {
        newState.votesRevealed = false;
        newState.participants = newState.participants.map(p => ({
          ...p,
          hasVoted: false,
          vote: undefined
        }));
        break;
      }
      case 'UPDATE_STORY': {
        newState.currentStory = action.story;
        break;
      }
      case 'SEND_EMOJI': {
        const emojiWithTimestamp = {
          emoji: action.emoji,
          timestamp: action.timestamp
        };
        newState.participants = newState.participants.map(p => {
          if (p.id === action.targetUserId) {
            const currentEmojis = p.receivedEmojis || [];
            return {
              ...p,
              receivedEmojis: [...currentEmojis, emojiWithTimestamp]
            };
          }
          return p;
        });
        break;
      }
      case 'REMOVE_EMOJI': {
        newState.participants = newState.participants.map(p => {
          if (p.id === action.targetUserId) {
            const currentEmojis = p.receivedEmojis || [];
            return {
              ...p,
              receivedEmojis: currentEmojis.filter(e => 
                typeof e === 'string' || e.timestamp !== action.timestamp
              )
            };
          }
          return p;
        });
        break;
      }
      default:
        return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
    }

    // Save back to storage
    await setRoom(id, newState);

    return NextResponse.json({ success: true, state: newState });
  } catch (error) {
    console.error('Error applying action:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteRoom(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}