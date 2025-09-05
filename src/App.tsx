import React, { useState, useEffect } from 'react'
import {
  Users,
  Gamepad2,
  TrendingUp,
  Settings,
  Plus,
  Play,
  ArrowLeft
} from 'lucide-react'

// Simuler vos services existants
const mockData = {
  playersCount: 426,
  gamesCount: 324,
  recentPlayers: [
    {
      player_id: 1,
      player_name: 'Jane',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      stats: '2,100 pts',
      created_at: new Date()
    },
    {
      player_id: 2,
      player_name: 'Nexus',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      stats: '1,850 pts',
      created_at: new Date()
    },
    {
      player_id: 3,
      player_name: 'Maya',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      stats: '1,620 pts',
      created_at: new Date()
    }
  ],
  recentGames: [
    {
      game_id: 1,
      name: 'Strategy Pro',
      image:
        'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
      players: '2-4'
    },
    {
      game_id: 2,
      name: 'Battle Arena',
      image:
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop',
      players: '3-6'
    },
    {
      game_id: 3,
      name: 'Mind Games',
      image:
        'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
      players: '2-8'
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

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setStats({
        playersCount: mockData.playersCount,
        gamesCount: mockData.gamesCount,
        loading: false,
        error: null
      })
      setRecentPlayers(mockData.recentPlayers)
      setRecentGames(mockData.recentGames)
    }, 1000)
  }, [])

  const handleNavigation = (view) => {
    setCurrentView(view)
    // Dans votre vraie app, utilisez react-router-dom ici
  }

  if (stats.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Chargement du dashboard...</div>
      </div>
    )
  }

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