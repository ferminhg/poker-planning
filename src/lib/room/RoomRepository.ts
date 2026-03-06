import type { RoomState } from '@/types';

export interface RoomRepository {
  get(id: string): Promise<RoomState | null>;
  set(id: string, room: RoomState): Promise<void>;
  delete(id: string): Promise<void>;
}
