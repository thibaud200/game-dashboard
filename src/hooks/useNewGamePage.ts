import { useState } from 'react';

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

export const useNewGamePage = (
  games: Game[],
  players: Player[],
  onCreateSession: (sessionData: any) => Promise<void>
) => {
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [sessionType, setSessionType] = useState<'competitive' | 'cooperative' | 'campaign' | 'hybrid'>('competitive');
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [playerScores, setPlayerScores] = useState<{[key: number]: number}>({});
  const [winnerId, setWinnerId] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedGame = games.find(g => g.game_id.toString() === selectedGameId) || null;

  const handlePlayerToggle = (playerId: number) => {
    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
  };

  const handleScoreChange = (playerId: number, value: string) => {
    setPlayerScores(prev => ({
      ...prev,
      [playerId]: parseInt(value) || 0
    }));
  };

  const canSubmit = (): boolean => {
    return Boolean(selectedGameId && 
           selectedPlayers.length >= (selectedGame?.min_players || 1) &&
           selectedPlayers.length <= (selectedGame?.max_players || 8));
  };

  const handleSubmit = async () => {
    if (!selectedGame || !onCreateSession) return;

    setIsSubmitting(true);
    try {
      const sessionData = {
        game_id: parseInt(selectedGameId),
        session_date: new Date(),
        duration_minutes: duration ? parseInt(duration) : null,
        winner_player_id: winnerId ? parseInt(winnerId) : null,
        session_type: sessionType,
        notes: notes || null,
        players: selectedPlayers.map(playerId => ({
          player_id: playerId,
          score: playerScores[playerId] || 0,
          is_winner: winnerId === playerId.toString()
        }))
      };

      await onCreateSession(sessionData);
      return { success: true };
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedGameId('');
    setSessionType('competitive');
    setSelectedPlayers([]);
    setPlayerScores({});
    setWinnerId('');
    setDuration('');
    setNotes('');
  };

  return {
    // State
    selectedGameId,
    setSelectedGameId,
    sessionType,
    setSessionType,
    selectedPlayers,
    setSelectedPlayers,
    playerScores,
    setPlayerScores,
    winnerId,
    setWinnerId,
    duration,
    setDuration,
    notes,
    setNotes,
    isSubmitting,
    
    // Computed
    selectedGame,
    
    // Methods
    handlePlayerToggle,
    handleScoreChange,
    canSubmit,
    handleSubmit,
    resetForm
  };
};