import React, { useState, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import Dashboard from '@/components/Dashboard';
import PlayersPage from '@/components/PlayersPage';
import GamesPage from '@/components/GamesPage';
import SettingsPage from '@/components/SettingsPage';
import StatsPage from '@/components/StatsPage';
import NewGamePage from '@/components/NewGamePage';
import GameDetailPage from '@/components/GameDetailPage';
import GameExpansionsPage from '@/components/GameExpansionsPage';
import GameCharactersPage from '@/components/GameCharactersPage';
import { Player, Game, NavigationContext } from '@/types';

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
    },
    {
      player_id: 2,
      player_name: 'Nexus',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      stats: '1,850 pts',
      games_played: 12,
      wins: 6,
      total_score: 1850,
      average_score: 154,
      created_at: new Date(),
      favorite_game: 'Battle Arena'
    },
    {
      player_id: 3,
      player_name: 'Maya',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      stats: '1,620 pts',
      games_played: 10,
      wins: 4,
      total_score: 1620,
      average_score: 162,
      created_at: new Date(),
      favorite_game: 'Mind Games'
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
    },
    {
      game_id: 2,
      name: 'Battle Arena',
      description: 'Fast-paced combat game',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop',
      min_players: 3,
      max_players: 6,
      duration: '45-60 minutes',
      difficulty: 'Easy',
      category: 'Combat',
      year_published: 2019,
      publisher: 'Action Games',
      designer: 'Jane Smith',
      bgg_rating: 6.8,
      weight: 2.1,
      age_min: 10,
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: false,
      supports_hybrid: false,
      has_expansion: false,
      has_characters: false,
      created_at: new Date(),
      expansions: [],
      characters: [],
      players: '3-6'
    },
    {
      game_id: 3,
      name: 'Mind Games',
      description: 'Puzzle-solving adventure',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
      min_players: 2,
      max_players: 8,
      duration: '30-45 minutes',
      difficulty: 'Medium',
      category: 'Puzzle',
      year_published: 2020,
      publisher: 'Mind Co',
      designer: 'Alex Johnson',
      bgg_rating: 8.2,
      weight: 2.5,
      age_min: 14,
      supports_cooperative: true,
      supports_competitive: true,
      supports_campaign: false,
      supports_hybrid: true,
      has_expansion: false,
      has_characters: false,
      created_at: new Date(),
      expansions: [],
      characters: [],
      players: '2-8'
    },
    {
      game_id: 4,
      name: 'Pandemic Legacy',
      description: 'Cooperative campaign game',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
      min_players: 2,
      max_players: 4,
      duration: '60-90 minutes',
      difficulty: 'Medium',
      category: 'Cooperative',
      year_published: 2015,
      publisher: 'Z-Man Games',
      designer: 'Matt Leacock',
      bgg_rating: 8.6,
      weight: 2.8,
      age_min: 13,
      supports_cooperative: true,
      supports_competitive: false,
      supports_campaign: true,
      supports_hybrid: false,
      has_expansion: true,
      has_characters: true,
      created_at: new Date(),
      expansions: [],
      characters: [],
      players: '2-4'
    }
  ]
};

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState({
    playersCount: 0,
    gamesCount: 0,
    loading: true,
    error: null
  });
  const [games, setGames] = useState<Game[]>([]);
  const [navigationContext, setNavigationContext] = useState<NavigationContext>({
    source: 'dashboard',
    targetTab: 'players'
  });

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

  const handleNavigation = (view: string, id?: number, source?: string) => {
    setCurrentView(view);
    
    // Determine if id is playerId or gameId based on context
    if (view === 'player-stats' || view === 'players') {
      setSelectedPlayerId(id || null);
    } else if (view === 'game-stats' || view === 'games' || view === 'game-detail' || view === 'game-expansions' || view === 'game-characters') {
      setSelectedGameId(id || null);
    }

    if (view === 'stats') {
      let initialTab: 'players' | 'games' = 'players';
      if (currentView === 'games' || source === 'games') {
        initialTab = 'games';
      } else if (currentView === 'players' || source === 'players') {
        initialTab = 'players';
      }
      setNavigationContext({ source: source || currentView, targetTab: initialTab });
    } else {
      setNavigationContext({ source: source || currentView, targetTab: 'players' });
    }
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

  const handleCreateGameSession = (sessionData: any) => {
    // Implementation for creating a game session
    console.log('Creating game session:', sessionData);
  };

  const renderCurrentView = () => {
    const selectedPlayer = selectedPlayerId ? players?.find(p => p.player_id === selectedPlayerId) : null;
    const selectedGame = selectedGameId ? games?.find(g => g.game_id === selectedGameId) : null;

    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            stats={stats}
            recentPlayers={players?.slice(0, 3) || []}
            recentGames={games?.slice(0, 3) || []}
            onNavigation={handleNavigation}
            currentView={currentView}
          />
        );
      case 'players':
        return (
          <PlayersPage
            players={players || []}
            onAddPlayer={handleAddPlayer}
            onUpdatePlayer={handleUpdatePlayer}
            onDeletePlayer={handleDeletePlayer}
            onNavigation={handleNavigation}
            currentView={currentView}
          />
        );
      case 'games':
        return (
          <GamesPage
            games={games || []}
            onAddGame={handleAddGame}
            onUpdateGame={handleUpdateGame}
            onDeleteGame={handleDeleteGame}
            onNavigation={handleNavigation}
            currentView={currentView}
          />
        );
      case 'settings':
        return <SettingsPage onNavigation={handleNavigation} currentView={currentView} />;
      case 'stats':
        return (
          <StatsPage
            players={players || []}
            games={games || []}
            currentView={currentView}
            onNavigation={handleNavigation}
            selectedPlayerId={selectedPlayerId}
            selectedGameId={selectedGameId}
            navigationContext={navigationContext}
          />
        );
      case 'new-game':
        return (
          <NewGamePage
            players={players || []}
            games={games || []}
            onCreateSession={handleCreateGameSession}
            onNavigation={handleNavigation}
            currentView={currentView}
          />
        );
      case 'game-detail': {
        const game = selectedGameId ? games?.find(g => g.game_id === selectedGameId) : null;
        return game ? (
          <GameDetailPage
            game={game}
            onNavigation={handleNavigation}
            currentView={currentView}
          />
        ) : null;
      }
      case 'game-expansions': {
        const game = selectedGameId ? games?.find(g => g.game_id === selectedGameId) : null;
        return game ? (
          <GameExpansionsPage
            game={game}
            onNavigation={handleNavigation}
            currentView={currentView}
            navigationSource={navigationContext.source}
            onAddExpansion={async () => ({ expansion_id: 1, name: '', description: '' })}
            onUpdateExpansion={async () => {}}
            onDeleteExpansion={async () => {}}
          />
        ) : null;
      }
      case 'game-characters': {
        const game = selectedGameId ? games?.find(g => g.game_id === selectedGameId) : null;
        return game ? (
          <GameCharactersPage
            game={game}
            onNavigation={handleNavigation}
            currentView={currentView}
            navigationSource={navigationContext.source}
            onAddCharacter={async () => ({ character_id: 1, name: '', description: '', avatar: '' })}
            onUpdateCharacter={async () => {}}
            onDeleteCharacter={async () => {}}
          />
        ) : null;
      }
      default:
        return (
          <Dashboard
            stats={stats}
            recentPlayers={players?.slice(0, 3) || []}
            recentGames={games?.slice(0, 3) || []}
            onNavigation={handleNavigation}
            currentView={currentView}
          />
        );
    }
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
        {renderCurrentView()}
      </div>
    </TooltipProvider>
  );
}