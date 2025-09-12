import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Trophy,
  Clock,
  Target,
  Star,
  ChartLineUp
} from '@phosphor-icons/react';
import BottomNavigation from './BottomNavigation';

interface Player {
  player_id: number
  player_name: string
  avatar?: string
  games_played: number
  wins: number
  total_score: number
  average_score: number
  favorite_game?: string
  created_at: Date
  updated_at?: Date
  stats?: string
}

interface Circle {
  game_id: number
  name: string
  min_players: number
  max_players: number
  difficulty?: string
  year_published?: number
  players?: string
}

interface PlayerStatsPageProps {
  players: Player[]
  games: Circle[]
  onNavigation: (view: string) => void
  currentView: string
  selectedPlayerId?: number
}

interface CircleSession {
  game_id: number
  game_name: string
  player_id: number
  score: number
  is_winner: boolean
}

// Mock session data for demonstration
const mockSessions: CircleSession[] = [
  { game_id: 1, game_name: 'Strategy Pro', player_id: 1, score: 95, is_winner: true },
  { game_id: 1, game_name: 'Strategy Pro', player_id: 2, score: 78, is_winner: false },
  { game_id: 2, game_name: 'Battle Arena', player_id: 1, score: 120, is_winner: true },
];

export default function PlayerStatsPage({ players, games, onNavigation, currentView, selectedPlayerId }: PlayerStatsPageProps) {
  //const [selectedPeriod, setSelectedPeriod] = useState('all');

  // If selectedPlayerId is provided, filter to show only that player's stats
  const displayPlayers = selectedPlayerId 
    ? players.filter(p => p.player_id === selectedPlayerId)
    : players;

  // Filter sessions for selected player if specified
  const displaySessions = selectedPlayerId
    ? mockSessions.filter(session => session.player_id === selectedPlayerId)
    : mockSessions;

  const selectedPlayer = selectedPlayerId 
    ? players.find(p => p.player_id === selectedPlayerId)
    : null;

  const stats = useMemo(() => {
    const totalPlayers = displayPlayers.length;
    const totalCircles = games.length;
    const totalSessions = displaySessions.length;
    const avgScore = displayPlayers.reduce((sum, p) => sum + p.average_score, 0) / displayPlayers.length || 0;

    return {
      totalPlayers,
      totalCircles,
      totalSessions,
      avgScore: Math.round(avgScore * 10) / 10
    };
  }, [displayPlayers, games, displaySessions]);

  const topPlayers = useMemo(() => {
    return [...displayPlayers]
      .sort((a, b) => b.total_score - a.total_score)
      .slice(0, 5);
  }, [displayPlayers]);

  const recentActivity = useMemo(() => {
    return displaySessions
      .map(session => {
        const player = players.find(p => p.player_id === session.player_id);
        return {
          ...session,
          player_name: player?.player_name || 'Unknown'
        };
      })
      .slice(0, 5);
  }, [displaySessions, players]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigation('players')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">
            {selectedPlayer ? `${selectedPlayer.player_name} Stats` : 'Player Statistics'}
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-6 pb-32">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalPlayers}</div>
                <div className="text-white/60 text-sm">Total Players</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.avgScore}</div>
                <div className="text-white/60 text-sm">Avg Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Players */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-400" />
            Top Players
          </h2>
          <div className="space-y-3">
            {topPlayers.map((player, index) => (
              <div key={player.player_id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-sm">
                  {index + 1}
                </div>
                <img
                  src={player.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`}
                  alt={player.player_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-medium">{player.player_name}</div>
                  <div className="text-white/60 text-sm">{player.total_score} pts</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{player.wins} wins</div>
                  <div className="text-white/60 text-xs">{player.games_played} games</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-400" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                <div className={`w-3 h-3 rounded-full ${activity.is_winner ? 'bg-green-400' : 'bg-gray-400'}`} />
                <div className="flex-1">
                  <div className="font-medium">{activity.player_name}</div>
                  <div className="text-white/60 text-sm">played {activity.game_name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{activity.score} pts</div>
                  {activity.is_winner && (
                    <div className="text-green-400 text-xs">Winner</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance ChartLineUps Placeholder */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <ChartLineUp className="w-5 h-5 mr-2 text-purple-400" />
            Performance Overview
          </h2>
          <div className="text-center py-8 text-white/60">
            <ChartLineUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Detailed charts coming soon...</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentView={currentView} onNavigation={onNavigation} />
    </div>
  );
}