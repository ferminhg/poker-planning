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