import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import Dashboard from '@/components/Dashboard'
import PlayersPage from '@/components/PlayersPage'
import GamesPage from '@/components/GamesPage'

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
  favorite_game: string
  email: string
}

interface Game {
  game_id: number
  bgg_id?: number
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
  game_type: 'competitive' | 'cooperative' | 'campaign' | 'hybrid'
  supports_cooperative: boolean
  supports_competitive: boolean
  supports_campaign: boolean
  has_expansion: boolean
  has_characters: boolean
  expansions: any[]
  characters: any[]
}

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
      total_score: 2100,
      average_score: 46.7,
      created_at: new Date('2024-01-15'),
      favorite_game: 'Strategy Pro',
      email: 'jane@example.com'
    },
    {
      player_id: 2,
      player_name: 'Nexus',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      stats: '1,850 pts',
      games_played: 38,
      wins: 19,
      total_score: 1850,
      average_score: 48.7,
      created_at: new Date('2024-02-02'),
      favorite_game: 'Battle Arena',
      email: 'nexus@example.com'
    },
    {
      player_id: 3,
      player_name: 'Maya',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      stats: '1,620 pts',
      games_played: 32,
      wins: 15,
      total_score: 1620,
      average_score: 50.6,
      created_at: new Date('2024-01-28'),
      favorite_game: 'Mind Games',
      email: 'maya@example.com'
    },
    {
      player_id: 4,
      player_name: 'Alex',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      stats: '1,420 pts',
      games_played: 28,
      wins: 12,
      total_score: 1420,
      average_score: 50.7,
      created_at: new Date('2024-02-10'),
      favorite_game: 'Strategy Pro',
      email: 'alex@example.com'
    }
  ],
  recentGames: [
    {
      game_id: 1,
      bgg_id: 12345,
      name: 'Strategy Pro',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
      min_players: 2,
      max_players: 4,
      description: 'A complex strategy game that challenges your tactical thinking.',
      duration: '60-90 min',
      difficulty: 'Expert',
      category: 'Strategy',
      year_published: 2022,
      publisher: 'Strategy Games Inc.',
      designer: 'John Designer',
      bgg_rating: 7.8,
      weight: 3.5,
      age_min: 14,
      players: '2-4',
      game_type: 'competitive' as const,
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: true,
      has_expansion: false,
      has_characters: true,
      expansions: [],
      characters: [
        {
          id: 'commander',
          name: 'Commander',
          description: 'Strategic military leader',
          abilities: ['Battle Tactics', 'Resource Management', 'Unit Command']
        }
      ],

    },
    {
      game_id: 2,
      name: 'Battle Arena',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop',
      min_players: 3,
      max_players: 6,
      description: 'Fast-paced combat game with multiple character classes.',
      duration: '45-60 min',
      difficulty: 'Intermediate',
      category: 'Combat',
      year_published: 2023,
      publisher: 'Combat Games Ltd.',
      designer: 'Sarah Designer',
      bgg_rating: 7.2,
      weight: 2.8,
      age_min: 12,
      players: '3-6',
      game_type: 'competitive' as const,
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: true,
      has_expansion: true,
      has_characters: true,
      expansions: [
        {
          id: 67890,
          name: 'Battle Arena: New Warriors',
          year_published: 2024
        }
      ],
      characters: [
        {
          id: 'warrior',
          name: 'Warrior',
          description: 'Fierce melee fighter',
          abilities: ['Heavy Attack', 'Shield Block', 'Intimidate']
        },
        {
          id: 'archer',
          name: 'Archer',
          description: 'Precise ranged combatant',
          abilities: ['Long Shot', 'Multi-Shot', 'Eagle Eye']
        }
      ],
      bgg_id: 23456
    },
    {
      game_id: 3,
      name: 'Mind Games',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
      min_players: 2,
      max_players: 8,
      description: 'Psychological warfare meets board game mechanics.',
      duration: '30-45 min',
      difficulty: 'Beginner',
      category: 'Party',
      year_published: 2021,
      publisher: 'Mind Works',
      designer: 'Alex Mindmaker',
      bgg_rating: 6.9,
      weight: 1.5,
      age_min: 10,
      players: '2-8',
      game_type: 'competitive' as const,
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: false,
      has_expansion: false,
      has_characters: false,
      expansions: [],
      characters: [],
      bgg_id: 34567
    },
    {
      game_id: 4,
      name: 'Cosmic Empire',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop',
      min_players: 2,
      max_players: 5,
      description: 'Build your galactic empire across the stars.',
      duration: '90-120 min',
      difficulty: 'Expert',
      category: 'Strategy',
      year_published: 2020,
      publisher: 'Cosmic Games',
      designer: 'Maria Cosmos',
      bgg_rating: 8.1,
      weight: 4.2,
      age_min: 16,
      players: '2-5',
      game_type: 'competitive' as const,
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: true,
      has_expansion: true,
      has_characters: true,
      expansions: [
        {
          id: 45678,
          name: 'Cosmic Empire: Alien Worlds',
          year_published: 2021
        },
        {
          id: 45679,
          name: 'Cosmic Empire: Deep Space',
          year_published: 2022
        }
      ],
      characters: [
        {
          id: 'explorer',
          name: 'Explorer',
          description: 'Galactic scout and pioneer',
          abilities: ['System Discovery', 'Resource Scanning', 'Jump Drive']
        },
        {
          id: 'diplomat',
          name: 'Diplomat',
          description: 'Inter-species negotiator',
          abilities: ['Trade Agreements', 'Alliance Formation', 'Cultural Exchange']
        }
      ],
      bgg_id: 45678
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
  const [recentPlayers, setRecentPlayers] = useState<Player[]>([])
  const [recentGames, setRecentGames] = useState<Game[]>([])
  const [currentView, setCurrentView] = useState('dashboard')
  
  // Persistent data using useKV
  const [players, setPlayers] = useKV<Player[]>('board-game-players', [])
  const [games, setGames] = useKV<Game[]>('board-game-games', [])

  useEffect(() => {
    // Initialize with mock data if empty
    if (players && players.length === 0) {
      setPlayers(mockData.recentPlayers)
    }
    if (games && games.length === 0) {
      setGames(mockData.recentGames)
    }
    
    // Simulate loading data
    setTimeout(() => {
      setStats({
        playersCount: players?.length || 0,
        gamesCount: games?.length || 0,
        loading: false,
        error: null
      })
      setRecentPlayers(players?.slice(0, 3) || [])
      setRecentGames(games?.slice(0, 3) || [])
    }, 1000)
  }, [players, games, setPlayers, setGames])

  const handleNavigation = (view) => {
    setCurrentView(view)
  }

  const addPlayer = (playerData: any) => {
    const player: Player = {
      player_id: Date.now(),
      player_name: playerData.player_name,
      avatar: playerData.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
      stats: '0 pts',
      games_played: 0,
      wins: 0,
      total_score: 0,
      average_score: 0,
      created_at: new Date(),
      favorite_game: playerData.favorite_game || 'None',
      email: playerData.email || ''
    }
    setPlayers((currentPlayers) => [...(currentPlayers || []), player])
  }

  const updatePlayer = (playerId: number, playerData: any) => {
    setPlayers((currentPlayers) => 
      (currentPlayers || []).map(p => 
        p.player_id === playerId 
          ? { ...p, ...playerData, stats: `${playerData.total_score || p.total_score} pts` }
          : p
      )
    )
  }

  const addGame = (gameData: any) => {
    const game: Game = {
      game_id: Date.now(),
      ...gameData,
      players: `${gameData.min_players}-${gameData.max_players}`,
      expansions: gameData.expansions || [],
      characters: gameData.characters || []
    }
    setGames((currentGames) => [...(currentGames || []), game])
  }

  const updateGame = (gameId: number, gameData: any) => {
    setGames((currentGames) => 
      (currentGames || []).map(g => 
        g.game_id === gameId 
          ? { 
              ...g, 
              ...gameData, 
              players: `${gameData.min_players || g.min_players}-${gameData.max_players || g.max_players}`,
              expansions: gameData.expansions || g.expansions || [],
              characters: gameData.characters || g.characters || []
            }
          : g
      )
    )
  }

  const deletePlayer = (playerId: number) => {
    setPlayers((currentPlayers) => (currentPlayers || []).filter(p => p.player_id !== playerId))
  }

  const deleteGame = (gameId: number) => {
    setGames((currentGames) => (currentGames || []).filter(g => g.game_id !== gameId))
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
        players={players || []}
        onNavigation={handleNavigation}
        onAddPlayer={addPlayer}
        onUpdatePlayer={updatePlayer}
        onDeletePlayer={deletePlayer}
        currentView={currentView}
      />
    )
  }
  
  if (currentView === 'games') {
    return (
      <GamesPage 
        games={games || []}
        onNavigation={handleNavigation}
        onAddGame={addGame}
        onUpdateGame={updateGame}
        onDeleteGame={deleteGame}
        currentView={currentView}
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