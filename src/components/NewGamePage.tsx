import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Play, Users, Trophy, Timer } from '@phosphor-icons/react'
import { toast } from 'sonner'
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
  const [selectedGameId, setSelectedGameId] = useState<string>('')
  const [sessionType, setSessionType] = useState<'competitive' | 'cooperative' | 'campaign' | 'hybrid'>('competitive')
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([])
  const [playerScores, setPlayerScores] = useState<{[key: number]: number}>({})
  const [winnerId, setWinnerId] = useState<string>('')
  const [duration, setDuration] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedGame = games.find(g => g.game_id.toString() === selectedGameId)

  const handlePlayerToggle = (playerId: number) => {
    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId)
      } else {
        return [...prev, playerId]
      }
    })
  }

  const handleScoreChange = (playerId: number, value: string) => {
    setPlayerScores(prev => ({
      ...prev,
      [playerId]: parseInt(value) || 0
    }))
  }

  const canSubmit = () => {
    return selectedGameId && 
           selectedPlayers.length >= (selectedGame?.min_players || 1) &&
           selectedPlayers.length <= (selectedGame?.max_players || 8)
  }

  const handleSubmit = async () => {
    if (!selectedGame || !onCreateSession) return

    setIsSubmitting(true)
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
      }

      await onCreateSession(sessionData)
      toast.success('Game session created successfully!')
      onNavigation('dashboard')
    } catch (error) {
      console.error('Error creating session:', error)
      toast.error('Failed to create game session')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-6 pb-24 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => onNavigation('dashboard')}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-white">New Game Session</h1>
        </div>

        {/* Game Setup */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
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
                    {games.map(game => (
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
                {players.map(player => (
                  <div key={player.player_id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Checkbox
                      checked={selectedPlayers.includes(player.player_id)}
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

        {/* Scoring */}
        {selectedPlayers.length > 0 && sessionType === 'competitive' && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="w-5 h-5" />
                Scoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPlayers.map(playerId => {
                const player = players.find(p => p.player_id === playerId)
                if (!player) return null

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
            variant="outline"
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