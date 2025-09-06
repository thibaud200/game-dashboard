import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Play, Users, Trophy, Timer } from '@phosphor-icons/react'
import { toast } from 'sonner'
  avatar?: string

  total_score: num
  player_id: number
  created_at: Date
  avatar?: string
  min_players: number
  duration?: s
  category?: string
  publisher?: string
  bgg_rating?: number
  age_min?: number
  supports_competit
  supports_hybri
 

  characters: an
}
interface NewGame
  players: Pla
  currentView: string
}
export default functi
  players,
  currentView,
}: NewGamePageProps) 
  const [sessionTyp
  const [playerScores, se
  const [duration, s
  const [isSubmitti
  const selectedGame 
  const handlePla
      if (prev.inc
      } else {
      }
  }
  const handleScoreChange 
      ...prev,
    }))

    return selected
           selected

    if (!selectedG
 

        session_date: new Da
        winner_
        notes: note
          player_id: playerId,
          is_winner: 
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
              <CardTi
      console.error('Error creating session:', error)
      toast.error('Failed to create game session')
    } finally {
      setIsSubmitting(false)
    }
   

          
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
                    </div>
            variant="ghost"
            className="text-white hover:bg-white/10"
        )}
            <ArrowLeft className="w-4 h-4" />
          <Card cla
          <h1 className="text-2xl font-bold text-white">New Game Session</h1>
              

              <div>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  plac
            <CardTitle className="flex items-center gap-2 text-white">
                />
              Game Setup
            </CardTitle>
          </CardHeader>
                  class
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
          </Button>
      </div>
      <BottomNavigation
                  </SelectContent>
    </div>
              </div>







                    </SelectTrigger>

                      {selectedGame.supports_competitive && (





                      {selectedGame.supports_campaign && (

                      )}





                </div>

            </div>











        </Card>

        {/* Player Selection */}



              <CardTitle className="flex items-center gap-2 text-white">

                Select Players

            </CardHeader>




















                  </div>

              </div>

          </Card>





            <CardHeader>

                <Trophy className="w-5 h-5" />



            <CardContent className="space-y-4">

                const player = players.find(p => p.player_id === playerId)



















                      />
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