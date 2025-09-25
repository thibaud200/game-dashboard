import React from 'react';
import { PlayersPageView } from '@/views/PlayersPageView';
import { usePlayersPage, PlayersPageData } from '@/hooks/usePlayersPage';
import { Player, NavigationHandler } from '@/types';

interface PlayersPageProps {
  players: Player[]
  onNavigation: NavigationHandler
  onAddPlayer: (player: Omit<Player, 'player_id' | 'stats' | 'games_played' | 'wins' | 'total_score' | 'average_score' | 'created_at'>) => void
  onUpdatePlayer: (playerId: number, player: Partial<Player>) => void
  onDeletePlayer: (playerId: number) => void
  currentView?: string
  darkMode?: boolean
}

export default function PlayersPage(props: PlayersPageProps) {
  const playersPageData: PlayersPageData = {
    players: props.players,
    onNavigation: props.onNavigation,
    onAddPlayer: props.onAddPlayer,
    onUpdatePlayer: props.onUpdatePlayer,
    onDeletePlayer: props.onDeletePlayer,
    currentView: props.currentView,
  };

  const logic = usePlayersPage(playersPageData);

  return <PlayersPageView {...logic} darkMode={!!props.darkMode} />;
}