interface VotingControlsProps {
  votesRevealed: boolean;
  hasAnyVotes: boolean;
  onNewRound: () => void;
  onResetVotes: () => void;
}

export default function VotingControls({ votesRevealed, hasAnyVotes, onNewRound, onResetVotes }: VotingControlsProps) {
  return (
    <div className="text-center space-x-3">
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