import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import Dashboard from '@/components/Dashboard'
import PlayersPage from '@/components/PlayersPage'
import GamesPage from '@/components/GamesPage'
import GameDetailPage from '@/components/GameDetailPage'
import GameExpansionsPage from '@/components/GameExpansionsPage'
import GameCharactersPage from '@/components/GameCharactersPage'
import PlayerStatsPage from '@/components/PlayerStatsPage'
import GameStatsPage from '@/components/GameStatsPage'
import SettingsPage from '@/components/SettingsPage'
import ApiService from '@/services/ApiService'

// Database-aligned interfaces

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
  supports_cooperative: boolean
  supports_competitive: boolean
  supports_campaign: boolean
  supports_hybrid: boolean // New field to replace game_type
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
  avatar?: string // Fixed: This field was missing from table Game_Characters
  abilities?: string[] // Will be stored as JSON in database
}

interface GameSession {
  session_id: number
  game_id: number
  session_date: Date
  duration_minutes?: number
  winner_player_id?: number
  session_type: 'competitive' | 'cooperative' | 'campaign' | 'hybrid'
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
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: true,
      supports_hybrid: false,
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
          avatar: 'https://images.unsplash.com/photo-1578632292335-fac9311c1dd4?w=100&h=100&fit=crop&crop=face',
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
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: true,
      supports_hybrid: false,
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
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          abilities: ['Heavy Attack', 'Shield Block', 'Intimidate']
        },
        {
          character_id: 3,
          game_id: 2,
          character_key: 'archer',
          name: 'Archer',
          description: 'Precise ranged combatant',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
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
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: false,
      supports_hybrid: false,
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
      supports_cooperative: false,
      supports_competitive: true,
      supports_campaign: true,
      supports_hybrid: false,
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
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          abilities: ['System Discovery', 'Resource Scanning', 'Jump Drive']
        },
        {
          character_id: 5,
          game_id: 4,
          character_key: 'diplomat',
          name: 'Diplomat',
          description: 'Inter-species negotiator',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
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
  const [currentGameId, setCurrentGameId] = useState<number | null>(null)
  const [navigationSource, setNavigationSource] = useState<string>('games') // Track where user came from
  const [apiConnected, setApiConnected] = useState(false)
  
  // Persistent data using useKV as fallback
  const [players, setPlayers] = useKV<Player[]>('board-game-players', [])
  const [games, setGames] = useKV<Game[]>('board-game-games', [])

  useEffect(() => {
    loadDataFromApi()
  }, [])

  const loadDataFromApi = async () => {
    try {
      // Try to connect to API first
      await ApiService.healthCheck()
      setApiConnected(true)
      
      // Load data from API
      const [apiPlayers, apiGames] = await Promise.all([
        ApiService.getAllPlayers(),
        ApiService.getAllGames()
      ])
      
      setStats({
        playersCount: apiPlayers.length,
        gamesCount: apiGames.length,
        loading: false,
        error: null
      })
      
      setRecentPlayers(apiPlayers.slice(0, 3))
      setRecentGames(apiGames.slice(0, 3))
      
      // Update local storage as backup
      setPlayers(apiPlayers)
      setGames(apiGames)
      
    } catch (error) {
      console.warn('API not available, using local storage:', error)
      setApiConnected(false)
      
      // Fall back to local storage
      if (players && players.length === 0) {
        setPlayers(mockData.recentPlayers)
      }
      if (games && games.length === 0) {
        setGames(mockData.recentGames)
      }
      
      setStats({
        playersCount: players?.length || 0,
        gamesCount: games?.length || 0,
        loading: false,
        error: null
      })
      setRecentPlayers(players?.slice(0, 3) || [])
      setRecentGames(games?.slice(0, 3) || [])
    }
  }

  const handleNavigation = (view: string, gameId?: number, source?: string) => {
    setCurrentView(view)
    if (gameId !== undefined) {
      setCurrentGameId(gameId)
    }
    
    // Track navigation source for contextual back navigation
    if (source) {
      // Explicit source provided - use it
      setNavigationSource(source)
    } else if (view === 'game-detail') {
      // Default source when viewing game detail is games
      setNavigationSource('games')
    } else if (view === 'game-expansions' || view === 'game-characters') {
      // For expansion/character pages, default to games unless coming from game-detail
      if (currentView === 'game-detail') {
        setNavigationSource('game-detail')
      } else {
        setNavigationSource('games')
      }
    } else {
      // For any other view, don't change navigation source
      // This preserves the current navigation context
    }
  }

  const addPlayer = async (playerData: any) => {
    try {
      if (apiConnected) {
        const newPlayer = await ApiService.createPlayer(playerData)
        await loadDataFromApi() // Refresh data
        return newPlayer
      } else {
        // Fallback to local storage
        const player: Player = {
          player_id: Date.now(),
          player_name: playerData.player_name,
          avatar: playerData.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
          games_played: playerData.games_played || 0,
          wins: playerData.wins || 0,
          total_score: playerData.total_score || 0,
          average_score: playerData.average_score || 0,
          favorite_game: playerData.favorite_game || '',
          created_at: playerData.created_at || new Date(),
          stats: `${playerData.total_score || 0} pts`
        }
        setPlayers((currentPlayers) => [...(currentPlayers || []), player])
        return player
      }
    } catch (error) {
      console.error('Error adding player:', error)
      throw error
    }
  }

  const updatePlayer = async (playerId: number, playerData: any) => {
    try {
      if (apiConnected) {
        const updatedPlayer = await ApiService.updatePlayer(playerId, playerData)
        await loadDataFromApi() // Refresh data
        return updatedPlayer
      } else {
        // Fallback to local storage
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
    } catch (error) {
      console.error('Error updating player:', error)
      throw error
    }
  }

  const addGame = async (gameData: any) => {
    try {
      if (apiConnected) {
        const newGame = await ApiService.createGame(gameData)
        await loadDataFromApi() // Refresh data
        return newGame
      } else {
        // Fallback to local storage
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
          supports_cooperative: gameData.supports_cooperative || false,
          supports_competitive: gameData.supports_competitive || false,
          supports_campaign: gameData.supports_campaign || false,
          supports_hybrid: gameData.supports_hybrid || false,
          has_expansion: gameData.has_expansion || false,
          has_characters: gameData.has_characters || false,
          created_at: gameData.created_at || new Date(),
          expansions: gameData.expansions || [],
          characters: gameData.characters || [],
          players: `${gameData.min_players}-${gameData.max_players}`
        }
        setGames((currentGames) => [...(currentGames || []), game])
        return game
      }
    } catch (error) {
      console.error('Error adding game:', error)
      throw error
    }
  }

  const updateGame = async (gameId: number, gameData: any) => {
    try {
      if (apiConnected) {
        const updatedGame = await ApiService.updateGame(gameId, gameData)
        await loadDataFromApi() // Refresh data
        return updatedGame
      } else {
        // Fallback to local storage
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
    } catch (error) {
      console.error('Error updating game:', error)
      throw error
    }
  }

  const deletePlayer = async (playerId: number) => {
    try {
      if (apiConnected) {
        await ApiService.deletePlayer(playerId)
        await loadDataFromApi() // Refresh data
      } else {
        // Fallback to local storage
        setPlayers((currentPlayers) => (currentPlayers || []).filter(p => p.player_id !== playerId))
      }
    } catch (error) {
      console.error('Error deleting player:', error)
      throw error
    }
  }

  const deleteGame = async (gameId: number) => {
    try {
      if (apiConnected) {
        await ApiService.deleteGame(gameId)
        await loadDataFromApi() // Refresh data
      } else {
        // Fallback to local storage
        setGames((currentGames) => (currentGames || []).filter(g => g.game_id !== gameId))
      }
    } catch (error) {
      console.error('Error deleting game:', error)
      throw error
    }
  }

  // Expansion management functions
  const addExpansion = async (gameId: number, expansionData: any) => {
    try {
      if (apiConnected) {
        const newExpansion = await ApiService.createExpansion({
          ...expansionData,
          game_id: gameId
        })
        await loadDataFromApi() // Refresh data
        return newExpansion
      } else {
        // Fallback to local storage
        const expansion: GameExpansion = {
          expansion_id: Date.now(),
          game_id: gameId,
          name: expansionData.name,
          year_published: expansionData.year_published,
          description: expansionData.description,
          bgg_expansion_id: expansionData.bgg_expansion_id
        }
        
        setGames((currentGames) => 
          (currentGames || []).map(g => 
            g.game_id === gameId 
              ? { ...g, expansions: [...(g.expansions || []), expansion] }
              : g
          )
        )
        return expansion
      }
    } catch (error) {
      console.error('Error adding expansion:', error)
      throw error
    }
  }

  const updateExpansion = async (expansionId: number, expansionData: any) => {
    try {
      if (apiConnected) {
        const updatedExpansion = await ApiService.updateExpansion(expansionId, expansionData)
        await loadDataFromApi() // Refresh data
        return updatedExpansion
      } else {
        // Fallback to local storage
        setGames((currentGames) => 
          (currentGames || []).map(g => ({
            ...g,
            expansions: (g.expansions || []).map(exp => 
              exp.expansion_id === expansionId 
                ? { ...exp, ...expansionData }
                : exp
            )
          }))
        )
      }
    } catch (error) {
      console.error('Error updating expansion:', error)
      throw error
    }
  }

  const deleteExpansion = async (expansionId: number) => {
    try {
      if (apiConnected) {
        await ApiService.deleteExpansion(expansionId)
        await loadDataFromApi() // Refresh data
      } else {
        // Fallback to local storage
        setGames((currentGames) => 
          (currentGames || []).map(g => ({
            ...g,
            expansions: (g.expansions || []).filter(exp => exp.expansion_id !== expansionId)
          }))
        )
      }
    } catch (error) {
      console.error('Error deleting expansion:', error)
      throw error
    }
  }

  // Character management functions
  const addCharacter = async (gameId: number, characterData: any) => {
    try {
      if (apiConnected) {
        const newCharacter = await ApiService.createCharacter({
          ...characterData,
          game_id: gameId
        })
        await loadDataFromApi() // Refresh data
        return newCharacter
      } else {
        // Fallback to local storage
        const character: GameCharacter = {
          character_id: Date.now(),
          game_id: gameId,
          character_key: characterData.character_key,
          name: characterData.name,
          description: characterData.description,
          avatar: characterData.avatar,
          abilities: characterData.abilities || []
        }
        
        setGames((currentGames) => 
          (currentGames || []).map(g => 
            g.game_id === gameId 
              ? { ...g, characters: [...(g.characters || []), character] }
              : g
          )
        )
        return character
      }
    } catch (error) {
      console.error('Error adding character:', error)
      throw error
    }
  }

  const updateCharacter = async (characterId: number, characterData: any) => {
    try {
      if (apiConnected) {
        const updatedCharacter = await ApiService.updateCharacter(characterId, characterData)
        await loadDataFromApi() // Refresh data
        return updatedCharacter
      } else {
        // Fallback to local storage
        setGames((currentGames) => 
          (currentGames || []).map(g => ({
            ...g,
            characters: (g.characters || []).map(char => 
              char.character_id === characterId 
                ? { ...char, ...characterData }
                : char
            )
          }))
        )
      }
    } catch (error) {
      console.error('Error updating character:', error)
      throw error
    }
  }

  const deleteCharacter = async (characterId: number) => {
    try {
      if (apiConnected) {
        await ApiService.deleteCharacter(characterId)
        await loadDataFromApi() // Refresh data
      } else {
        // Fallback to local storage
        setGames((currentGames) => 
          (currentGames || []).map(g => ({
            ...g,
            characters: (g.characters || []).filter(char => char.character_id !== characterId)
          }))
        )
      }
    } catch (error) {
      console.error('Error deleting character:', error)
      throw error
    }
  }

  if (stats.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-lg mb-2">Chargement du dashboard...</div>
          {!apiConnected && (
            <div className="text-white/60 text-sm">Mode hors-ligne activé</div>
          )}
        </div>
      </div>
    )
  }

  // Render different pages based on current view
  if (currentView === 'players') {
    return (
      <PlayersPage 
        players={apiConnected ? recentPlayers : (players || [])}
        onNavigation={handleNavigation}
        onAddPlayer={addPlayer}
        onUpdatePlayer={updatePlayer}
        onDeletePlayer={deletePlayer}
        currentView={currentView}
      />
    )
  }

  if (currentView === 'player-stats') {
    return (
      <PlayerStatsPage 
        players={apiConnected ? recentPlayers : (players || [])}
        games={apiConnected ? (games || []) : (games || [])}
        onNavigation={handleNavigation}
        currentView={currentView}
      />
    )
  }
  
  if (currentView === 'games') {
    return (
      <GamesPage 
        games={apiConnected ? (games || []) : (games || [])}
        onNavigation={handleNavigation}
        onAddGame={addGame}
        onUpdateGame={updateGame}
        onDeleteGame={deleteGame}
        onAddExpansion={addExpansion}
        onUpdateExpansion={updateExpansion}
        onDeleteExpansion={deleteExpansion}
        onAddCharacter={addCharacter}
        onUpdateCharacter={updateCharacter}
        onDeleteCharacter={deleteCharacter}
        currentView={currentView}
      />
    )
  }

  if (currentView === 'game-stats') {
    return (
      <GameStatsPage 
        games={apiConnected ? (games || []) : (games || [])}
        players={apiConnected ? recentPlayers : (players || [])}
        onNavigation={handleNavigation}
        currentView={currentView}
      />
    )
  }

  if (currentView === 'settings') {
    return (
      <SettingsPage 
        onNavigation={handleNavigation}
        currentView={currentView}
      />
    )
  }

  // Game Detail Page
  if (currentView === 'game-detail' && currentGameId) {
    const allGames = games || []
    const currentGame = allGames.find(g => g.game_id === currentGameId)
    if (!currentGame) {
      // Game not found, redirect to games page
      setCurrentView('games')
      return null
    }
    
    return (
      <GameDetailPage 
        game={currentGame}
        onNavigation={handleNavigation}
        currentView={currentView}
        navigationSource={navigationSource}
        onAddExpansion={addExpansion}
        onUpdateExpansion={updateExpansion}
        onDeleteExpansion={deleteExpansion}
        onAddCharacter={addCharacter}
        onUpdateCharacter={updateCharacter}
        onDeleteCharacter={deleteCharacter}
      />
    )
  }

  // Game Expansions Page
  if (currentView === 'game-expansions' && currentGameId) {
    const allGames = games || []
    const currentGame = allGames.find(g => g.game_id === currentGameId)
    if (!currentGame) {
      // Game not found, redirect to games page
      setCurrentView('games')
      return null
    }
    
    return (
      <GameExpansionsPage 
        game={currentGame}
        onNavigation={handleNavigation}
        navigationSource={navigationSource}
        onAddExpansion={addExpansion}
        onUpdateExpansion={updateExpansion}
        onDeleteExpansion={deleteExpansion}
      />
    )
  }

  // Game Characters Page
  if (currentView === 'game-characters' && currentGameId) {
    const allGames = games || []
    const currentGame = allGames.find(g => g.game_id === currentGameId)
    if (!currentGame) {
      // Game not found, redirect to games page
      setCurrentView('games')
      return null
    }
    
    return (
      <GameCharactersPage 
        game={currentGame}
        onNavigation={handleNavigation}
        navigationSource={navigationSource}
        onAddCharacter={addCharacter}
        onUpdateCharacter={updateCharacter}
        onDeleteCharacter={deleteCharacter}
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