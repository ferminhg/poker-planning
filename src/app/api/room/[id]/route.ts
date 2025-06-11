import { NextRequest, NextResponse } from 'next/server';
import { Participant } from '@/types';

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
const memoryStore = new Map<string, any>();

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
  return memoryStore.get(`room:${id}`) || null;
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
      maxParticipants: roomState.maxParticipants || 4,
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