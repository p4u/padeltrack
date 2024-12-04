import React from 'react';
import { Swords } from 'lucide-react';
import { useStore } from '../store/useStore';

export function MatchCreator() {
  const { groups, currentGroupId, startMatch } = useStore();
  const [selectedPlayers, setSelectedPlayers] = React.useState<string[]>([]);

  const currentGroup = groups.find((g) => g.id === currentGroupId);
  if (!currentGroup) return null;

  const handlePlayerToggle = (playerId: string) => {
    setSelectedPlayers((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      }
      if (prev.length >= 4) return prev;
      return [...prev, playerId];
    });
  };

  const handleStartMatch = () => {
    if (selectedPlayers.length !== 4 || !currentGroupId) return;
    startMatch(currentGroupId, selectedPlayers);
    setSelectedPlayers([]);
  };

  return (
    <div className="retro-container">
      <div className="flex items-center gap-4 mb-6">
        <Swords className="text-primary" size={24} />
        <h2 className="text-xl text-primary">NEW MATCH</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {currentGroup.players.map((player) => (
            <button
              key={player.id}
              onClick={() => handlePlayerToggle(player.id)}
              className={`px-4 py-3 rounded-lg border-2 transition-all ${
                selectedPlayers.includes(player.id)
                  ? 'bg-secondary border-white text-black'
                  : 'bg-gray-800 border-gray-600'
              }`}
            >
              {player.name}
            </button>
          ))}
        </div>

        <button
          onClick={handleStartMatch}
          disabled={selectedPlayers.length !== 4}
          className={`retro-button w-full ${
            selectedPlayers.length === 4 ? 'bg-primary' : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          START MATCH ({selectedPlayers.length}/4)
        </button>
      </div>
    </div>
  );
}