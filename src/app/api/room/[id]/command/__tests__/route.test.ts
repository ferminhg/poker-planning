/**
 * @jest-environment node
 */
import { PATCH } from '../route';
import { NextRequest } from 'next/server';
import { supabaseRoomRepository } from '@/lib/room/supabase/SupabaseRoomRepository';

jest.mock('@/lib/room/supabase/SupabaseRoomRepository', () => ({
  supabaseRoomRepository: {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockGet = supabaseRoomRepository.get as jest.Mock;
const mockSet = supabaseRoomRepository.set as jest.Mock;

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/room/room-1/command', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

const params = Promise.resolve({ id: 'room-1' });

describe('PATCH /api/room/[id]/command', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 404 if room does not exist', async () => {
    mockGet.mockResolvedValue(null);
    const res = await PATCH(makeRequest({ type: 'VOTE', userId: 'u1', vote: '5' }), {
      params,
    });
    expect(res.status).toBe(404);
  });

  it('returns 403 if userId is not a participant', async () => {
    mockGet.mockResolvedValue({
      id: 'room-1',
      participants: [{ id: 'other', name: 'Bob', hasVoted: false }],
      votesRevealed: false,
      maxParticipants: 10,
      lastUpdated: 0,
      createdAt: 0,
    });
    const res = await PATCH(makeRequest({ type: 'VOTE', userId: 'u1', vote: '5' }), {
      params,
    });
    expect(res.status).toBe(403);
  });

  it('applies VOTE command and returns updated state', async () => {
    const room = {
      id: 'room-1',
      participants: [{ id: 'u1', name: 'Alice', hasVoted: false }],
      votesRevealed: false,
      maxParticipants: 10,
      lastUpdated: 0,
      createdAt: 0,
    };
    mockGet.mockResolvedValue(room);
    mockSet.mockResolvedValue(undefined);
    const res = await PATCH(makeRequest({ type: 'VOTE', userId: 'u1', vote: '5' }), {
      params,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.state.participants[0].hasVoted).toBe(true);
    expect(body.state.participants[0].vote).toBe('5');
  });
});
