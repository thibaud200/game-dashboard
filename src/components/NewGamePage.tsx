import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BottomNavigation from './BottomNavigation'

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

interface GameSession {
  session_id?: number
  game_id: number
  session_date: Date
  duration_minutes?: number
  winner_player_id?: number
  session_type: 'competitive' | 'cooperative' | 'campaign' | 'hybrid'
  notes?: string
  created_at?: Date
}

interface NewGamePageProps {
  games: Game[]
  players: Player[]
  onNavigation: (view: string) => void
  currentView: string
  onCreateSession?: (sessionData: any) => Promise<void>
}

export default function NewGamePage({ 
  games, 
  players, 
  onNavigation, 
  currentView,
  onCreateSession 
}: NewGamePageProps) {
  const [selectedGameId, setSelectedGameId] = useState<string>('')
  const [sessionType, setSessionType] = useState<'competitive' | 'cooperative' | 'campaign' | 'hybrid'>('competitive')
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([])
  const [playerScores, setPlayerScores] = useState<{[key: number]: number}>({})
  const [playerPlacements, setPlayerPlacements] = useState<{[key: number]: number}>({})
  const [winnerId, setWinnerId] = useState<string>('')
  const [duration, setDuration] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedGame = games.find(g => g.game_id.toString() === selectedGameId)

  const handlePlayerToggle = (playerId: number) => {
    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        const newPlayers = prev.filter(id => id !== playerId)
        
        // Clean up scores and placements for removed player
        const newScores = { ...playerScores }
        const newPlacements = { ...playerPlacements }
        delete newScores[playerId]
        delete newPlacements[playerId]
        setPlayerScores(newScores)
        setPlayerPlacements(newPlacements)
        
        // Clear winner if this player was the winner
        if (winnerId === playerId.toString()) {
          setWinnerId('')
        }
        
        return newPlayers
      } else {
        return [...prev, playerId]
      }
    })
  }

  const handleScoreChange = (playerId: number, score: string) => {
    setPlayerScores(prev => ({
      ...prev,
      [playerId]: parseInt(score) || 0
    }))
  }

  const handlePlacementChange = (playerId: number, placement: string) => {
    setPlayerPlacements(prev => ({
      ...prev,
      [playerId]: parseInt(placement) || 0
    }))
  }

  const canSubmit = () => {
    if (!selectedGame || selectedPlayers.length === 0) return false
    
    // Check minimum players requirement
    if (selectedPlayers.length < selectedGame.min_players) return false
    
    // For competitive games, need scores or placements
    if (sessionType === 'competitive') {
      const hasScores = selectedPlayers.some(playerId => (playerScores[playerId] || 0) > 0)
      const hasPlacements = selectedPlayers.some(playerId => (playerPlacements[playerId] || 0) > 0)
      if (!hasScores && !hasPlacements) return false
    }
    
    return true
  }

  const handleSubmit = async () => {
    if (!canSubmit() || !selectedGame || !onCreateSession) return

    setIsSubmitting(true)

    try {
      const sessionPlayers = selectedPlayers.map(playerId => ({
        player_id: playerId,
        score: playerScores[playerId] || 0,
        placement: playerPlacements[playerId] || 0,
        is_winner: winnerId === playerId.toString(),
        notes: ''
      }))

      const sessionData = {
        game_id: selectedGame.game_id,
        session_date: new Date(),
        duration_minutes: duration ? parseInt(duration) : undefined,
        winner_player_id: winnerId ? parseInt(winnerId) : undefined,
        session_type: sessionType,
        notes: notes,
        players: sessionPlayers
      }

      await onCreateSession(sessionData)
      
      // Reset form
      setSelectedGameId('')
      setSelectedPlayers([])
      setPlayerScores({})
      setPlayerPlacements({})
      setWinnerId('')
      setDuration('')
      setNotes('')
      
      // Navigate back to dashboard
      onNavigation('dashboard')
      
    } catch (error) {
      console.error('Error creating game session:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => onNavigation('dashboard')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-white">New Game Session</h1>
        </div>

        {/* Game Selection */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Play className="w-5 h-5" />
              Select Game
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white/80">Game</Label>
              <Select value={selectedGameId} onValueChange={setSelectedGameId}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Choose a game..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  {games.map(game => (
                    <SelectItem key={game.game_id} value={game.game_id.toString()}>
                      <div className="flex items-center gap-2">
                        <span>{game.name}</span>
                        <span className="text-white/60 text-sm">({game.min_players}-{game.max_players} players)</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedGame && (
              <div>
                <Label className="text-white/80">Session Type</Label>
                <Select value={sessionType} onValueChange={(value: any) => setSessionType(value)}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    {selectedGame.supports_competitive && (
                      <SelectItem value="competitive">Competitive</SelectItem>
                    )}
                    {selectedGame.supports_cooperative && (
                      <SelectItem value="cooperative">Cooperative</SelectItem>
                    )}
                    {selectedGame.supports_campaign && (
                      <SelectItem value="campaign">Campaign</SelectItem>
                    )}
                    {selectedGame.supports_hybrid && (
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    )}
                  </SelectContent>
                </Select>
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
                Select Players ({selectedPlayers.length}/{selectedGame.max_players})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-white/60 text-sm">
                Minimum: {selectedGame.min_players} players
              </div>
              <div className="grid grid-cols-1 gap-3">
                {players.map(player => (
                  <div key={player.player_id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedPlayers.includes(player.player_id)}
                        onCheckedChange={() => handlePlayerToggle(player.player_id)}
                        disabled={
                          !selectedPlayers.includes(player.player_id) && 
                          selectedPlayers.length >= selectedGame.max_players
                        }
                      />
                      <img
                        src={player.avatar}
                        alt={player.player_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-white font-medium">{player.player_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scores & Results */}
        {selectedPlayers.length > 0 && sessionType === 'competitive' && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="w-5 h-5" />
                Scores & Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPlayers.map(playerId => {
                const player = players.find(p => p.player_id === playerId)
                if (!player) return null
                
                return (
                  <div key={playerId} className="p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={player.avatar}
                        alt={player.player_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-white font-medium">{player.player_name}</span>
                      <div className="ml-auto">
                        <Checkbox
                          checked={winnerId === playerId.toString()}
                          onCheckedChange={(checked) => 
                            setWinnerId(checked ? playerId.toString() : '')
                          }
                        />
                        <span className="ml-2 text-white/60 text-sm">Winner</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white/60 text-sm">Score</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={playerScores[playerId] || ''}
                          onChange={(e) => handleScoreChange(playerId, e.target.value)}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white/60 text-sm">Placement</Label>
                        <Input
                          type="number"
                          placeholder="1"
                          min="1"
                          max={selectedPlayers.length}
                          value={playerPlacements[playerId] || ''}
                          onChange={(e) => handlePlacementChange(playerId, e.target.value)}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
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
            variant="secondary"
            className="flex-1 bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit() || isSubmitting}
            className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
          >
            {isSubmitting ? 'Creating...' : 'Create Session'}
          </Button>
        </div>
      </div>

      <BottomNavigation 
        currentView={currentView}
        onNavigation={onNavigation}
      />
    </div>
  )
}