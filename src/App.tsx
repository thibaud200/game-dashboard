import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import Dashboard from '@/components/Dashboard'
import PlayersPage from '@/components/PlayersPage'
import GamesPage from '@/components/GamesPage'

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
  
  // Persistent data using useKV
  const [players, setPlayers] = useKV('board-game-players', mockData.recentPlayers)
  const [games, setGames] = useKV('board-game-games', mockData.recentGames)

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
  }

  const addPlayer = (playerData) => {
    const player = {
      player_id: Date.now(),
      player_name: playerData.player_name,
      avatar: playerData.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
      stats: '0 pts',
      games_played: 0,
      wins: 0,
      created_at: new Date(),
      favorite_game: playerData.favorite_game || 'None'
    }
    setPlayers(currentPlayers => [...currentPlayers, player])
  }

  const addGame = (gameData) => {
    const game = {
      game_id: Date.now(),
      ...gameData
    }
    setGames(currentGames => [...currentGames, game])
  }

  const deletePlayer = (playerId) => {
    setPlayers(currentPlayers => currentPlayers.filter(p => p.player_id !== playerId))
  }

  const deleteGame = (gameId) => {
    setGames(currentGames => currentGames.filter(g => g.game_id !== gameId))
  }

  if (stats.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Chargement du dashboard...</div>
      </div>
    )
  }

  // Render different pages based on current view
  if (currentView === 'players') {
    return (
      <PlayersPage 
        players={players}
        onNavigation={handleNavigation}
        onAddPlayer={addPlayer}
        onDeletePlayer={deletePlayer}
      />
    )
  }
  
  if (currentView === 'games') {
    return (
      <GamesPage 
        games={games}
        onNavigation={handleNavigation}
        onAddGame={addGame}
        onDeleteGame={deleteGame}
      />
    )
  }

  // Dashboard (default view)
  return (
    <Dashboard 
      stats={stats}
      recentPlayers={recentPlayers}
      recentGames={recentGames}
      currentView={currentView}
      onNavigation={handleNavigation}
    />
  )
}