import { SupabaseRoomRepository } from '../SupabaseRoomRepository';
import type { RoomState } from '@/types';

// Mock del cliente de Supabase
const mockFrom = jest.fn();
const mockClient = { from: mockFrom };
jest.mock('../SupabaseClientServer', () => ({
  getSupabaseServerClient: () => mockClient,
}));

const baseRoom: RoomState = {
  id: 'room-1',
  currentStory: 'Story 1',
  votesRevealed: false,
  participants: [{ id: 'user-1', name: 'Alice', hasVoted: true, vote: '5' }],
  maxParticipants: 10,
  lastUpdated: 1000,
  createdAt: 900,
};

describe('SupabaseRoomRepository', () => {
  let repo: SupabaseRoomRepository;

  beforeEach(() => {
    repo = new SupabaseRoomRepository();
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('returns null when room does not exist', async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest
              .fn()
              .mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      });
      const result = await repo.get('nonexistent');
      expect(result).toBeNull();
    });

    it('returns RoomState assembled from all three tables', async () => {
      const roomRow = {
        id: 'room-1',
        current_story: 'Story 1',
        votes_revealed: false,
        max_participants: 10,
        created_at: new Date(900).toISOString(),
        updated_at: new Date(1000).toISOString(),
      };
      const participantsRows = [
        {
          id: 'user-1',
          room_id: 'room-1',
          name: 'Alice',
          joined_at: new Date().toISOString(),
        },
      ];
      const votesRows = [
        {
          participant_id: 'user-1',
          room_id: 'room-1',
          vote_value: '5',
          voted_at: new Date().toISOString(),
        },
      ];

      mockFrom.mockImplementation((table: string) => {
        if (table === 'rooms')
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest
                  .fn()
                  .mockResolvedValue({ data: roomRow, error: null }),
              }),
            }),
          };
        if (table === 'participants')
          return {
            select: jest.fn().mockReturnValue({
              eq: jest
                .fn()
                .mockResolvedValue({ data: participantsRows, error: null }),
            }),
          };
        if (table === 'votes')
          return {
            select: jest.fn().mockReturnValue({
              eq: jest
                .fn()
                .mockResolvedValue({ data: votesRows, error: null }),
            }),
          };
        return {};
      });

      const result = await repo.get('room-1');
      expect(result).not.toBeNull();
      expect(result!.id).toBe('room-1');
      expect(result!.participants[0].vote).toBe('5');
      expect(result!.participants[0].hasVoted).toBe(true);
    });
  });

  describe('set', () => {
    it('upserts room, participants and votes', async () => {
      const upsertMock = jest.fn().mockResolvedValue({ error: null });
      const deleteMock = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          in: jest.fn().mockResolvedValue({ error: null }),
        }),
      });
      mockFrom.mockReturnValue({ upsert: upsertMock, delete: deleteMock });

      await repo.set('room-1', baseRoom);
      expect(upsertMock).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deletes the room by id', async () => {
      const eqMock = jest.fn().mockResolvedValue({ error: null });
      const deleteMock = jest.fn().mockReturnValue({ eq: eqMock });
      mockFrom.mockReturnValue({ delete: deleteMock });

      await repo.delete('room-1');
      expect(eqMock).toHaveBeenCalledWith('id', 'room-1');
    });
  });
});
