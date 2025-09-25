import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Play, Users, Trophy, Timer, Target, Plus, Trash } from '@phosphor-icons/react';

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

interface NewGameViewProps {
  // State
  selectedGameId: string
  setSelectedGameId: (id: string) => void
  sessionType: 'competitive' | 'cooperative' | 'campaign' | 'hybrid'
  setSessionType: (type: 'competitive' | 'cooperative' | 'campaign' | 'hybrid') => void
  selectedPlayers: number[]
  playerScores: {[key: number]: number}
  winnerId: string
  setWinnerId: (id: string) => void
  duration: string
  setDuration: (duration: string) => void
  notes: string
  setNotes: (notes: string) => void
  isSubmitting: boolean
  
  // Cooperative scoring state
  objectives: Array<{id: string, text: string, completed: boolean, points: number}>
  setObjectives: (objectives: Array<{id: string, text: string, completed: boolean, points: number}>) => void
  teamScore: number
  setTeamScore: (score: number) => void
  difficultyLevel: string
  setDifficultyLevel: (level: string) => void
  teamSuccess: boolean
  setTeamSuccess: (success: boolean) => void
  
  // Computed
  selectedGame: Game | null
  
  // Methods
  handlePlayerToggle: (playerId: number) => void
  handleScoreChange: (playerId: number, value: string) => void
  canSubmit: () => boolean
  handleSubmit: () => Promise<{ success: boolean }>
  
  // Cooperative scoring methods
  addObjective: () => void
  addPresetObjectives: () => void
  updateObjective: (id: string, field: string, value: any) => void
  removeObjective: (id: string) => void
  calculateTeamScore: () => number
  
  // Data
  games: Game[]
  players: Player[]
  
  // Navigation
  onNavigation: (view: string) => void
  currentView: string
  darkMode: boolean
}

export default function NewGameView({ 
  selectedGameId,
  setSelectedGameId,
  sessionType,
  setSessionType,
  selectedPlayers,
  playerScores,
  winnerId,
  setWinnerId,
  duration,
  setDuration,
  notes,
  setNotes,
  isSubmitting,
  objectives,
  setObjectives: _setObjectives,
  teamScore,
  setTeamScore,
  difficultyLevel,
  setDifficultyLevel,
  teamSuccess,
  setTeamSuccess,
  selectedGame,
  handlePlayerToggle,
  handleScoreChange,
  canSubmit,
  handleSubmit,
  addObjective,
  addPresetObjectives,
  updateObjective,
  removeObjective,
  calculateTeamScore,
  games,
  players,
  onNavigation,
  currentView: _currentView,
  darkMode
}: NewGameViewProps) {
  // Safety checks for arrays
  const safeGames = games || [];
  const safePlayers = players || [];
  const safeSelectedPlayers = selectedPlayers || [];
  
  const onSubmit = async () => {
    try {
      await handleSubmit();
      onNavigation('dashboard');
    } catch {
      // Error handling is done in the hook
    }
  };

  return (
    <div className={darkMode ? "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 text-slate-900"}>
      <div className={darkMode ? "container mx-auto px-4 py-6 pb-32 space-y-6" : "container mx-auto px-4 py-6 pb-32 space-y-6 bg-slate-50"}>
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => onNavigation('dashboard')}
            variant="ghost"
            className={darkMode ? "text-white hover:bg-white/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className={darkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-slate-900"}>New Game Session</h1>
        </div>

        {/* Game Setup */}
        <Card className={darkMode ? "bg-white/10 backdrop-blur-md border-white/20" : "bg-slate-50 backdrop-blur-md border-slate-200"}>
          <CardHeader>
            <CardTitle className={darkMode ? "flex items-center gap-2 text-white" : "flex items-center gap-2 text-slate-900"}>
              <Play className="w-5 h-5" />
              Game Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white/80">Game</Label>
                <Select value={selectedGameId} onValueChange={setSelectedGameId}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Choose a game..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    {safeGames.map(game => (
                      <SelectItem key={game.game_id} value={game.game_id.toString()}>
                        {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedGame && (
                <div>
                  <Label className="text-white/80">Session Type</Label>
                  <Select value={sessionType} onValueChange={(value: 'competitive' | 'cooperative' | 'campaign' | 'hybrid') => setSessionType(value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      {selectedGame.supports_competitive && (
                        <SelectItem value="competitive">Competitive - Players compete against each other</SelectItem>
                      )}
                      {selectedGame.supports_cooperative && (
                        <SelectItem value="cooperative">Cooperative - Players work together</SelectItem>
                      )}
                      {selectedGame.supports_campaign && (
                        <SelectItem value="campaign">Campaign - Ongoing story mode</SelectItem>
                      )}
                      {selectedGame.supports_hybrid && (
                        <SelectItem value="hybrid">Hybrid - Mix of team and individual goals</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {selectedGame && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <p className="text-white/80 text-sm">
                  <strong>{selectedGame.name}</strong> • {selectedGame.min_players}-{selectedGame.max_players} players
                  {selectedGame.duration && ` • ${selectedGame.duration}`}
                </p>
                {selectedGame.description && (
                  <p className="text-white/60 text-sm mt-2">{selectedGame.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedGame.supports_competitive && (
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded">Competitive</span>
                  )}
                  {selectedGame.supports_cooperative && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">Cooperative</span>
                  )}
                  {selectedGame.supports_campaign && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">Campaign</span>
                  )}
                  {selectedGame.supports_hybrid && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">Hybrid</span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Player Selection */}
        {selectedGame && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5" />
                Select Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {safePlayers.map(player => (
                  <div key={player.player_id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Checkbox
                      checked={safeSelectedPlayers.includes(player.player_id)}
                      onCheckedChange={() => handlePlayerToggle(player.player_id)}
                      className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      {player.avatar && (
                        <img src={player.avatar} alt={player.player_name} className="w-8 h-8 rounded-full" />
                      )}
                      <div>
                        <p className="text-white font-medium">{player.player_name}</p>
                        <p className="text-white/60 text-sm">{player.stats}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cooperative Scoring */}
        {selectedPlayers.length > 0 && sessionType === 'cooperative' && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5" />
                Cooperative Objectives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Difficulty Level */}
              <div>
                <Label className="text-white/80">Difficulty Level</Label>
                <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Team Success */}
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <Checkbox
                  checked={teamSuccess}
                  onCheckedChange={(checked) => setTeamSuccess(!!checked)}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
                <Label className="text-white font-medium">Team Victory</Label>
              </div>

              {/* Team Score */}
              <div>
                <Label className="text-white/80">Team Score</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={teamScore}
                  onChange={(e) => setTeamScore(parseInt(e.target.value) || 0)}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>

              {/* Objectives */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white/80">Shared Objectives</Label>
                  <div className="flex gap-2">
                    {objectives.length === 0 && (
                      <Button
                        onClick={addPresetObjectives}
                        size="sm"
                        variant="outline"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                      >
                        <Target className="w-4 h-4 mr-1" />
                        Add Common
                      </Button>
                    )}
                    <Button
                      onClick={addObjective}
                      size="sm"
                      variant="outline"
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Custom
                    </Button>
                  </div>
                </div>
                
                {objectives.length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No objectives set yet</p>
                    <p className="text-xs mt-1">Add objectives to track your team's progress</p>
                  </div>
                )}
                
                {objectives.map((objective, index) => (
                  <div key={objective.id} className="space-y-2 p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-white/60 text-sm">#{index + 1}</span>
                      <Button
                        onClick={() => removeObjective(objective.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1 h-auto"
                      >
                        <Trash className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <Input
                      placeholder="Objective description..."
                      value={objective.text}
                      onChange={(e) => updateObjective(objective.id, 'text', e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="Points"
                          value={objective.points}
                          onChange={(e) => updateObjective(objective.id, 'points', parseInt(e.target.value) || 0)}
                          className="w-20 bg-white/5 border-white/20 text-white"
                        />
                        <span className="text-white/60 text-sm">pts</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={objective.completed}
                          onCheckedChange={(checked) => updateObjective(objective.id, 'completed', !!checked)}
                          className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                        />
                        <span className="text-white/60 text-sm">Completed</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {objectives.length > 0 && (
                  <div className="mt-3 p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Total Objectives Score:</span>
                      <span className="text-white font-semibold">{calculateTeamScore()} pts</span>
                    </div>
                    <div className="text-white/60 text-sm mt-1">
                      {objectives.filter(obj => obj.completed).length} of {objectives.length} completed
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Competitive Scoring */}
        {/* Competitive Scoring */}
        {selectedPlayers.length > 0 && sessionType === 'competitive' && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="w-5 h-5" />
                Competitive Scoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {safeSelectedPlayers.map(playerId => {
                const player = safePlayers.find(p => p.player_id === playerId);
                if (!player) return null;

                return (
                  <div key={playerId} className="flex items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      {player.avatar && (
                        <img src={player.avatar} alt={player.player_name} className="w-8 h-8 rounded-full" />
                      )}
                      <span className="text-white font-medium">{player.player_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Score"
                        value={playerScores[playerId] || ''}
                        onChange={(e) => handleScoreChange(playerId, e.target.value)}
                        className="w-20 bg-white/5 border-white/20 text-white"
                      />
                      <Checkbox
                        checked={winnerId === playerId.toString()}
                        onCheckedChange={(checked) => setWinnerId(checked ? playerId.toString() : '')}
                        className="data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                      />
                      <span className="text-white/60 text-sm">Winner</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Hybrid Scoring */}
        {selectedPlayers.length > 0 && sessionType === 'hybrid' && (
          <>
            {/* Team Component */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5" />
                  Team Objectives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <Checkbox
                    checked={teamSuccess}
                    onCheckedChange={(checked) => setTeamSuccess(!!checked)}
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <Label className="text-white font-medium">Team Objectives Completed</Label>
                </div>

                <div>
                  <Label className="text-white/80">Team Score</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={teamScore}
                    onChange={(e) => setTeamScore(parseInt(e.target.value) || 0)}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Individual Component */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="w-5 h-5" />
                  Individual Scores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {safeSelectedPlayers.map(playerId => {
                  const player = safePlayers.find(p => p.player_id === playerId);
                  if (!player) return null;

                  return (
                    <div key={playerId} className="flex items-center gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        {player.avatar && (
                          <img src={player.avatar} alt={player.player_name} className="w-8 h-8 rounded-full" />
                        )}
                        <span className="text-white font-medium">{player.player_name}</span>
                      </div>
                      <Input
                        type="number"
                        placeholder="Score"
                        value={playerScores[playerId] || ''}
                        onChange={(e) => handleScoreChange(playerId, e.target.value)}
                        className="w-20 bg-white/5 border-white/20 text-white"
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </>
        )}

        {/* Session Details */}
        {selectedPlayers.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Timer className="w-5 h-5" />
                Session Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white/80">Duration (minutes)</Label>
                <Input
                  type="number"
                  placeholder="60"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white/80">Notes</Label>
                <Textarea
                  placeholder="Game notes, highlights, or observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-white/5 border-white/20 text-white min-h-20"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            onClick={() => onNavigation('dashboard')}
            variant="outline"
            className="flex-1 bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!canSubmit() || isSubmitting}
            className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
          >
            {isSubmitting ? 'Creating...' : 'Create Session'}
          </Button>
        </div>
      </div>
    </div>
  );
}