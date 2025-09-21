import React, { useState, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import Dashboard from '@/components/Dashboard';
import PlayersPage from '@/components/PlayersPage';
import GamesPage from '@/components/GamesPage';
import { Player, Game } from '@/types/index';

// Mock data
const mockData = {
  playersCount: 426,
  gamesCount: 324,
  players: [
    {
      player_id: 1,
      player_name: 'Jane',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      stats: '2,100 pts',
      games_played: 15,
      wins: 8,
      total_score: 2100,
      average_score: 140,
      created_at: new Date(),
      favorite_game: 'Strategy Pro'
    }
  ],
  games: [
    {
      game_id: 1,
      name: 'Strategy Pro',
      description: 'A complex strategy game',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
      min_players: 2,
      max_players: 4,
      duration: '90-120 minutes',
      difficulty: 'Hard',
      category: 'Strategy',
      year_published: 2018,
      publisher: 'Game Co',
      designer: 'John Doe',
      bgg_rating: 7.5,
      weight: 3.2,
      age_min: 12,
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: false,
      supports_hybrid: false,
      has_expansion: false,
      has_characters: false,
      created_at: new Date(),
      expansions: [],
      characters: [],
      players: '2-4'
    }
  ]
};

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState({
    playersCount: 0,
    gamesCount: 0,
    loading: true,
    error: null
  });
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        playersCount: mockData.playersCount,
        gamesCount: mockData.gamesCount,
        loading: false,
        error: null
      });
      setPlayers(mockData.players);
      setGames(mockData.games);
    }, 1000);
  }, []);

  const handleNavigation = (view: string) => {
    setCurrentView(view);
  };

  // Handler functions for data operations  
  const handleAddPlayer = (playerData: Omit<Player, 'player_id' | 'created_at' | 'stats'>) => {
    const newPlayer: Player = {
      ...playerData,
      player_id: Math.max(...(players || []).map(p => p.player_id), 0) + 1,
      stats: `${playerData.total_score} pts`,
      created_at: new Date()
    };
    setPlayers([...(players || []), newPlayer]);
  };

  const handleUpdatePlayer = (playerId: number, playerData: Partial<Player>) => {
    setPlayers((players || []).map(p => p.player_id === playerId ? { ...p, ...playerData } : p));
  };

  const handleDeletePlayer = (playerId: number) => {
    setPlayers((players || []).filter(p => p.player_id !== playerId));
  };

  const handleAddGame = (gameData: Omit<Game, 'game_id' | 'created_at' | 'players' | 'expansions' | 'characters'>) => {
    const newGame: Game = {
      ...gameData,
      game_id: Math.max(...(games || []).map(g => g.game_id), 0) + 1,
      created_at: new Date(),
      expansions: [],
      characters: [],
      players: `${gameData.min_players}-${gameData.max_players}`
    };
    setGames([...(games || []), newGame]);
  };

  const handleUpdateGame = (gameId: number, gameData: Partial<Game>) => {
    setGames((games || []).map(g => g.game_id === gameId ? { ...g, ...gameData } : g));
  };

  const handleDeleteGame = (gameId: number) => {
    setGames((games || []).filter(g => g.game_id !== gameId));
  };

  if (stats.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        {currentView === 'dashboard' && (
          <Dashboard
            stats={stats}
            recentPlayers={players?.slice(0, 3) || []}
            recentGames={games?.slice(0, 3) || []}
            onNavigation={handleNavigation}
            currentView={currentView}
          />
        )}
        {currentView === 'players' && (
          <PlayersPage
            players={players || []}
            onAddPlayer={handleAddPlayer}
            onUpdatePlayer={handleUpdatePlayer}
            onDeletePlayer={handleDeletePlayer}
            onNavigation={handleNavigation}
            currentView={currentView}
          />
        )}
        {currentView === 'games' && (
          <GamesPage
            games={games || []}
            onAddGame={handleAddGame}
            onUpdateGame={handleUpdateGame}
            onDeleteGame={handleDeleteGame}
            onNavigation={handleNavigation}
            currentView={currentView}
          />
        )}
        {!['dashboard', 'players', 'games'].includes(currentView) && (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
            <div className="text-white text-lg">Page: {currentView}</div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}