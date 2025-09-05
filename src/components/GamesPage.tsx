import React, { useState } from 'react'
import {
  Gamepad2,
  Plus,
  ArrowLeft,
  Search,
  Trash2,
  Users,
  TrendingUp,
  Settings,
  Edit,
  Clock,
  Target,
  Calendar,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Game {
  game_id: number
  name: string
  image: string
  min_players: number
  max_players: number
  description: string
  duration: string
  difficulty: string
  category: string
  year_published: number
  publisher: string
  designer: string
  bgg_rating: number
  weight: number
  age_min: number
  players: string
}

interface GamesPageProps {
  games: Game[]
  onNavigation: (view: string) => void
  onAddGame: (game: Omit<Game, 'game_id' | 'players'>) => void
  onUpdateGame: (gameId: number, game: Partial<Game>) => void
  onDeleteGame: (gameId: number) => void
  currentView?: string
}

export default function GamesPage({ 
  games, 
  onNavigation, 
  onAddGame, 
  onUpdateGame,
  onDeleteGame,
  currentView = 'games'
}: GamesPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    min_players: 2,
    max_players: 4,
    description: '',
    duration: '',
    difficulty: 'Beginner',
    category: '',
    year_published: new Date().getFullYear(),
    publisher: '',
    designer: '',
    bgg_rating: 0,
    weight: 0,
    age_min: 8
  })

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.designer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.publisher.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      name: '',
      image: '',
      min_players: 2,
      max_players: 4,
      description: '',
      duration: '',
      difficulty: 'Beginner',
      category: '',
      year_published: new Date().getFullYear(),
      publisher: '',
      designer: '',
      bgg_rating: 0,
      weight: 0,
      age_min: 8
    })
  }

  const handleAddGame = () => {
    if (formData.name.trim()) {
      onAddGame({
        name: formData.name,
        image: formData.image || 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
        min_players: formData.min_players,
        max_players: formData.max_players,
        description: formData.description || 'A fun board game experience.',
        duration: formData.duration || '30-60 min',
        difficulty: formData.difficulty,
        category: formData.category || 'General',
        year_published: formData.year_published,
        publisher: formData.publisher || 'Unknown',
        designer: formData.designer || 'Unknown',
        bgg_rating: formData.bgg_rating,
        weight: formData.weight,
        age_min: formData.age_min
      })
      resetForm()
      setIsAddDialogOpen(false)
    }
  }

  const handleEditGame = (game: Game) => {
    setEditingGame(game)
    setFormData({
      name: game.name,
      image: game.image,
      min_players: game.min_players,
      max_players: game.max_players,
      description: game.description,
      duration: game.duration,
      difficulty: game.difficulty,
      category: game.category,
      year_published: game.year_published,
      publisher: game.publisher,
      designer: game.designer,
      bgg_rating: game.bgg_rating,
      weight: game.weight,
      age_min: game.age_min
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateGame = () => {
    if (editingGame && formData.name.trim()) {
      onUpdateGame(editingGame.game_id, formData)
      resetForm()
      setEditingGame(null)
      setIsEditDialogOpen(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-400'
      case 'intermediate': return 'text-yellow-400'
      case 'expert': return 'text-red-400'
      default: return 'text-white/60'
    }
  }

  const getWeightStars = (weight: number) => {
    const stars = Math.round(weight)
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
      />
    ))
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Plus className="w-6 h-6" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Game</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="game-name">Game Name *</Label>
                  <Input
                    id="game-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter game name"
                  />
                </div>
                <div>
                  <Label htmlFor="game-image">Image URL</Label>
                  <Input
                    id="game-image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min-players">Min Players</Label>
                    <Input
                      id="min-players"
                      type="number"
                      min="1"
                      value={formData.min_players}
                      onChange={(e) => setFormData(prev => ({ ...prev, min_players: parseInt(e.target.value) || 1 }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-players">Max Players</Label>
                    <Input
                      id="max-players"
                      type="number"
                      min="1"
                      value={formData.max_players}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_players: parseInt(e.target.value) || 1 }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="30-60 min"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age-min">Min Age</Label>
                    <Input
                      id="age-min"
                      type="number"
                      min="1"
                      value={formData.age_min}
                      onChange={(e) => setFormData(prev => ({ ...prev, age_min: parseInt(e.target.value) || 1 }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Strategy, Party, etc."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="designer">Designer</Label>
                    <Input
                      id="designer"
                      value={formData.designer}
                      onChange={(e) => setFormData(prev => ({ ...prev, designer: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Game designer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input
                      id="publisher"
                      value={formData.publisher}
                      onChange={(e) => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Publisher"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="year-published">Year</Label>
                    <Input
                      id="year-published"
                      type="number"
                      min="1800"
                      max="2030"
                      value={formData.year_published}
                      onChange={(e) => setFormData(prev => ({ ...prev, year_published: parseInt(e.target.value) || new Date().getFullYear() }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bgg-rating">BGG Rating</Label>
                    <Input
                      id="bgg-rating"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={formData.bgg_rating}
                      onChange={(e) => setFormData(prev => ({ ...prev, bgg_rating: parseFloat(e.target.value) || 0 }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (1-5)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
            placeholder="Search games, designers, publishers..."
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        {/* Games Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
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
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <div className="text-2xl font-bold text-purple-400">
              {games.length > 0 ? (games.reduce((sum, g) => sum + g.bgg_rating, 0) / games.length).toFixed(1) : '0.0'}
            </div>
            <div className="text-xs text-white/80">Avg Rating</div>
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
                            {game.min_players === game.max_players ? `${game.min_players}` : `${game.min_players}-${game.max_players}`} players
                          </Badge>
                          <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {game.duration}
                          </Badge>
                          <Badge variant="outline" className={`border-white/20 text-xs ${getDifficultyColor(game.difficulty)}`}>
                            <Target className="w-3 h-3 mr-1" />
                            {game.difficulty}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs text-white/60">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{game.year_published}</span>
                            </span>
                            {game.bgg_rating > 0 && (
                              <span className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400" />
                                <span>{game.bgg_rating.toFixed(1)}</span>
                              </span>
                            )}
                            {game.weight > 0 && (
                              <div className="flex items-center space-x-1">
                                <span>Weight:</span>
                                <div className="flex">
                                  {getWeightStars(game.weight)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {(game.designer !== 'Unknown' || game.publisher !== 'Unknown') && (
                          <div className="mt-1 text-xs text-white/50">
                            {game.designer !== 'Unknown' && `By ${game.designer}`}
                            {game.designer !== 'Unknown' && game.publisher !== 'Unknown' && ' • '}
                            {game.publisher !== 'Unknown' && game.publisher}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditGame(game)}
                          className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteGame(game.game_id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

      {/* Edit Game Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Game</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-game-name">Game Name *</Label>
              <Input
                id="edit-game-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter game name"
              />
            </div>
            <div>
              <Label htmlFor="edit-game-image">Image URL</Label>
              <Input
                id="edit-game-image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-min-players">Min Players</Label>
                <Input
                  id="edit-min-players"
                  type="number"
                  min="1"
                  value={formData.min_players}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_players: parseInt(e.target.value) || 1 }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-max-players">Max Players</Label>
                <Input
                  id="edit-max-players"
                  type="number"
                  min="1"
                  value={formData.max_players}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_players: parseInt(e.target.value) || 1 }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-duration">Duration</Label>
                <Input
                  id="edit-duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="30-60 min"
                />
              </div>
              <div>
                <Label htmlFor="edit-age-min">Min Age</Label>
                <Input
                  id="edit-age-min"
                  type="number"
                  min="1"
                  value={formData.age_min}
                  onChange={(e) => setFormData(prev => ({ ...prev, age_min: parseInt(e.target.value) || 1 }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-difficulty">Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Strategy, Party, etc."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-designer">Designer</Label>
                <Input
                  id="edit-designer"
                  value={formData.designer}
                  onChange={(e) => setFormData(prev => ({ ...prev, designer: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Game designer"
                />
              </div>
              <div>
                <Label htmlFor="edit-publisher">Publisher</Label>
                <Input
                  id="edit-publisher"
                  value={formData.publisher}
                  onChange={(e) => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Publisher"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-year-published">Year</Label>
                <Input
                  id="edit-year-published"
                  type="number"
                  min="1800"
                  max="2030"
                  value={formData.year_published}
                  onChange={(e) => setFormData(prev => ({ ...prev, year_published: parseInt(e.target.value) || new Date().getFullYear() }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-bgg-rating">BGG Rating</Label>
                <Input
                  id="edit-bgg-rating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.bgg_rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, bgg_rating: parseFloat(e.target.value) || 0 }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-weight">Weight (1-5)</Label>
                <Input
                  id="edit-weight"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Brief game description"
                rows={3}
              />
            </div>
            <Button onClick={handleUpdateGame} className="w-full bg-blue-600 hover:bg-blue-700">
              Update Game
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