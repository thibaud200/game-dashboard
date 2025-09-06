import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import Dashboard from '@/components/Dashboard'
import PlayersPage from '@/components/PlayersPage'
import GamesPage from '@/components/GamesPage'

// Database-aligned interfaces

interface Player {
  player_id: number
  player_name: string
  email?: string
  avatar?: string
  games_played: number
  wins: number
  total_score: number
  average_score: number
  favorite_game?: string
  created_at: Date
  updated_at?: Date
  // Calculated field for display
  stats?: string
}

interface Game {
  game_id: number
  bgg_id?: number
  name: string
  description?: string
  image?: string
  min_players: number
  max_players: number
  duration?: string
  difficulty?: string
  category?: string
  year_published?: number
  publisher?: string
  designer?: string
  bgg_rating?: number
  weight?: number
  age_min?: number
  game_type: 'competitive' | 'cooperative' | 'campaign' | 'hybrid'
  supports_cooperative: boolean
  supports_competitive: boolean
  supports_campaign: boolean
  has_expansion: boolean
  has_characters: boolean
  created_at: Date
  updated_at?: Date
  // Related data
  expansions: GameExpansion[]
  characters: GameCharacter[]
  // Calculated field for display
  players?: string
}

interface GameExpansion {
  expansion_id?: number
  game_id?: number
  bgg_expansion_id?: number
  name: string
  year_published?: number
  description?: string
}

interface GameCharacter {
  character_id?: number
  game_id?: number
  character_key: string
  name: string
  description?: string
  abilities?: string[] // Will be stored as JSON in database
}

interface GameSession {
  session_id: number
  game_id: number
  session_date: Date
  duration_minutes?: number
  winner_player_id?: number
  session_type: 'competitive' | 'cooperative' | 'campaign'
  notes?: string
  created_at: Date
}

interface SessionPlayer {
  session_player_id?: number
  session_id: number
  player_id: number
  character_id?: number
  score: number
  placement?: number
  is_winner: boolean
  notes?: string
}

// Mock data aligned with database structure
const mockData = {
  playersCount: 12,
  gamesCount: 8,
  recentPlayers: [
    {
      player_id: 1,
      player_name: 'Jane',
      email: 'jane@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      games_played: 45,
      wins: 28,
      total_score: 2100,
      average_score: 46.7,
      favorite_game: 'Strategy Pro',
      created_at: new Date('2024-01-15'),
      stats: '2,100 pts'
    },
    {
      player_id: 2,
      player_name: 'Nexus',
      email: 'nexus@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      games_played: 38,
      wins: 19,
      total_score: 1850,
      average_score: 48.7,
      favorite_game: 'Battle Arena',
      created_at: new Date('2024-02-02'),
      stats: '1,850 pts'
    },
    {
      player_id: 3,
      player_name: 'Maya',
      email: 'maya@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      games_played: 32,
      wins: 15,
      total_score: 1620,
      average_score: 50.6,
      favorite_game: 'Mind Games',
      created_at: new Date('2024-01-28'),
      stats: '1,620 pts'
    },
    {
      player_id: 4,
      player_name: 'Alex',
      email: 'alex@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      games_played: 28,
      wins: 12,
      total_score: 1420,
      average_score: 50.7,
      favorite_game: 'Strategy Pro',
      created_at: new Date('2024-02-10'),
      stats: '1,420 pts'
    }
  ],
  recentGames: [
    {
      game_id: 1,
      bgg_id: 12345,
      name: 'Strategy Pro',
      description: 'A complex strategy game that challenges your tactical thinking.',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
      min_players: 2,
      max_players: 4,
      duration: '60-90 min',
      difficulty: 'Expert',
      category: 'Strategy',
      year_published: 2022,
      publisher: 'Strategy Games Inc.',
      designer: 'John Designer',
      bgg_rating: 7.8,
      weight: 3.5,
      age_min: 14,
      game_type: 'competitive' as const,
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: true,
      has_expansion: false,
      has_characters: true,
      created_at: new Date('2024-01-01'),
      expansions: [],
      characters: [
        {
          character_id: 1,
          game_id: 1,
          character_key: 'commander',
          name: 'Commander',
          description: 'Strategic military leader',
          abilities: ['Battle Tactics', 'Resource Management', 'Unit Command']
        }
      ],
      players: '2-4'
    },
    {
      game_id: 2,
      bgg_id: 23456,
      name: 'Battle Arena',
      description: 'Fast-paced combat game with multiple character classes.',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop',
      min_players: 3,
      max_players: 6,
      duration: '45-60 min',
      difficulty: 'Intermediate',
      category: 'Combat',
      year_published: 2023,
      publisher: 'Combat Games Ltd.',
      designer: 'Sarah Designer',
      bgg_rating: 7.2,
      weight: 2.8,
      age_min: 12,
      game_type: 'competitive' as const,
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: true,
      has_expansion: true,
      has_characters: true,
      created_at: new Date('2024-01-15'),
      expansions: [
        {
          expansion_id: 1,
          game_id: 2,
          bgg_expansion_id: 67890,
          name: 'Battle Arena: New Warriors',
          year_published: 2024
        }
      ],
      characters: [
        {
          character_id: 2,
          game_id: 2,
          character_key: 'warrior',
          name: 'Warrior',
          description: 'Fierce melee fighter',
          abilities: ['Heavy Attack', 'Shield Block', 'Intimidate']
        },
        {
          character_id: 3,
          game_id: 2,
          character_key: 'archer',
          name: 'Archer',
          description: 'Precise ranged combatant',
          abilities: ['Long Shot', 'Multi-Shot', 'Eagle Eye']
        }
      ],
      players: '3-6'
    },
    {
      game_id: 3,
      bgg_id: 34567,
      name: 'Mind Games',
      description: 'Psychological warfare meets board game mechanics.',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
      min_players: 2,
      max_players: 8,
      duration: '30-45 min',
      difficulty: 'Beginner',
      category: 'Party',
      year_published: 2021,
      publisher: 'Mind Works',
      designer: 'Alex Mindmaker',
      bgg_rating: 6.9,
      weight: 1.5,
      age_min: 10,
      game_type: 'competitive' as const,
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: false,
      has_expansion: false,
      has_characters: false,
      created_at: new Date('2024-02-01'),
      expansions: [],
      characters: [],
      players: '2-8'
    },
    {
      game_id: 4,
      bgg_id: 45678,
      name: 'Cosmic Empire',
      description: 'Build your galactic empire across the stars.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop',
      min_players: 2,
      max_players: 5,
      duration: '90-120 min',
      difficulty: 'Expert',
      category: 'Strategy',
      year_published: 2020,
      publisher: 'Cosmic Games',
      designer: 'Maria Cosmos',
      bgg_rating: 8.1,
      weight: 4.2,
      age_min: 16,
      game_type: 'competitive' as const,
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: true,
      has_expansion: true,
      has_characters: true,
      created_at: new Date('2024-01-20'),
      expansions: [
        {
          expansion_id: 2,
          game_id: 4,
          bgg_expansion_id: 45678,
          name: 'Cosmic Empire: Alien Worlds',
          year_published: 2021
        },
        {
          expansion_id: 3,
          game_id: 4,
          bgg_expansion_id: 45679,
          name: 'Cosmic Empire: Deep Space',
          year_published: 2022
        }
      ],
      characters: [
        {
          character_id: 4,
          game_id: 4,
          character_key: 'explorer',
          name: 'Explorer',
          description: 'Galactic scout and pioneer',
          abilities: ['System Discovery', 'Resource Scanning', 'Jump Drive']
        },
        {
          character_id: 5,
          game_id: 4,
          character_key: 'diplomat',
          name: 'Diplomat',
          description: 'Inter-species negotiator',
          abilities: ['Trade Agreements', 'Alliance Formation', 'Cultural Exchange']
        }
      ],
      players: '2-5'
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
      email: playerData.email || '',
      avatar: playerData.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
      games_played: 0,
      wins: 0,
      total_score: 0,
      average_score: 0,
      favorite_game: playerData.favorite_game || '',
      created_at: new Date(),
      stats: '0 pts'
    }
    setPlayers((currentPlayers) => [...(currentPlayers || []), player])
  }

  const updatePlayer = (playerId: number, playerData: any) => {
    setPlayers((currentPlayers) => 
      (currentPlayers || []).map(p => 
        p.player_id === playerId 
          ? { 
              ...p, 
              ...playerData, 
              updated_at: new Date(),
              stats: `${playerData.total_score || p.total_score} pts` 
            }
          : p
      )
    )
  }

  const addGame = (gameData: any) => {
    const game: Game = {
      game_id: Date.now(),
      bgg_id: gameData.bgg_id,
      name: gameData.name,
      description: gameData.description || '',
      image: gameData.image || '',
      min_players: gameData.min_players,
      max_players: gameData.max_players,
      duration: gameData.duration || '',
      difficulty: gameData.difficulty || '',
      category: gameData.category || '',
      year_published: gameData.year_published,
      publisher: gameData.publisher || '',
      designer: gameData.designer || '',
      bgg_rating: gameData.bgg_rating,
      weight: gameData.weight,
      age_min: gameData.age_min,
      game_type: gameData.game_type || 'competitive',
      supports_cooperative: gameData.supports_cooperative || false,
      supports_competitive: gameData.supports_competitive || false,
      supports_campaign: gameData.supports_campaign || false,
      has_expansion: gameData.has_expansion || false,
      has_characters: gameData.has_characters || false,
      created_at: new Date(),
      expansions: gameData.expansions || [],
      characters: gameData.characters || [],
      players: `${gameData.min_players}-${gameData.max_players}`
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
              updated_at: new Date(),
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