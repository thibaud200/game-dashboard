import React, { useState } from 'react'
import { ArrowLeft, Play, Plus, Users, Timer, Trophy } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import BottomNavigation from './BottomNavigation'
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
interface GameSes
  session_date
  winner_player_id?: n
  notes?: string
    player_id: number
    score: number
    is_winner: bool
  }>

  games: Game[]
  onNavigation: (vie
  onCreateSession?:

  games, 
  onNavigation, 
  onCreateSession 
  const [selectedGameId, setSel
  const [selectedPlayers, se
  const [playerPlacements,
  const [duration, setDu
  const [isSubmitting, se
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
    is_winner: boolean
    notes?: string
  }>
}

interface NewGamePageProps {
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
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedGame = games.find(g => g.game_id === parseInt(selectedGameId))

  const handlePlayerToggle = (playerId: number) => {
    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        const newPlayers = prev.filter(id => id !== playerId)
        // Remove scores and placements for unselected player
        const newScores = { ...playerScores }
        const newPlacements = { ...playerPlacements }
        delete newScores[playerId]
        delete newPlacements[playerId]
        setPlayerScores(newScores)
        setPlayerPlacements(newPlacements)
        
        // Clear winner if it was this player
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
      o
   

  const handlePlacementChange = (playerId: number, placement: string) => {
    setPlayerPlacements(prev => ({
      ...prev,
      [playerId]: parseInt(placement) || 0
    }))
  }

  const canSubmit = () => {
    if (!selectedGameId || selectedPlayers.length === 0) return false
    if (!selectedGame) return false
    
    // Check minimum players requirement
    if (selectedPlayers.length < selectedGame.min_players) return false
    
    // For competitive games, need scores or placements
    if (sessionType === 'competitive') {
      const hasScores = selectedPlayers.some(id => playerScores[id] && playerScores[id] > 0)
      const hasPlacements = selectedPlayers.some(id => playerPlacements[id] && playerPlacements[id] > 0)
      if (!hasScores && !hasPlacements) return false
     
    
            <di
  }

  const handleSubmit = async () => {
    if (!canSubmit() || !selectedGame || !onCreateSession) return

    setIsSubmitting(true)

    try {
      const sessionPlayers = selectedPlayers.map(playerId => ({
                </SelectCont
        score: playerScores[playerId] || 0,
        placement: playerPlacements[playerId] || 0,
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
                    
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
              </div>
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        )}
            <ArrowLeft className="w-6 h-6" />
        {selectedPl
          <h1 className="text-2xl font-bold">New Game Session</h1>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>
            

      <div className="px-4 space-y-6 pb-24">
        {/* Game Selection */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Play className="w-5 h-5" />
                        c
            </CardTitle>
                       
          <CardContent className="space-y-4">
                 
              <Label htmlFor="game-select" className="text-white/80">Game</Label>
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
                            />
                <div>
                  <Label className="text-white/80">Session Type</Label>
                  <Select value={sessionType} onValueChange={(value: any) => setSessionType(value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                              min="1
                    <SelectContent className="bg-slate-800 border-white/20">
























































































































































































