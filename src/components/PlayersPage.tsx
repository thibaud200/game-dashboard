import React, { useState } from 'react'
import {
  Users,
  TrendingUp,
  Plus,
  ArrowLeft,
  Search,
  Trophy,
  Gamepad2,
  Medal,
  Trash2,
  Settings,
  Edit
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Player {
  player_id: number
  player_name: string
  avatar: string
  stats: string
  games_played: number
  wins: number
  total_score: number
  average_score: number
  created_at: Date
  updated_at?: Date
  favorite_game: string
}

interface PlayersPageProps {
  players: Player[]
  onNavigation: (view: string) => void
  onAddPlayer: (player: Omit<Player, 'player_id' | 'stats' | 'games_played' | 'wins' | 'total_score' | 'average_score' | 'created_at'>) => void
  onUpdatePlayer: (playerId: number, player: Partial<Player>) => void
  onDeletePlayer: (playerId: number) => void
  currentView?: string
}

export default function PlayersPage({ 
  players, 
  onNavigation, 
  onAddPlayer, 
  onUpdatePlayer,
  onDeletePlayer,
  currentView = 'players'
}: PlayersPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    player_name: '',
    avatar: '',
    favorite_game: '',
    total_score: 0,
    games_played: 0,
    wins: 0
  })

  const filteredPlayers = players.filter(player =>
    player.player_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      player_name: '',
      avatar: '',
      favorite_game: '',
      total_score: 0,
      games_played: 0,
      wins: 0
    })
  }

  const handleAddPlayer = () => {
    if (formData.player_name.trim()) {
      // Automatically set timestamps - these are not in the form
      const now = new Date()
      onAddPlayer({
        player_name: formData.player_name,
        avatar: formData.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
        favorite_game: formData.favorite_game || 'None',
        // Database fields not in form but required
        games_played: 0,
        wins: 0,
        total_score: 0,
        average_score: 0,
        created_at: now
      })
      resetForm()
      setIsAddDialogOpen(false)
    }
  }

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player)
    setFormData({
      player_name: player.player_name,
      avatar: player.avatar,
      favorite_game: player.favorite_game,
      total_score: player.total_score,
      games_played: player.games_played,
      wins: player.wins
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdatePlayer = () => {
    if (editingPlayer && formData.player_name.trim()) {
      const averageScore = formData.games_played > 0 ? formData.total_score / formData.games_played : 0
      // Automatically set updated_at timestamp
      const now = new Date()
      onUpdatePlayer(editingPlayer.player_id, {
        ...formData,
        average_score: averageScore,
        updated_at: now
      })
      resetForm()
      setEditingPlayer(null)
      setIsEditDialogOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigation('dashboard')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Players</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open)
            if (!open) {
              resetForm()
            }
          }}>
            <DialogTrigger asChild>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Plus className="w-6 h-6" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Player</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="player-name">Player Name *</Label>
                  <Input
                    id="player-name"
                    value={formData.player_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, player_name: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter player name"
                  />
                </div>
                <div>
                  <Label htmlFor="avatar-url">Avatar URL</Label>
                  <Input
                    id="avatar-url"
                    value={formData.avatar}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="favorite-game">Favorite Game</Label>
                  <Input
                    id="favorite-game"
                    value={formData.favorite_game}
                    onChange={(e) => setFormData(prev => ({ ...prev, favorite_game: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Favorite game"
                  />
                </div>
                <Button onClick={handleAddPlayer} className="w-full bg-teal-600 hover:bg-teal-700">
                  Add Player
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search players..."
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <div className="text-2xl font-bold text-teal-400">{players.length}</div>
            <div className="text-xs text-white/80">Total Players</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <div className="text-2xl font-bold text-emerald-400">
              {players.reduce((sum, p) => sum + p.games_played, 0)}
            </div>
            <div className="text-xs text-white/80">Games Played</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <div className="text-2xl font-bold text-blue-400">
              {players.reduce((sum, p) => sum + p.wins, 0)}
            </div>
            <div className="text-xs text-white/80">Total Wins</div>
          </div>
        </div>
      </div>

      {/* Players List */}
      <div className="px-4 space-y-4 pb-24">
        {filteredPlayers.map((player) => (
          <Card key={player.player_id} className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={player.avatar} alt={player.player_name} />
                  <AvatarFallback className="bg-teal-600 text-white">
                    {player.player_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{player.player_name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-white/60">
                    <span className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4" />
                      <span>{player.stats}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Gamepad2 className="w-4 h-4" />
                      <span>{player.games_played} games</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Medal className="w-4 h-4" />
                      <span>{player.wins} wins</span>
                    </span>
                  </div>
                  <div className="mt-1 flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-white/10 text-white text-xs">
                      {player.favorite_game}
                    </Badge>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs text-white/40">
                      Joined {new Date(player.created_at).toLocaleDateString()}
                      {player.average_score > 0 && ` • Avg: ${player.average_score.toFixed(1)} pts`}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditPlayer(player)}
                    className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Player</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/70">
                          Are you sure you want to delete "{player.player_name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDeletePlayer(player.player_id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No players found</p>
          </div>
        )}
      </div>

      {/* Edit Player Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open)
        if (!open) {
          resetForm()
          setEditingPlayer(null)
        }
      }}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-player-name">Player Name *</Label>
              <Input
                id="edit-player-name"
                value={formData.player_name}
                onChange={(e) => setFormData(prev => ({ ...prev, player_name: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter player name"
              />
            </div>
            <div>
              <Label htmlFor="edit-avatar-url">Avatar URL</Label>
              <Input
                id="edit-avatar-url"
                value={formData.avatar}
                onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="edit-favorite-game">Favorite Game</Label>
              <Input
                id="edit-favorite-game"
                value={formData.favorite_game}
                onChange={(e) => setFormData(prev => ({ ...prev, favorite_game: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Favorite game"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-total-score">Total Score</Label>
                <Input
                  id="edit-total-score"
                  type="number"
                  value={formData.total_score}
                  onChange={(e) => setFormData(prev => ({ ...prev, total_score: parseInt(e.target.value) || 0 }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-games-played">Games Played</Label>
                <Input
                  id="edit-games-played"
                  type="number"
                  value={formData.games_played}
                  onChange={(e) => setFormData(prev => ({ ...prev, games_played: parseInt(e.target.value) || 0 }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-wins">Wins</Label>
              <Input
                id="edit-wins"
                type="number"
                value={formData.wins}
                onChange={(e) => setFormData(prev => ({ ...prev, wins: parseInt(e.target.value) || 0 }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Button onClick={handleUpdatePlayer} className="w-full bg-blue-600 hover:bg-blue-700">
              Update Player
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-md border-t border-white/10">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => onNavigation('dashboard')}
            className={`flex flex-col items-center p-3 transition-colors ${
              currentView === 'dashboard'
                ? 'text-teal-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <TrendingUp className="w-6 h-6 mb-1" />
            <span className="text-xs">Dashboard</span>
          </button>
          <button
            onClick={() => onNavigation('players')}
            className={`flex flex-col items-center p-3 transition-colors ${
              currentView === 'players'
                ? 'text-teal-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Users className="w-6 h-6 mb-1" />
            <span className="text-xs">Players</span>
          </button>
          <button
            onClick={() => onNavigation('games')}
            className={`flex flex-col items-center p-3 transition-colors ${
              currentView === 'games'
                ? 'text-teal-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-6 h-6 mb-1" />
            <span className="text-xs">Games</span>
          </button>
          <button
            onClick={() => onNavigation('settings')}
            className={`flex flex-col items-center p-3 transition-colors ${
              currentView === 'settings'
                ? 'text-teal-400'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Settings className="w-6 h-6 mb-1" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}