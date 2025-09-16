import React from 'react';
import {
  ArrowLeft,
  TrendUp,
  Users,
  Clock,
  Star,
  ChartBar,
  Calendar,
  Trophy,
  Target
} from '@phosphor-icons/react';

interface Game {
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

interface GameStatsViewProps {
  selectedPeriod: 'week' | 'month' | 'year' | 'all'
  setSelectedPeriod: (period: 'week' | 'month' | 'year' | 'all') => void
  selectedGame: Game | null
  setSelectedGame: (game: Game | null) => void
  gameStats: any
  games: Game[]
  onNavigation: (view: string) => void
  selectedGameId?: number
  players: Player[]
}

export default function GameStatsView({ 
  selectedPeriod,
  setSelectedPeriod,
  selectedGame,
  setSelectedGame,
  gameStats,
  games,
  onNavigation,
  selectedGameId,
  players
}: GameStatsViewProps) {
  if (!gameStats) {
    return (
      <div className="space-y-6">
        <div className="text-center text-white/60">
          No game data available
        </div>
      </div>
    );
  }

  // Check if we're showing global stats or specific game stats
  const isGlobalStats = gameStats.isGlobalStats;

  return (
    <div className="space-y-6">
      {/* Header - different for global vs specific game */}
      {isGlobalStats ? (
        /* Global Game Statistics Header */
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <ChartBar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">All Games Statistics</h2>
              <p className="text-white/60">
                Overview across {games.length} games
              </p>
            </div>
          </div>

          {/* Global Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{gameStats.totalSessions}</div>
              <div className="text-white/60 text-sm">Total Sessions</div>
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
      ) : (
        /* Specific Game Overview */
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={selectedGame?.image || 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop'}
              alt={selectedGame?.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold">{selectedGame?.name}</h2>
              <p className="text-white/60">
                {selectedGame?.category} • {selectedGame?.players} players
              </p>
              {selectedGame?.bgg_rating && (
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/60 text-sm">{selectedGame.bgg_rating}/10</span>
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

          {/* Back to Global Stats button when viewing specific game */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={() => setSelectedGame(null)}
              className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-center"
            >
              ← Back to All Games Statistics
            </button>
          </div>
        </div>
      )}

      {/* Game Selector - only show in global stats mode */}
      {isGlobalStats && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Select a Game for Detailed Stats</h3>
          <div className="grid grid-cols-1 gap-3">
            {games.map((game) => {
              const gameSessions = gameStats.gamePopularity[game.name] || 0;
              return (
                <button
                  key={game.game_id}
                  onClick={() => setSelectedGame(game)}
                  className="flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left"
                >
                  <img
                    src={game.image || 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop'}
                    alt={game.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{game.name}</div>
                    <div className="text-white/60 text-sm">{gameSessions} sessions</div>
                  </div>
                  <ChartBar className="w-5 h-5 text-primary" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Game Popularity Chart - only for global stats */}
      {isGlobalStats && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Game Popularity</h3>
            <ChartBar className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-3">
            {Object.entries(gameStats.gamePopularity)
              .sort((a, b) => (b[1] as number) - (a[1] as number))
              .map(([gameName, sessions]) => {
                const maxSessions = Math.max(...Object.values(gameStats.gamePopularity).map(v => v as number));
                const percentage = maxSessions > 0 ? ((sessions as number) / maxSessions) * 100 : 0;
                return (
                  <div key={gameName} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{gameName}</span>
                      <span>{sessions as number} sessions</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

        {/* Session Performance Chart */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Score Trend</h3>
            <TrendUp className="w-5 h-5 text-primary" />
          </div>
          <div className="h-32 flex items-end space-x-2">
            {gameStats.performanceTrend.map((score: number, index: number) => {
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
            <ChartBar className="w-5 h-5 text-secondary" />
          </div>
          <div className="space-y-3">
            {Object.entries(gameStats.sessionTypes).map(([type, count]) => {
              const percentage = (count as number / gameStats.totalSessions) * 100;
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
                    <span>{count as number} sessions ({percentage.toFixed(0)}%)</span>
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
            <ChartBar className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-3">
            {Object.entries(gameStats.playerCountDistribution)
              .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
              .map(([count, sessions]) => {
              const percentage = (sessions as number / gameStats.totalSessions) * 100;
              return (
                <div key={count} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{count} players</span>
                    <span>{sessions as number} sessions ({percentage.toFixed(0)}%)</span>
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
            {gameStats.topWinners.map((winner: any, index: number) => (
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
            {gameStats.recentSessions.map((session: any, index: number) => {
              const winner = players.find(p => p.player_id === session.winner_player_id);
              return (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                  <div className={`w-3 h-3 rounded-full ${
                    session.session_type === 'competitive' ? 'bg-red-400' :
                    session.session_type === 'cooperative' ? 'bg-blue-400' :
                    session.session_type === 'campaign' ? 'bg-purple-400' :
                    'bg-green-400'
                  }`} />
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
    );
  }