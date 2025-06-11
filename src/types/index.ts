export interface Participant {
  id: string;
  name: string;
  vote?: string;
  hasVoted: boolean;
}