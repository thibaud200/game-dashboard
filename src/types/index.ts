// Database-aligned interfaces
export interface Player {
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

export interface Game {
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

export interface GameExpansion {
  expansion_id?: number
  game_id?: number
  bgg_expansion_id?: number
  name: string
  year_published?: number
  description?: string
}

export interface GameCharacter {
  character_id?: number
  game_id?: number
  character_key: string
  name: string
  description?: string
  avatar?: string // Fixed: This field was missing from table Game_Characters
  abilities?: string[] // Will be stored as JSON in database
}

export interface GameSession {
  session_id: number
  game_id: number
  session_date: Date
  duration_minutes?: number
  winner_player_id?: number
  session_type: 'competitive' | 'cooperative' | 'campaign' | 'hybrid'
  notes?: string
  created_at: Date
}

export interface SessionPlayer {
  session_player_id?: number
  session_id: number
  player_id: number
  character_id?: number
  score: number
  placement?: number
  is_winner: boolean
  notes?: string
}