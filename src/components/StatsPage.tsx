import React, { useState } from 'react';
import PlayerStatsPage from './PlayerStatsPage';
import PlayerStatsPage from './PlayerStatsPage';
import GameStatsPage from './GameStatsPage';
  games: Game[];

  selectedGameId?: number;
}
  games: Game[];
  onNavigation: (view: string, id?: number, source?: string) => void;
  currentView: string;
  selectedPlayerId?: number;
  selectedGameId?: number;
  initialTab?: 'players' | 'games';
}

export default function StatsPage({
  players,
  const 
  onNavigation,
      onNaviga
  selectedPlayerId,
    } else {
  initialTab = 'players'
  };
  const [activeTab, setActiveTab] = useState<'players' | 'games'>(initialTab);

  const handleBackNavigation = () => {
    // Go back to the appropriate page based on context
    if (selectedPlayerId) {
      onNavigation('players');
    } else if (selectedGameId) {
          </button>
    } else {
      onNavigation('dashboard');
    }
    

          
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBackNavigation}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
           
            <ArrowLeft className="w-6 h-6" />
            }`}
          <h1 className="text-2xl font-bold">Statistics</h1>
            <span>Game Stats</span>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6">
          <button
            <PlayerStatsPage
            className={`flex-1 px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
              activeTab === 'players'
                ? 'bg-primary text-primary-foreground'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          <
            <Users className="w-5 h-5" />
            <span>Player Stats</span>
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`flex-1 px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
              activeTab === 'games'
                ? 'bg-primary text-primary-foreground'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Game Stats</span>
          </button>
        </div>


      {/* Tab Content */}
      <div className="flex-1">

          <div className="px-4 space-y-6 pb-32">

              players={players}
              games={games}
              onNavigation={onNavigation}

              selectedPlayerId={selectedPlayerId}

          </div>
        ) : (
          <div className="px-4 space-y-6 pb-32">

              games={games}
              players={players}
              onNavigation={onNavigation}

              selectedCircleId={selectedGameId}

          </div>

      </div>
    </div>
  );
