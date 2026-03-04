import { NextRequest, NextResponse } from 'next/server';
import { Participant, RoomAction } from '@/types';

// Dynamic import for KV to handle missing environment variables
async function getKV() {
  try {
    const { kv } = await import('@vercel/kv');
    return kv;
  } catch (error) {
    console.error('KV not available:', error);
    return null;
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
  const kv = await getKV();
  
  if (kv && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      return await kv.get<RoomState>(`room:${id}`);
    } catch (error) {
      console.error('KV get error:', error);
      // Fall back to memory store
    }
  }
  
  // Use memory store as fallback
  return memoryStore.get(`room:${id}`) ?? null;
}

async function setRoom(id: string, data: RoomState): Promise<void> {
  const kv = await getKV();
  
  if (kv && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      await kv.set(`room:${id}`, data, { ex: ROOM_TTL });
      return;
    } catch (error) {
      console.error('KV set error:', error);
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
  const kv = await getKV();
  
  if (kv && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      await kv.del(`room:${id}`);
      return;
    } catch (error) {
      console.error('KV delete error:', error);
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
    
    const kv = await getKV();
    if (!kv || !process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      // If KV is unavailable, we cannot stream effectively. Fall back to initial JSON fetch.
      console.warn('KV not configured for streaming. Falling back to initial JSON fetch.');
      const roomData = await getRoom(id);
      return NextResponse.json(roomData || null, { status: roomData ? 200 : 404 });
    }

    // Logic for streaming using KV Listen API (assuming it's available or we implement polling logic inside the stream)
    // Since KV Listen API is not directly available via standard Vercel KV SDK in this setup, 
    // we must rely on the client polling OR implement a complex mechanism based on re-fetching periodically.
    // Given the constraint, switching to SSE requires a mechanism to know WHEN to push.
    // For simplicity and immediate impact, I will revert to a very short poll time first, 
    // and then suggest a proper WebSocket/SSE implementation if that is insufficient.
    
    // REVERTING TO INITIAL JSON GET for compatibility with existing fetch.
    const roomData = await getRoom(id);
    
    if (!roomData) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(roomData);
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