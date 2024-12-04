import React, { useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export function GroupSelector() {
  const { groups, currentGroupId, setCurrentGroup, addGroup } = useStore();
  const [newGroupName, setNewGroupName] = React.useState('');

  // Set the first group as current if none is selected
  useEffect(() => {
    if (groups.length > 0 && !currentGroupId) {
      setCurrentGroup(groups[0].id);
    }
  }, [groups, currentGroupId, setCurrentGroup]);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    
    await addGroup(newGroupName);
    setNewGroupName('');
  };

  return (
    <div className="retro-container">
      <h2 className="text-xl mb-6 text-primary">SELECT GROUP</h2>
      
      <div className="space-y-6">
        {groups.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => setCurrentGroup(group.id)}
                className={`retro-button ${
                  currentGroupId === group.id
                    ? 'bg-secondary'
                    : 'bg-primary'
                }`}
              >
                {group.name}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleCreateGroup} className="flex gap-4">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="NEW GROUP"
            className="retro-input flex-1"
          />
          <button
            type="submit"
            className="retro-button bg-secondary flex items-center gap-2"
          >
            <PlusCircle size={20} />
            CREATE
          </button>
        </form>
      </div>
    </div>
  );
}