import React, { useState } from 'react'
import {
  Gamepad2,
  Plus,
  ArrowLeft,
  Search,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Game {
  game_id: number
  name: string
  image: string
  players: string
  description: string
  duration: string
  difficulty: string
  category: string
}

interface GamesPageProps {
  games: Game[]
  onNavigation: (view: string) => void
  onAddGame: (game: Omit<Game, 'game_id'>) => void
  onDeleteGame: (gameId: number) => void
}

export default function GamesPage({ 
  games, 
  onNavigation, 
  onAddGame, 
  onDeleteGame 
}: GamesPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [newGame, setNewGame] = useState({
    name: '',
    image: '',
    players: '',
    description: '',
    duration: '',
    difficulty: 'Beginner',
    category: ''
  })

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddGame = () => {
    if (newGame.name.trim()) {
      onAddGame({
        name: newGame.name,
        image: newGame.image || 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
        players: newGame.players || '2-4',
        description: newGame.description || 'A fun board game experience.',
        duration: newGame.duration || '30-60 min',
        difficulty: newGame.difficulty,
        category: newGame.category || 'General'
      })
      setNewGame({
        name: '',
        image: '',
        players: '',
        description: '',
        duration: '',
        difficulty: 'Beginner',
        category: ''
      })
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
          <h1 className="text-2xl font-bold">Games</h1>
          <Dialog>
            <DialogTrigger asChild>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Plus className="w-6 h-6" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Game</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="game-name">Game Name</Label>
                  <Input
                    id="game-name"
                    value={newGame.name}
                    onChange={(e) => setNewGame(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter game name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="players-count">Players</Label>
                    <Input
                      id="players-count"
                      value={newGame.players}
                      onChange={(e) => setNewGame(prev => ({ ...prev, players: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="2-4"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={newGame.duration}
                      onChange={(e) => setNewGame(prev => ({ ...prev, duration: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="30-60 min"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newGame.category}
                    onChange={(e) => setNewGame(prev => ({ ...prev, category: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Strategy, Party, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newGame.description}
                    onChange={(e) => setNewGame(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Brief game description"
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddGame} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Add Game
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
            placeholder="Search games..."
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        {/* Games Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <div className="text-2xl font-bold text-emerald-400">{games.length}</div>
            <div className="text-xs text-white/80">Total Games</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <div className="text-2xl font-bold text-blue-400">
              {[...new Set(games.map(g => g.category))].length}
            </div>
            <div className="text-xs text-white/80">Categories</div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="px-4 pb-24">
        <div className="grid grid-cols-1 gap-4">
          {filteredGames.map((game) => (
            <Card key={game.game_id} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-0">
                <div className="flex">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-24 h-24 object-cover rounded-l-lg"
                  />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{game.name}</h3>
                        <p className="text-sm text-white/70 mb-2 line-clamp-2">{game.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary" className="bg-teal-600/20 text-teal-300 text-xs">
                            {game.category}
                          </Badge>
                          <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                            {game.players} players
                          </Badge>
                          <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                            {game.duration}
                          </Badge>
                          <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                            {game.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteGame(game.game_id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <Gamepad2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No games found</p>
          </div>
        )}
      </div>
    </div>
  )
}