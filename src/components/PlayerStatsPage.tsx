import React, { useState, useMemo } from 'react'
  ArrowL
  Trophy,
  Clock,
  Trophy,
  Target,
  Clock,
  Star,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react'
import BottomNavigation from './BottomNavigation'

interface Player {
  player_id: number
  max_players: number
  difficulty?: st
  year_published?: num
  players?: st

  players: Player[]
  onNavigation: (view: s
}
interface GameSe
 

  is_winner: boo
}
// Mock sessio
  { game_id: 1, 
  { game_id: 1, game_
  { game_id: 2, game_

  const [selectedPeri

  const playerStats = use

    const totalGam
 


    const gamesByCa
      const cat
      return acc

 

    const gameFrequency
      return acc

      .sort(

      totalGames,
      winRate,
      bestScore,
 

    }

    return (
        <div className="px-4 pt-8 pb-6">
            <button
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
  { game_id: 2, game_name: 'Battle Arena', date: new Date('2024-02-08'), score: 91, placement: 1, is_winner: true, duration_minutes: 65 }
]

export default function PlayerStatsPage({ players, games, onNavigation, currentView }: PlayerStatsPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month')
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(players[0] || null)

  // Calculate comprehensive stats
  const playerStats = useMemo(() => {
    if (!selectedPlayer) return null

    const playerSessions = mockSessions // In real app, filter by player_id
    const totalGames = playerSessions.length
    const wins = playerSessions.filter(s => s.is_winner).length
    const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0
    const averageScore = totalGames > 0 ? playerSessions.reduce((sum, s) => sum + s.score, 0) / totalGames : 0
    const bestScore = Math.max(...playerSessions.map(s => s.score))
    const totalPlayTime = playerSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)

    // Games by category
    const gamesByCategory = playerSessions.reduce((acc, session) => {
      const game = games.find(g => g.game_id === session.game_id)
      const category = game?.category || 'Unknown'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Recent performance trend (last 10 games)
    const recentSessions = playerSessions.slice(-10)
    const performanceTrend = recentSessions.map(s => s.score)

    // Favorite games (most played)
    const gameFrequency = playerSessions.reduce((acc, session) => {
      acc[session.game_name] = (acc[session.game_name] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const favoriteGames = Object.entries(gameFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return {
      totalGames,
      wins,
      winRate,
      averageScore,
      bestScore,
      totalPlayTime,
      gamesByCategory,
      performanceTrend,
      favoriteGames,
      recentSessions: playerSessions.slice(-5)
    }
  }, [selectedPlayer, games])

  if (!selectedPlayer || !playerStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="px-4 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => onNavigation('players')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
        {/* Stats Type Switcher */}
            </button>
            <h1 className="text-2xl font-bold">Player Stats</h1>
            <div className="w-10" />
          </div>
          <div className="text-center text-white/60">
            onClick={() => onNavigat
          </div>
            Ga
        <BottomNavigation currentView={currentView} onNavigation={onNavigation} />
      </div>
    )
  }

          
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              alt={s
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigation('players')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          <
            <ArrowLeft className="w-6 h-6" />
          <div clas
          <h1 className="text-2xl font-bold">Player Stats</h1>
              <div className="text
        </div>

        {/* Player Selector */}
              <div className="
          <select
              <BarChart3 className="w-8 h-8 
            onChange={(e) => {
            </div>
              setSelectedPlayer(player || null)
            }}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          <
            {players.map(player => (
              <option key={player.player_id} value={player.player_id} className="bg-slate-800 text-white">
                {player.player_name}
            <h3 classNa
            ))}
          <div clas
        </div>

        {/* Period Selector */}
        <div className="flex space-x-2 mb-6">
          {['week', 'month', 'year', 'all'].map(period => (
                />
              key={period}
              onClick={() => setSelectedPeriod(period as any)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${

                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
          </d
              {period}
            </button>
          ))}
              
      </div>

      {/* Content */}
                      className="bg-gradient
        {/* Player Overview */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-4 mb-6">
            })}
              src={selectedPlayer.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
              alt={selectedPlayer.player_name}
              className="w-16 h-16 rounded-full object-cover"
          <div
            <div>
              <h2 className="text-2xl font-bold">{selectedPlayer.player_name}</h2>
              <p className="text-white/60">
                Member since {selectedPlayer.created_at.toLocaleDateString()}
              </p>
          </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{playerStats.wins}</div>
              <div className="text-white/60 text-sm">Wins</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{playerStats.winRate.toFixed(1)}%</div>
              <div className="text-white/60 text-sm">Win Rate</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{playerStats.averageScore.toFixed(0)}</div>
              <div className="text-white/60 text-sm">Avg Score</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{Math.round(playerStats.totalPlayTime / 60)}h</div>
              <div className="text-white/60 text-sm">Play Time</div>
            </div>
          </div>
      <BottomN

        {/* Performance Chart */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Performance Trend</h3>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>

            {playerStats.performanceTrend.map((score, index) => {
              const height = (score / playerStats.bestScore) * 100
              return (

                  key={index}
                  className="flex-1 bg-gradient-to-t from-primary/50 to-primary rounded-t-lg transition-all duration-300 hover:from-primary hover:to-primary/80"
                  style={{ height: `${height}%`, minHeight: '8px' }}

                />

            })}
          </div>
          <div className="text-center text-white/60 text-sm mt-2">Last 10 Games</div>


        {/* Games by Category */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Games by Category</h3>
            <PieChart className="w-5 h-5 text-secondary" />
          </div>
          <div className="space-y-3">
            {Object.entries(playerStats.gamesByCategory).map(([category, count]) => {
              const percentage = (count / playerStats.totalGames) * 100
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category}</span>
                    <span>{count} games ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">

                      className="bg-gradient-to-r from-secondary to-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}

        </div>

        {/* Favorite Games */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Favorite Games</h3>
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="space-y-3">
            {playerStats.favoriteGames.map(([gameName, playCount], index) => (
              <div key={gameName} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}

                <div className="flex-1">

                  <div className="text-white/60 text-sm">{playCount} times played</div>
                </div>
              </div>

          </div>



        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Games</h3>
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-3">
            {playerStats.recentSessions.map((session, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                <div className={`w-3 h-3 rounded-full ${session.is_winner ? 'bg-green-400' : 'bg-red-400'}`} />
                <div className="flex-1">
                  <div className="font-medium">{session.game_name}</div>
                  <div className="text-white/60 text-sm">
                    {session.date.toLocaleDateString()} • Score: {session.score}

                </div>
                <div className="text-right">
                  {session.is_winner ? (

                  ) : (
                    <div className="text-white/60 text-sm">#{session.placement}</div>
                  )}
                </div>
              </div>

          </div>
        </div>
      </div>

      <BottomNavigation currentView={currentView} onNavigation={onNavigation} />

  )
