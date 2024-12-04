import React from 'react';
import { Trophy } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Match } from '../types';

interface ActiveMatchProps {
  match: Match;
}

export function ActiveMatch({ match }: ActiveMatchProps) {
  const { submitMatchResult } = useStore();
  const [scoreTeam1, setScoreTeam1] = React.useState(0);
  const [scoreTeam2, setScoreTeam2] = React.useState(0);

  const handleSubmitScore = () => {
    submitMatchResult(match.id, scoreTeam1, scoreTeam2);
  };

  return (
    <div className="retro-container border-primary">
      <div className="flex items-center gap-4 mb-6">
        <Trophy className="text-primary" size={24} />
        <h2 className="text-xl text-primary">ACTIVE MATCH</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg text-secondary mb-4">TEAM 1</h3>
          {match.team1.map((player) => (
            <div key={player.id} className="px-4 py-2 bg-gray-800 rounded">
              {player.name}
            </div>
          ))}
          <input
            type="number"
            min="0"
            max="8"
            value={scoreTeam1}
            onChange={(e) => setScoreTeam1(Number(e.target.value))}
            className="retro-input w-full"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg text-secondary mb-4">TEAM 2</h3>
          {match.team2.map((player) => (
            <div key={player.id} className="px-4 py-2 bg-gray-800 rounded">
              {player.name}
            </div>
          ))}
          <input
            type="number"
            min="0"
            max="8"
            value={scoreTeam2}
            onChange={(e) => setScoreTeam2(Number(e.target.value))}
            className="retro-input w-full"
          />
        </div>
      </div>

      <button
        onClick={handleSubmitScore}
        className="retro-button w-full mt-8 bg-primary"
      >
        SUBMIT SCORE
      </button>
    </div>
  );
}