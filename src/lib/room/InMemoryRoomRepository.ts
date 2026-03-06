import type { RoomState } from '@/types';
import type { RoomRepository } from './RoomRepository';

const ROOM_TTL_MS = 3600 * 1000; // 1 hour

export class InMemoryRoomRepository implements RoomRepository {
  private readonly store = new Map<string, RoomState>();
  private readonly timeouts = new Map<string, ReturnType<typeof setTimeout>>();

  async get(id: string): Promise<RoomState | null> {
    return this.store.get(id) ?? null;
  }

  async set(id: string, room: RoomState): Promise<void> {
    const existingTimeout = this.timeouts.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      this.timeouts.delete(id);
    }

    this.store.set(id, room);

    const timeout = setTimeout(() => {
      this.store.delete(id);
      this.timeouts.delete(id);
    }, ROOM_TTL_MS);

    this.timeouts.set(id, timeout);
  }

  async delete(id: string): Promise<void> {
    const existingTimeout = this.timeouts.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      this.timeouts.delete(id);
    }
    this.store.delete(id);
  }
}

export const roomRepository: RoomRepository = new InMemoryRoomRepository();
