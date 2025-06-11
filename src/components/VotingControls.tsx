interface VotingControlsProps {
  allVoted: boolean;
  votesRevealed: boolean;
  onRevealVotes: () => void;
  onNewRound: () => void;
}

export default function VotingControls({ allVoted, votesRevealed, onRevealVotes, onNewRound }: VotingControlsProps) {
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