import React from 'react';
import { UserPlus, Users } from 'lucide-react';
import { useStore } from '../store/useStore';

export function PlayerList() {
  const { groups, currentGroupId, addPlayer } = useStore();
  const [newPlayerName, setNewPlayerName] = React.useState('');

  const currentGroup = groups.find((g) => g.id === currentGroupId);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGroupId || !newPlayerName.trim()) return;

    addPlayer(currentGroupId, newPlayerName);
    setNewPlayerName('');
  };

  if (!currentGroup) return null;

  return (
    <div className="retro-container">
      <div className="flex items-center gap-4 mb-6">
        <Users className="text-secondary" size={24} />
        <h2 className="text-xl text-secondary">PLAYERS</h2>
      </div>

      <div className="space-y-6">
        {currentGroup.players.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentGroup.players.map((player) => (
              <div
                key={player.id}
                className="player-list-item"
              >
                {player.name}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddPlayer} className="flex gap-4">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="PLAYER NAME"
            className="retro-input flex-1"
          />
          <button
            type="submit"
            className="retro-button bg-secondary flex items-center gap-2"
          >
            <UserPlus size={20} />
            ADD
          </button>
        </form>
      </div>
    </div>
  );
}