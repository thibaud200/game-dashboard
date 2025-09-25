import React from 'react';
import { DashboardView } from '@/views/DashboardView';
import { useDashboard, DashboardData } from '@/hooks/useDashboard';
import { Player, Game, NavigationHandler } from '@/types';
import { useTheme } from '@/theme/ThemeProvider';

interface DashboardProps {
  stats: {
    playersCount: number;
    gamesCount: number;
    loading: boolean;
    error: null | string;
  };
  recentPlayers: Player[];
  recentGames: Game[];
  // darkMode supprimé, maintenant géré par le contexte
  currentView: string;
  onNavigation: NavigationHandler;
}

export default function Dashboard(props: DashboardProps) {
  const { darkMode } = useTheme();
  const dashboardData: DashboardData = {
    stats: props.stats,
    recentPlayers: props.recentPlayers,
    recentGames: props.recentGames,
    currentView: props.currentView,
    onNavigation: props.onNavigation
  };

  const logic = useDashboard(dashboardData);

  return <DashboardView {...logic} darkMode={darkMode} />;
}