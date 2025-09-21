import { useMemo } from 'react';
import { Player, Game, NavigationHandler } from '@/types/index';

export interface DashboardStats {
  playersCount: number;
  gamesCount: number;
  loading: boolean;
  error: null | string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentPlayers: Player[];
  recentGames: Game[];
  currentView: string;
  onNavigation: NavigationHandler;
}

export const useDashboard = (data: DashboardData) => {
  const { stats, recentPlayers, recentGames, currentView, onNavigation } = data;

  // Navigation handlers
  const handleBackClick = () => {
    onNavigation('back');
  };

  const handleSettingsClick = () => {
    onNavigation('settings');
  };

  const handlePlayersClick = () => {
    onNavigation('players');
  };

  const handleGamesClick = () => {
    onNavigation('games');
  };

  const handlePlayerStatsClick = (playerId: number) => {
    onNavigation('stats', playerId, 'players');
  };

  const handleGameStatsClick = (gameId: number) => {
    onNavigation('stats', gameId, 'games');
  };

  const handleNewGameClick = () => {
    onNavigation('new-game');
  };

  const handleActivityClick = () => {
    onNavigation('activity');
  };

  // Computed values
  const hasPlayers = useMemo(() => recentPlayers?.length > 0, [recentPlayers]);
  const hasGames = useMemo(() => recentGames?.length > 0, [recentGames]);

  return {
    // Data
    stats,
    recentPlayers,
    recentGames,
    currentView,
    
    // Computed
    hasPlayers,
    hasGames,
    
    // Handlers
    handleBackClick,
    handleSettingsClick,
    handlePlayersClick,
    handleGamesClick,
    handlePlayerStatsClick,
    handleGameStatsClick,
    handleNewGameClick,
    handleActivityClick,
    onNavigation
  };
};