interface VotingControlsProps {
  allVoted: boolean;
  votesRevealed: boolean;
  hasAnyVotes: boolean;
  onRevealVotes: () => void;
  onNewRound: () => void;
  onResetVotes: () => void;
}

export default function VotingControls({ allVoted, votesRevealed, hasAnyVotes, onRevealVotes, onNewRound, onResetVotes }: VotingControlsProps) {
  return (
    <div className="text-center space-x-3">
      {allVoted && !votesRevealed && (
        <button
          onClick={onRevealVotes}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Reveal Votes
        </button>
      )}
      
      {hasAnyVotes && !votesRevealed && (
        <button
          onClick={onResetVotes}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Reset Votes
        </button>
      )}
      
      {votesRevealed && (
        <button
          onClick={onNewRound}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          New Round
        </button>
      )}
    </div>
  );
}