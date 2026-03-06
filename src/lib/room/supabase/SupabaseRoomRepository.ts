import type { RoomState, Participant } from '@/types';
import type { RoomRepository } from '../RoomRepository';
import { getSupabaseServerClient } from './SupabaseClientServer';

export class SupabaseRoomRepository implements RoomRepository {
  private get client() {
    return getSupabaseServerClient();
  }

  async get(id: string): Promise<RoomState | null> {
    const { data: roomRow, error: roomError } = await this.client
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();

    if (roomError || !roomRow) return null;

    const { data: participantsRows } = await this.client
      .from('participants')
      .select('*')
      .eq('room_id', id);

    const { data: votesRows } = await this.client
      .from('votes')
      .select('*')
      .eq('room_id', id);

    const votesMap = new Map(
      (votesRows ?? []).map(
        (v: { participant_id: string; vote_value: string }) => [
          v.participant_id,
          v.vote_value,
        ]
      )
    );

    const participants: Participant[] = (participantsRows ?? []).map(
      (p: {
        id: string;
        name: string;
        received_emojis?: (string | { emoji: string; timestamp: number })[];
      }) => {
        const vote = votesMap.get(p.id);
        return {
          id: p.id,
          name: p.name,
          hasVoted: votesMap.has(p.id),
          vote: vote ?? undefined,
          receivedEmojis: p.received_emojis ?? undefined,
        };
      }
    );

    return {
      id: roomRow.id,
      votesRevealed: roomRow.votes_revealed,
      maxParticipants: roomRow.max_participants,
      participants,
      lastUpdated: new Date(roomRow.updated_at).getTime(),
      createdAt: new Date(roomRow.created_at).getTime(),
    };
  }

  async set(id: string, room: RoomState): Promise<void> {
    const { error: roomError } = await this.client.from('rooms').upsert({
      id,
      current_story: '',
      votes_revealed: room.votesRevealed,
      max_participants: room.maxParticipants,
      updated_at: new Date(room.lastUpdated).toISOString(),
      created_at: new Date(room.createdAt).toISOString(),
    });

    if (roomError)
      throw new Error(`Failed to upsert room: ${roomError.message}`);

    if (room.participants.length > 0) {
      const { error: pError } = await this.client
        .from('participants')
        .upsert(
          room.participants.map((p) => ({
            id: p.id,
            room_id: id,
            name: p.name,
            received_emojis: p.receivedEmojis ?? [],
          }))
        );
      if (pError)
        throw new Error(`Failed to upsert participants: ${pError.message}`);
    }

    const nonVotingIds = room.participants
      .filter((p) => !p.hasVoted)
      .map((p) => p.id);

    if (nonVotingIds.length > 0) {
      const { error: deleteError } = await this.client
        .from('votes')
        .delete()
        .eq('room_id', id)
        .in('participant_id', nonVotingIds);
      if (deleteError)
        throw new Error(`Failed to delete votes: ${deleteError.message}`);
    }

    const votingParticipants = room.participants.filter(
      (p) => p.hasVoted && p.vote !== undefined
    );

    if (votingParticipants.length > 0) {
      const { error: vError } = await this.client.from('votes').upsert(
        votingParticipants.map((p) => ({
          participant_id: p.id,
          room_id: id,
          vote_value: p.vote!,
          voted_at: new Date().toISOString(),
        }))
      );
      if (vError) throw new Error(`Failed to upsert votes: ${vError.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from('rooms').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete room: ${error.message}`);
  }
}

export const supabaseRoomRepository: RoomRepository =
  new SupabaseRoomRepository();
