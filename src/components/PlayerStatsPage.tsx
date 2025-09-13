import React from 'react';
import { usePlayerStatsPage } from '@/hooks/usePlayerStatsPage';
import { TooltipProvider } from '@/components/ui/tooltip';
import PlayerStatsView from '@/views/PlayerStatsView';

interface Player {
  player_id: number
  player_name: string
  avatar?: string
  games_played: number
  wins: number
  total_score: number
  average_score: number
  favorite_game?: string
  created_at: Date
  updated_at?: Date
  stats?: string
}

interface Game {
  game_id: number
  name: string
  min_players: number
  max_players: number
  difficulty?: string
  year_published?: number
  players?: string
}

interface PlayerStatsPageProps {
  players: Player[]
  games: Game[]
  onNavigation: (view: string) => void
  currentView: string
  selectedPlayerId?: number
}

export default function PlayerStatsPage({ 
  players, 
  games, 
  onNavigation, 
  currentView, 
  selectedPlayerId 
}: PlayerStatsPageProps) {
  const {
    stats,
    topPlayers,
    recentActivity,
    selectedPlayer
  } = usePlayerStatsPage(players, games, selectedPlayerId);

  return (
    <TooltipProvider>
      <PlayerStatsView
        stats={stats}
        topPlayers={topPlayers}
        recentActivity={recentActivity}
        selectedPlayer={selectedPlayer || null}
        onNavigation={onNavigation}
        currentView={currentView}
      />
    </TooltipProvider>
  );
}