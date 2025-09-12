import React from 'react';
import { toast } from 'sonner';
import { useNewGamePage } from '@/hooks/useNewGamePage';
import NewGameView from '@/views/NewGameView';

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
  bgg_id?: number
  name: string
  description?: string
  image?: string
  min_players: number
  max_players: number
  duration?: string
  difficulty?: string
  category?: string
  year_published?: number
  publisher?: string
  designer?: string
  bgg_rating?: number
  weight?: number
  age_min?: number
  supports_cooperative: boolean
  supports_competitive: boolean
  supports_campaign: boolean
  supports_hybrid: boolean
  has_expansion: boolean
  has_characters: boolean
  created_at: Date
  updated_at?: Date
  expansions: any[]
  characters: any[]
  players?: string
}

interface NewGamePageProps {
  games: Game[]
  players: Player[]
  onNavigation: (view: string) => void
  currentView: string
  onCreateSession: (sessionData: any) => Promise<void>
}

export default function NewGamePage({ 
  games, 
  players,
  onNavigation, 
  currentView,
  onCreateSession 
}: NewGamePageProps) {
  const hookData = useNewGamePage(games, players, onCreateSession);

  const handleSubmitWithToast = async (): Promise<{ success: boolean }> => {
    try {
      const result = await hookData.handleSubmit();
      if (result && result.success) {
        toast.success('Game session created successfully!');
        hookData.resetForm();
        return result;
      }
      throw new Error('Failed to create session');
    } catch (error) {
      toast.error('Failed to create game session');
      throw error;
    }
  };

  return (
    <NewGameView
      {...hookData}
      handleSubmit={handleSubmitWithToast}
      games={games}
      players={players}
      onNavigation={onNavigation}
      currentView={currentView}
    />
  );
}