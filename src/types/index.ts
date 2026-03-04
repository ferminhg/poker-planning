export interface EmojiWithTimestamp {
  emoji: string;
  timestamp: number;
}

export interface Participant {
  id: string;
  name: string;
  vote?: string;
  hasVoted: boolean;
  receivedEmojis?: (string | EmojiWithTimestamp)[];
}

export type RoomAction = 
  | { type: 'JOIN'; userName: string; userId: string }
  | { type: 'LEAVE'; userId: string }
  | { type: 'VOTE'; userId: string; vote: string }
  | { type: 'REVEAL' }
  | { type: 'NEW_ROUND' }
  | { type: 'UPDATE_STORY'; story: string }
  | { type: 'SEND_EMOJI'; targetUserId: string; emoji: string; timestamp: number }
  | { type: 'REMOVE_EMOJI'; targetUserId: string; timestamp: number };
