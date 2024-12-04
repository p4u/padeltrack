import React from 'react';
import { GroupSelector } from './components/GroupSelector';
import { PlayerList } from './components/PlayerList';
import { MatchCreator } from './components/MatchCreator';
import { ActiveMatch } from './components/ActiveMatch';
import { Statistics } from './components/Statistics';
import { useStore } from './store/useStore';

function App() {
  const { groups, currentGroupId } = useStore();
  const currentGroup = groups.find((g) => g.id === currentGroupId);
  const activeMatch = currentGroup?.matches.find((m) => !m.isFinished);

  return (
    <div className="min-h-screen bg-background font-pixel">
      <header className="border-b-4 border-primary bg-gray-900 mb-4 sm:mb-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl text-white flex items-center justify-center sm:justify-start gap-3">
            <span className="animate-bounce">🎾</span>
            <span className="text-primary">PADEL</span>
            <span className="text-secondary">MATCH</span>
            <span className="text-accent">TRACKER</span>
            <span className="animate-bounce">🏆</span>
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-4 sm:space-y-8">
          <GroupSelector />
          {currentGroupId && (
            <>
              <PlayerList />
              {activeMatch ? (
                <ActiveMatch match={activeMatch} />
              ) : (
                <MatchCreator />
              )}
              <Statistics />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;