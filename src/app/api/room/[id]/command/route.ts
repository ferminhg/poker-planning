import { NextRequest, NextResponse } from 'next/server';
import { supabaseRoomRepository as roomRepository } from '@/lib/room/supabase/SupabaseRoomRepository';

type VoteCommand = {
  type: 'VOTE';
  userId: string;
  vote: string;
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const command: VoteCommand = await request.json();

    if (command.type !== 'VOTE') {
      return NextResponse.json(
        { error: 'Only VOTE command is supported' },
        { status: 400 }
      );
    }

    if (!command.userId || !command.vote) {
      return NextResponse.json(
        { error: 'userId and vote are required' },
        { status: 400 }
      );
    }

    const roomState = await roomRepository.get(id);
    if (!roomState) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const participantIndex = roomState.participants.findIndex(
      (p) => p.id === command.userId
    );
    if (participantIndex === -1) {
      return NextResponse.json(
        { error: 'Forbidden: user is not a participant in this room' },
        { status: 403 }
      );
    }

    const newState = {
      ...roomState,
      lastUpdated: Date.now(),
      participants: roomState.participants.map((p) =>
        p.id === command.userId
          ? { ...p, hasVoted: true, vote: command.vote }
          : p
      ),
    };

    await roomRepository.set(id, newState);

    return NextResponse.json({ success: true, state: newState });
  } catch (error) {
    console.error('Error applying command:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
