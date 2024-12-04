import React from 'react';
import { BarChart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Player } from '../types';

interface PlayerStats {
  player: Player;
  matches: number;
  wins: number;
  losses: number;
  winRatio: number;
}

export function Statistics() {
  const { groups, currentGroupId } = useStore();
  const currentGroup = groups.find((g) => g.id === currentGroupId);

  if (!currentGroup) return null;

  const playerStats: PlayerStats[] = currentGroup.players.map((player) => {
    const playerMatches = currentGroup.matches.filter(
      (match) =>
        match.isFinished &&
        (match.team1.some((p) => p.id === player.id) ||
          match.team2.some((p) => p.id === player.id))
    );

    const wins = playerMatches.filter((match) => {
      const inTeam1 = match.team1.some((p) => p.id === player.id);
      return inTeam1 ? match.scoreTeam1 > match.scoreTeam2 : match.scoreTeam2 > match.scoreTeam1;
    }).length;

    return {
      player,
      matches: playerMatches.length,
      wins,
      losses: playerMatches.length - wins,
      winRatio: playerMatches.length > 0 ? (wins / playerMatches.length) * 100 : 0,
    };
  });

  const sortedStats = playerStats.sort((a, b) => b.winRatio - a.winRatio);

  return (
    <div className="retro-container">
      <div className="flex items-center gap-4 mb-6">
        <BarChart className="text-secondary" size={24} />
        <h2 className="text-xl text-secondary">STATISTICS</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-white">
              <th className="text-left py-2">PLAYER</th>
              <th className="text-center py-2">MATCHES</th>
              <th className="text-center py-2">WINS</th>
              <th className="text-center py-2">LOSSES</th>
              <th className="text-center py-2">WIN %</th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map(({ player, matches, wins, losses, winRatio }) => (
              <tr key={player.id} className="border-b border-gray-700">
                <td className="py-2">{player.name}</td>
                <td className="text-center py-2">{matches}</td>
                <td className="text-center py-2 text-primary">{wins}</td>
                <td className="text-center py-2 text-red-500">{losses}</td>
                <td className="text-center py-2">{winRatio.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}