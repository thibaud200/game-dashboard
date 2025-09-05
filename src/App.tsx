import React, { useState, useEffect } from 'react'
import {
  Users,
  Gamepad2,
  TrendingUp,
  Settings,
  Plus,
  Play,
  ArrowLeft,
  Search,
  Trophy,
  Medal,
  Calendar,
  Edit3,
  Trash2,
  MoreVertical
} from 'lucide-react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

// Mock data for initial display
const mockData = {
  playersCount: 12,
  gamesCount: 8,
  recentPlayers: [
    {
      player_id: 1,
      player_name: 'Jane',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      stats: '2,100 pts',
      games_played: 45,
      wins: 28,
      created_at: new Date('2024-01-15'),
      favorite_game: 'Strategy Pro'
    },
    {
      player_id: 2,
      player_name: 'Nexus',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      stats: '1,850 pts',
      games_played: 38,
      wins: 19,
      created_at: new Date('2024-02-02'),
      favorite_game: 'Battle Arena'
    },
    {
      player_id: 3,
      player_name: 'Maya',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      stats: '1,620 pts',
      games_played: 32,
      wins: 15,
      created_at: new Date('2024-01-28'),
      favorite_game: 'Mind Games'
    },
    {
      player_id: 4,
      player_name: 'Alex',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      stats: '1,420 pts',
      games_played: 28,
      wins: 12,
      created_at: new Date('2024-02-10'),
      favorite_game: 'Strategy Pro'
    }
  ],
  recentGames: [
    {
      game_id: 1,
      name: 'Strategy Pro',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
      players: '2-4',
      description: 'A complex strategy game that challenges your tactical thinking.',
      duration: '60-90 min',
      difficulty: 'Expert',
      category: 'Strategy'
    },
    {
      game_id: 2,
      name: 'Battle Arena',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop',
      players: '3-6',
      description: 'Fast-paced combat game with multiple character classes.',
      duration: '45-60 min',
      difficulty: 'Intermediate',
      category: 'Combat'
    },
    {
      game_id: 3,
      name: 'Mind Games',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
      players: '2-8',
      description: 'Psychological warfare meets board game mechanics.',
      duration: '30-45 min',
      difficulty: 'Beginner',
      category: 'Party'
    },
    {
      game_id: 4,
      name: 'Cosmic Empire',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop',
      players: '2-5',
      description: 'Build your galactic empire across the stars.',
      duration: '90-120 min',
      difficulty: 'Expert',
      category: 'Strategy'
    }
  ]
}

export default function ModernDashboard() {
  const [stats, setStats] = useState({
    playersCount: 0,
    gamesCount: 0,
    loading: true,
    error: null
  })
  const [recentPlayers, setRecentPlayers] = useState([])
  const [recentGames, setRecentGames] = useState([])
  const [currentView, setCurrentView] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Persistent data using useKV
  const [players, setPlayers] = useKV('board-game-players', mockData.recentPlayers)
  const [games, setGames] = useKV('board-game-games', mockData.recentGames)
  
  // Form states for adding new players/games
  const [newPlayer, setNewPlayer] = useState({
    player_name: '',
    avatar: '',
    favorite_game: ''
  })
  const [newGame, setNewGame] = useState({
    name: '',
    image: '',
    players: '',
    description: '',
    duration: '',
    difficulty: 'Beginner',
    category: ''
  })

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        playersCount: players.length,
        gamesCount: games.length,
        loading: false,
        error: null
      })
      setRecentPlayers(players.slice(0, 3))
      setRecentGames(games.slice(0, 3))
    }, 1000)
  }, [players, games])

  const handleNavigation = (view) => {
    setCurrentView(view)
    setSearchQuery('')
  }

  const addPlayer = () => {
    if (newPlayer.player_name.trim()) {
      const player = {
        player_id: Date.now(),
        player_name: newPlayer.player_name,
        avatar: newPlayer.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
        stats: '0 pts',
        games_played: 0,
        wins: 0,
        created_at: new Date(),
        favorite_game: newPlayer.favorite_game || 'None'
      }
      setPlayers(currentPlayers => [...currentPlayers, player])
      setNewPlayer({ player_name: '', avatar: '', favorite_game: '' })
    }
  }

  const addGame = () => {
    if (newGame.name.trim()) {
      const game = {
        game_id: Date.now(),
        name: newGame.name,
        image: newGame.image || 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
        players: newGame.players || '2-4',
        description: newGame.description || 'A fun board game experience.',
        duration: newGame.duration || '30-60 min',
        difficulty: newGame.difficulty,
        category: newGame.category || 'General'
      }
      setGames(currentGames => [...currentGames, game])
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

  const deletePlayer = (playerId) => {
    setPlayers(currentPlayers => currentPlayers.filter(p => p.player_id !== playerId))
  }

  const deleteGame = (gameId) => {
    setGames(currentGames => currentGames.filter(g => g.game_id !== gameId))
  }

  // Filter functions
  const filteredPlayers = players.filter(player =>
    player.player_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (stats.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Chargement du dashboard...</div>
      </div>
    )
  }

  // Players Page Component
  const PlayersPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => handleNavigation('dashboard')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Players</h1>
          <Dialog>
            <DialogTrigger asChild>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Plus className="w-6 h-6" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Add New Player</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="player-name">Player Name</Label>
                  <Input
                    id="player-name"
                    value={newPlayer.player_name}
                    onChange={(e) => setNewPlayer(prev => ({ ...prev, player_name: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter player name"
                  />
                </div>
                <div>
                  <Label htmlFor="avatar-url">Avatar URL (optional)</Label>
                  <Input
                    id="avatar-url"
                    value={newPlayer.avatar}
                    onChange={(e) => setNewPlayer(prev => ({ ...prev, avatar: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="favorite-game">Favorite Game (optional)</Label>
                  <Input
                    id="favorite-game"
                    value={newPlayer.favorite_game}
                    onChange={(e) => setNewPlayer(prev => ({ ...prev, favorite_game: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Favorite game"
                  />
                </div>
                <Button onClick={addPlayer} className="w-full bg-teal-600 hover:bg-teal-700">
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
                    <span className="text-xs text-white/40">
                      Joined {player.created_at.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deletePlayer(player.player_id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
    </div>
  )

  // Games Page Component  
  const GamesPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => handleNavigation('dashboard')}
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
                <Button onClick={addGame} className="w-full bg-emerald-600 hover:bg-emerald-700">
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
                        onClick={() => deleteGame(game.game_id)}
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

  // Render different pages based on current view
  if (currentView === 'players') {
    return <PlayersPage />
  }
  
  if (currentView === 'games') {
    return <GamesPage />
  }

  // Dashboard (default view)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => handleNavigation('back')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={() => handleNavigation('settings')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Stats circulaires */}
        <div className="flex justify-center space-x-8 mb-8">
          <button
            onClick={() => handleNavigation('players')}
            className="group relative"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-xs text-white/80">Players</div>
                <div className="text-lg font-bold text-white">
                  {stats.playersCount}
                </div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-teal-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          <button
            onClick={() => handleNavigation('games')}
            className="group relative"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-xs text-white/80">Games</div>
                <div className="text-lg font-bold text-white">
                  {stats.gamesCount}
                </div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 space-y-6 pb-24">
        {/* Section Joueurs */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Player Statistics</h2>
            <button
              onClick={() => handleNavigation('players')}
              className="text-teal-400 hover:text-teal-300 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {recentPlayers.map((player) => (
              <button
                key={player.player_id}
                onClick={() => handleNavigation(`player-${player.player_id}`)}
                className="group w-full"
              >
                <div className="bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-white/20 hover:shadow-lg hover:scale-105">
                  <img
                    src={player.avatar}
                    alt={player.player_name}
                    className="w-8 h-8 rounded-full mb-2 mx-auto object-cover"
                  />
                  <div className="text-center">
                    <div className="text-sm font-medium text-white truncate">
                      {player.player_name}
                    </div>
                    <div className="text-xs text-white/60">{player.stats}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Section Jeux récents */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Games</h2>
            <button
              onClick={() => handleNavigation('games')}
              className="text-teal-400 hover:text-teal-300 transition-colors"
            >
              <Gamepad2 className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {recentGames.map((game) => (
              <button
                key={game.game_id}
                onClick={() => handleNavigation(`game-${game.game_id}`)}
                className="group w-full"
              >
                <div className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-white/20 hover:shadow-lg hover:scale-105">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-16 object-cover"
                  />
                  <div className="p-2">
                    <div className="text-sm font-medium text-white truncate">
                      {game.name}
                    </div>
                    <div className="text-xs text-white/60">
                      {game.players} players
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <button
              onClick={() => handleNavigation('activity')}
              className="w-full flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">New game started</div>
                <div className="text-xs text-white/60">5 minutes ago</div>
              </div>
            </button>
            <button
              onClick={() => handleNavigation('activity')}
              className="w-full flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">Player joined</div>
                <div className="text-xs text-white/60">12 minutes ago</div>
              </div>
            </button>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleNavigation('current-game')}
            className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-4 flex flex-col items-center justify-center hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Play className="w-8 h-8 mb-2" />
            <span className="font-medium">New Game</span>
          </button>
          <button
            onClick={() => handleNavigation('create-player')}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-4 flex flex-col items-center justify-center hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-8 h-8 mb-2" />
            <span className="font-medium">Add Player</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-md border-t border-white/10">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => handleNavigation('dashboard')}
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
            onClick={() => handleNavigation('players')}
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
            onClick={() => handleNavigation('games')}
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
            onClick={() => handleNavigation('settings')}
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