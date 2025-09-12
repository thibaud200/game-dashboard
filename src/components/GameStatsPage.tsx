import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  TrendUp,
  Users,
  Clock,
  Star,
  ChartLineUp,
  Calendar,
  Trophy,
  Target
} from '@phosphor-icons/react';
import BottomNavigation from './BottomNavigation';

interface Circle {
  game_id: number
  name: string
  description?: string
  image?: string
  min_players: number
  max_players: number
  duration?: string
  difficulty?: string
  category?: string
  year_published?: number
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
  players?: string
}

interface Player {
  player_id: number
  player_name: string
  avatar?: string
}

interface CircleStatsPageProps {
  games: Circle[]
  players: Player[]
  onNavigation: (view: string) => void
  currentView: string
  selectedCircleId?: number
}

interface CircleSession {
  session_id: number
  game_id: number
  date: Date
  duration_minutes?: number
  winner_player_id?: number
  session_type: 'competitive' | 'cooperative' | 'campaign' | 'hybrid'
  player_count: number
  average_score: number
}

// Mock session data for demonstration
const mockCircleSessions: CircleSession[] = [
  { session_id: 1, game_id: 1, date: new Date('2024-02-15'), duration_minutes: 75, winner_player_id: 1, session_type: 'competitive', player_count: 4, average_score: 85 },
  { session_id: 2, game_id: 1, date: new Date('2024-02-12'), duration_minutes: 80, winner_player_id: 2, session_type: 'competitive', player_count: 3, average_score: 78 },
  { session_id: 3, game_id: 1, date: new Date('2024-02-08'), duration_minutes: 70, winner_player_id: 1, session_type: 'campaign', player_count: 4, average_score: 92 },
  { session_id: 4, game_id: 2, date: new Date('2024-02-14'), duration_minutes: 60, winner_player_id: 3, session_type: 'competitive', player_count: 5, average_score: 76 },
  { session_id: 5, game_id: 2, date: new Date('2024-02-10'), duration_minutes: 65, winner_player_id: 2, session_type: 'competitive', player_count: 4, average_score: 82 }
];

export default function CircleStatsPage({ games, players, onNavigation, currentView, selectedCircleId }: CircleStatsPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month');
  
  // Use selectedCircleId if provided, otherwise default to first game
  const [selectedStar, setSelectedCircle] = useState<Circle | null>(() => {
    if (selectedCircleId) {
      return games.find(g => g.game_id === selectedCircleId) || games[0] || null;
    }
    return games[0] || null;
  });

  // If selectedCircleId is provided, filter to show only that game's stats
  /*const displayCircles = selectedCircleId 
    ? games.filter(g => g.game_id === selectedCircleId)
    : games;*/

  // Calculate comprehensive game stats
  const gameStats = useMemo(() => {
    if (!selectedCircle) return null;

    const gameSessions = mockCircleSessions.filter(s => s.game_id === selectedCircle.game_id);
    const totalSessions = gameSessions.length;
    const totalPlayers = gameSessions.reduce((sum, s) => sum + s.player_count, 0);
    const averagePlayerCount = totalSessions > 0 ? totalPlayers / totalSessions : 0;
    const totalPlayTime = gameSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    const averageSessionTime = totalSessions > 0 ? totalPlayTime / totalSessions : 0;
    const averageScore = totalSessions > 0 ? gameSessions.reduce((sum, s) => sum + s.average_score, 0) / totalSessions : 0;

    // Session types distribution
    const sessionTypes = gameSessions.reduce((acc, session) => {
      acc[session.session_type] = (acc[session.session_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Player count distribution
    const playerCountDistribution = gameSessions.reduce((acc, session) => {
      const count = session.player_count.toString();
      acc[count] = (acc[count] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Winner frequency
    const winnerFrequency = gameSessions.reduce((acc, session) => {
      if (session.winner_player_id) {
        acc[session.winner_player_id] = (acc[session.winner_player_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    const topWinners = Object.entries(winnerFrequency)
      .map(([playerId, wins]) => {
        const player = players.find(p => p.player_id === parseInt(playerId));
        return { player, wins: wins as number };
      })
      .filter(w => w.player)
      .sort((a, b) => b.wins - a.wins)
      .slice(0, 5);

    // Performance trend (last 10 sessions)
    const recentSessions = gameSessions.slice(-10);
    const performanceTrend = recentSessions.map(s => s.average_score);

    // Play frequency over time
    const playFrequency = gameSessions.reduce((acc, session) => {
      const month = session.date.toISOString().substring(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSessions,
      totalPlayers,
      averagePlayerCount,
      totalPlayTime,
      averageSessionTime,
      averageScore,
      sessionTypes,
      playerCountDistribution,
      topWinners,
      performanceTrend,
      playFrequency,
      recentSessions: gameSessions.slice(-5)
    };
  }, [selectedStar, players]);

  if (!selectedCircle || !gameStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="px-4 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => onNavigation('games')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Circle Stats</h1>
            <div className="w-10" />
          </div>
          <div className="text-center text-white/60">
            No game data available
          </div>
        </div>
        <BottomNavigation currentView={currentView} onNavigation={onNavigation} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigation('games')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">
            {selectedCircleId && selectedCircle ? `${selectedCircle.name} Stats` : 'Circle Statistics'}
          </h1>
          <div className="w-10" />
        </div>

        {/* Circle Selector - Only show when not viewing specific game stats */}
        {!selectedCircleId && (
          <div className="mb-6">
            <select
              value={selectedCircle?.game_id || ''}
              onChange={(e) => {
                const game = games.find(g => g.game_id === parseInt(e.target.value));
                setSelectedCircle(game || null);
              }}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {games.map(game => (
                <option key={game.game_id} value={game.game_id} className="bg-slate-800 text-white">
                  {game.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Period Selector */}
        <div className="flex space-x-2 mb-6">
          {['week', 'month', 'year', 'all'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period as any)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                selectedPeriod === period
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Stats Type Switcher */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => onNavigation('player-stats')}
            className="flex-1 px-4 py-2 rounded-lg transition-colors bg-white/10 text-white/80 hover:bg-white/20"
          >
            Player Stats
          </button>
          <button
            onClick={() => onNavigation('game-stats')}
            className="flex-1 px-4 py-2 rounded-lg transition-colors bg-primary text-primary-foreground"
          >
            Circle Stats
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-6 pb-32">
        {/* Circle Overview */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={selectedCircle.image || 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop'}
              alt={selectedCircle.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold">{selectedCircle.name}</h2>
              <p className="text-white/60">
                {selectedCircle.category} • {selectedCircle.players} players
              </p>
              {selectedCircle.bgg_rating && (
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/60 text-sm">{selectedCircle.bgg_rating}/10</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{gameStats.totalSessions}</div>
              <div className="text-white/60 text-sm">Sessions</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{gameStats.averagePlayerCount.toFixed(1)}</div>
              <div className="text-white/60 text-sm">Avg Players</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{Math.round(gameStats.averageSessionTime)}m</div>
              <div className="text-white/60 text-sm">Avg Duration</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Target className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{gameStats.averageScore.toFixed(0)}</div>
              <div className="text-white/60 text-sm">Avg Score</div>
            </div>
          </div>
        </div>

        {/* Session Performance ChartLineUp */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Score Trend</h3>
            <TrendUp className="w-5 h-5 text-primary" />
          </div>
          <div className="h-32 flex items-end space-x-2">
            {gameStats.performanceTrend.map((score, index) => {
              const maxScore = Math.max(...gameStats.performanceTrend);
              const height = maxScore > 0 ? (score / maxScore) * 100 : 0;
              return (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-primary/50 to-primary rounded-t-lg transition-all duration-300 hover:from-primary hover:to-primary/80"
                  style={{ height: `${height}%`, minHeight: '8px' }}
                  title={`Average Score: ${score}`}
                />
              );
            })}
          </div>
          <div className="text-center text-white/60 text-sm mt-2">Last 10 Sessions</div>
        </div>

        {/* Session Types Distribution */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Session Types</h3>
            <ChartLineUp className="w-5 h-5 text-secondary" />
          </div>
          <div className="space-y-3">
            {Object.entries(gameStats.sessionTypes).map(([type, count]) => {
              const percentage = (count / gameStats.totalSessions) * 100;
              const colors = {
                competitive: 'from-red-400 to-red-600',
                cooperative: 'from-blue-400 to-blue-600',
                campaign: 'from-purple-400 to-purple-600',
                hybrid: 'from-green-400 to-green-600'
              };
              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{type}</span>
                    <span>{count} sessions ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${colors[type as keyof typeof colors]} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Player Count Distribution */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Player Count Distribution</h3>
            <ChartLineUp className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-3">
            {Object.entries(gameStats.playerCountDistribution)
              .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
              .map(([count, sessions]) => {
              const percentage = (sessions / gameStats.totalSessions) * 100;
              return (
                <div key={count} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{count} players</span>
                    <span>{sessions} sessions ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-accent to-accent/60 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Winners */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top Winners</h3>
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="space-y-3">
            {gameStats.topWinners.map((winner, index) => (
              <div key={winner.player?.player_id} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-400 text-yellow-900' :
                  index === 1 ? 'bg-gray-300 text-gray-900' :
                  index === 2 ? 'bg-amber-600 text-amber-100' :
                  'bg-primary/20 text-primary'
                }`}>
                  {index + 1}
                </div>
                <img
                  src={winner.player?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                  alt={winner.player?.player_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-medium">{winner.player?.player_name}</div>
                  <div className="text-white/60 text-sm">{winner.wins} wins</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Sessions</h3>
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-3">
            {gameStats.recentSessions.map((session, index) => {
              const winner = players.find(p => p.player_id === session.winner_player_id);
              return (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                  <div className={`w-3 h-3 rounded-full bg-${session.session_type === 'competitive' ? 'red' : session.session_type === 'cooperative' ? 'blue' : session.session_type === 'campaign' ? 'purple' : 'green'}-400`} />
                  <div className="flex-1">
                    <div className="font-medium capitalize">{session.session_type}</div>
                    <div className="text-white/60 text-sm">
                      {session.date.toLocaleDateString()} • {session.player_count} players • {session.duration_minutes}min
                    </div>
                    {winner && (
                      <div className="text-white/60 text-sm">
                        Winner: {winner.player_name}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{session.average_score.toFixed(0)}</div>
                    <div className="text-white/60 text-xs">avg score</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNavigation currentView={currentView} onNavigation={onNavigation} />
    </div>
  );
}