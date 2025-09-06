import React, { useState } from 'react'
import { ArrowLeft, Play, Plus, Users, Timer, Trophy } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"electTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import BottomNavigation from './BottomNavigation'

interface Player {
  player_id: number
  player_name: string
  total_score: num
  player_id: number
  wins: number
  avatar?: string
  average_score: number
  duration?: s
  category?: string
  publisher?: string
  bgg_rating?: number
}

interface Game {
  game_id: number
  bgg_id?: number
  duration?: string
}: string
  category?: string
  year_published?: number
  winner_player_id?: n
  notes?: string
    player_id: number
    score: number
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
  const selectedGa
  const handlePlaye
      if (prev.incl
        // Remove s
        const newP
 

        // Clear winner
          setWinn
        
      } else {
      }
  }
  const handleSc
      ...prev,
    player_id: number
    character_id?: number
    score: number
    placement?: number
  games: Game[]
  players: Player[]
  onNavigation: (view: string) => void
  currentView: string
  onCreateSession?: (sessionData: GameSession) => Promise<void>
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

    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        const newPlayers = prev.filter(id => id !== playerId)
      } else {
        return [...prev, playerId]
      }
    })
  }

  const handleScoreChange = (playerId: number, score: string) => {
  const handlePlayerToggle = (playerId: number) => {
    setSelectedPlayers(prev => {
      [playerId]: parseInt(score) || 0
    }))
  }

  const handlePlacementChange = (playerId: number, placement: string) => {
        delete newScores[playerId]
      ...prev,
        setPlayerScores(newScores)
    }))
        
        // Clear winner if it was this player
        if (winnerId === playerId.toString()) {
          setWinnerId('')
        }
        
    // Check minimum players requirement
    if (selectedPlayers.length < selectedGame.min_players) return false
        return [...prev, playerId]
    // For competitive games, need scores or placements
    })
  }rs.some(id => playerScores[id] && playerScores[id] > 0)
sPlacements = selectedPlayers.some(id => playerPlacements[id] && playerPlacements[id] > 0)
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
    if (!selectedGameId || selectedPlayers.length === 0) return false
    if (!selectedGame) return falseyerId.toString(),
    
    // Check minimum players requirement
    if (selectedPlayers.length < selectedGame.min_players) return false
    sionData: GameSession = {
        game_id: selectedGame.game_id,
        session_date: new Date(),
      const hasScores = selectedPlayers.some(id => playerScores[id] && playerScores[id] > 0)
        winner_player_id: winnerId ? parseInt(winnerId) : undefined,
      if (!hasScores && !hasPlacements) return false
     
    onPlayers
      }
  }
ateSession(sessionData)
      
      // Reset form

    setIsSubmitting(true)
      setSelectedPlayers([])
      setPlayerScores({})
      setPlayerPlacements({})
      setWinnerId('')
      setDuration('')
      setNotes('')
        is_winner: winnerId === playerId.toString(),
        notes: ''
      }))

      const sessionData: GameSession = {
        game_id: selectedGame.game_id,
        session_date: new Date(),
        duration_minutes: duration ? parseInt(duration) : undefined,
        winner_player_id: winnerId ? parseInt(winnerId) : undefined,
        session_type: sessionType,
        notes,
                <div>
      }

      await onCreateSession(sessionData)
                    onChange={(e) => setDuration(e.target
      
                  /
      setSelectedGameId('')
            )}
      setPlayerScores({})

      setWinnerId('')
          <Card class
      setNotes('')
      
      // Navigate back to dashboard
                  ({selectedPla
      
    } catch (error) {
      console.error('Error creating game session:', error)
                {players.map(player => (
    } finally {
      setIsSubmitting(false)
    }
   

          
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
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