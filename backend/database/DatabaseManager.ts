import Database = require('better-sqlite3');
import * as path from 'path';
import * as fs from 'fs';
import {
  Player,
  Game,
  GameExpansion,
  GameCharacter,
  GameSession,
  SessionPlayer
} from '../models/interfaces';

// In Node.js CommonJS, __dirname is available globally
// Database configuration
const DB_PATH = path.join(__dirname, 'board_game_score.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

class DatabaseManager {
  private db: Database.Database;

  constructor() {
    // Initialize database
    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    
    this.initializeDatabase();
  }

  private initializeDatabase() {
    try {
      // Check if database has tables
      const tables = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
      
      if (tables.length === 0) {
        // Database initialization
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
        this.db.exec(schema);
      }
    } catch (error) {
      throw new Error(`Error initializing database: ${error}`);
    }
  }

  // Player operations
  getAllPlayers() {
    return this.db.prepare('SELECT * FROM players ORDER BY player_name').all();
  }

  getPlayerById(playerId: number) {
    return this.db.prepare('SELECT * FROM players WHERE player_id = ?').get(playerId);
  }

  createPlayer(playerData: any) {
    const stmt = this.db.prepare(`
      INSERT INTO players (player_name, avatar, favorite_game)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(
      playerData.player_name,
      playerData.avatar || null,
      playerData.favorite_game || null
    );
    return { player_id: result.lastInsertRowid, ...playerData };
  }

  updatePlayer(playerId: number, playerData: any) {
    const stmt = this.db.prepare(`
      UPDATE players 
      SET player_name = ?, avatar = ?, favorite_game = ?, 
          games_played = ?, wins = ?, total_score = ?, average_score = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE player_id = ?
    `);
    stmt.run(
      playerData.player_name,
      playerData.avatar || null,
      playerData.favorite_game || null,
      playerData.games_played || 0,
      playerData.wins || 0,
      playerData.total_score || 0,
      playerData.average_score || 0,
      playerId
    );
    return this.getPlayerById(playerId);
  }

  deletePlayer(playerId: number) {
    const stmt = this.db.prepare('DELETE FROM players WHERE player_id = ?');
    return stmt.run(playerId);
  }

  /**
   * Get all games with optimized loading to avoid N+1 queries
   * Uses has_expansion and has_characters booleans to load only necessary data
   */
  getAllGamesFullyOptimized(): Game[] {
    // 1. Get all games in one query
    const games = this.db.prepare('SELECT * FROM games ORDER BY name').all() as Game[];
    
    if (games.length === 0) return [];
    
    // 2. Separate games that need expansions/characters
    const gamesWithExpansions = games.filter(game => game.has_expansion);
    const gamesWithCharacters = games.filter(game => game.has_characters);
    
    // 3. Batch load expansions only for games that have them
    const expansionMap = gamesWithExpansions.length > 0 
      ? this.batchLoadExpansions(gamesWithExpansions.map(g => g.game_id))
      : new Map();
    
    // 4. Batch load characters only for games that have them
    const characterMap = gamesWithCharacters.length > 0
      ? this.batchLoadCharacters(gamesWithCharacters.map(g => g.game_id))
      : new Map();
    
    // 5. Combine everything efficiently
    return games.map(game => ({
      ...game,
      expansions: game.has_expansion ? (expansionMap.get(game.game_id) || []) : [],
      characters: game.has_characters ? (characterMap.get(game.game_id) || []) : []
    }));
  }

  // Game operations
  getAllGames(): Game[] {
    const stmt = this.db.prepare('SELECT * FROM games');
    const rows = stmt.all() as Game[];
    
    return rows.map((game: Game) => ({
      ...game,
      expansions: this.getGameExpansions(game.game_id),
    }));
  }

  /**
   * Get game by ID with optimized loading - only queries extensions/characters if needed
   */
  getGameByIdFullyOptimized(gameId: number): Game | null {
    const game = this.db.prepare('SELECT * FROM games WHERE game_id = ?').get(gameId) as Game;
    if (!game) return null;
    
    return {
      ...game,
      expansions: game.has_expansion ? this.getGameExpansions(gameId) : [],
      characters: game.has_characters ? this.getGameCharacters(gameId) : []
    };
  }

  getGameById(gameId: number): Game | null {
    const game = this.db.prepare('SELECT * FROM games WHERE game_id = ?').get(gameId) as Game;
    if (!game) return null;
    
    return {
      ...game,
      expansions: this.getGameExpansions(gameId),
      characters: this.getGameCharacters(gameId)
    };
  }

  createGame(gameData: any) {
    const transaction = this.db.transaction(() => {
      // Insert main game record
      const gameStmt = this.db.prepare(`
        INSERT INTO games (
          bgg_id, name, description, image, min_players, max_players,
          duration, difficulty, category, year_published, publisher, designer,
          bgg_rating, weight, age_min, game_type, supports_cooperative,
          supports_competitive, supports_campaign, has_expansion, has_characters
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = gameStmt.run(
        gameData.bgg_id || null,
        gameData.name,
        gameData.description || null,
        gameData.image || null,
        gameData.min_players,
        gameData.max_players,
        gameData.duration || null,
        gameData.difficulty || null,
        gameData.category || null,
        gameData.year_published || null,
        gameData.publisher || null,
        gameData.designer || null,
        gameData.bgg_rating || null,
        gameData.weight || null,
        gameData.age_min || null,
        gameData.game_type || 'competitive',
        gameData.supports_cooperative || false,
        gameData.supports_competitive || false,
        gameData.supports_campaign || false,
        gameData.has_expansion || false,
        gameData.has_characters || false
      );
      
      const gameId = result.lastInsertRowid as number;
      
      // Insert expansions if any
      if (gameData.expansions && gameData.expansions.length > 0) {
        const expansionStmt = this.db.prepare(`
          INSERT INTO game_expansions (game_id, bgg_expansion_id, name, year_published, description)
          VALUES (?, ?, ?, ?, ?)
        `);
        
        gameData.expansions.forEach((expansion: any) => {
          expansionStmt.run(
            gameId,
            expansion.bgg_expansion_id || null,
            expansion.name,
            expansion.year_published || null,
            expansion.description || null
          );
        });
      }
      
      // Insert characters if any
      if (gameData.characters && gameData.characters.length > 0) {
        const characterStmt = this.db.prepare(`
          INSERT INTO game_characters (game_id, character_key, name, description, avatar, abilities)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        gameData.characters.forEach((character: any) => {
          characterStmt.run(
            gameId,
            character.character_key,
            character.name,
            character.description || null,
            character.avatar || null,
            JSON.stringify(character.abilities || [])
          );
        });
      }
      
      return gameId;
    });
    
    const gameId = transaction();
    return this.getGameById(gameId);
  }

  updateGame(gameId: number, gameData: any) {
    const transaction = this.db.transaction(() => {
      // Update main game record
      const gameStmt = this.db.prepare(`
        UPDATE games SET
          bgg_id = ?, name = ?, description = ?, image = ?, min_players = ?, max_players = ?,
          duration = ?, difficulty = ?, category = ?, year_published = ?, publisher = ?, designer = ?,
          bgg_rating = ?, weight = ?, age_min = ?, game_type = ?, supports_cooperative = ?,
          supports_competitive = ?, supports_campaign = ?, has_expansion = ?, has_characters = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE game_id = ?
      `);
      
      gameStmt.run(
        gameData.bgg_id || null,
        gameData.name,
        gameData.description || null,
        gameData.image || null,
        gameData.min_players,
        gameData.max_players,
        gameData.duration || null,
        gameData.difficulty || null,
        gameData.category || null,
        gameData.year_published || null,
        gameData.publisher || null,
        gameData.designer || null,
        gameData.bgg_rating || null,
        gameData.weight || null,
        gameData.age_min || null,
        gameData.game_type || 'competitive',
        gameData.supports_cooperative || false,
        gameData.supports_competitive || false,
        gameData.supports_campaign || false,
        gameData.has_expansion || false,
        gameData.has_characters || false,
        gameId
      );
      
      // Delete existing expansions and characters
      this.db.prepare('DELETE FROM game_expansions WHERE game_id = ?').run(gameId);
      this.db.prepare('DELETE FROM game_characters WHERE game_id = ?').run(gameId);
      
      // Insert new expansions
      if (gameData.expansions && gameData.expansions.length > 0) {
        const expansionStmt = this.db.prepare(`
          INSERT INTO game_expansions (game_id, bgg_expansion_id, name, year_published, description)
          VALUES (?, ?, ?, ?, ?)
        `);
        
        gameData.expansions.forEach((expansion: any) => {
          expansionStmt.run(
            gameId,
            expansion.bgg_expansion_id || null,
            expansion.name,
            expansion.year_published || null,
            expansion.description || null
          );
        });
      }
      
      // Insert new characters
      if (gameData.characters && gameData.characters.length > 0) {
        const characterStmt = this.db.prepare(`
          INSERT INTO game_characters (game_id, character_key, name, description, avatar, abilities)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        gameData.characters.forEach((character: any) => {
          characterStmt.run(
            gameId,
            character.character_key,
            character.name,
            character.description || null,
            character.avatar || null,
            JSON.stringify(character.abilities || [])
          );
        });
      }
    });
    
    transaction();
    return this.getGameById(gameId);
  }

  deleteGame(gameId: number) {
    const stmt = this.db.prepare('DELETE FROM games WHERE game_id = ?');
    return stmt.run(gameId);
  }

  /**
   * Batch load extensions for multiple games to avoid N+1 queries
   * Only loads extensions for games that have has_expansion = true
   */
  private batchLoadExpansions(gameIds: number[]): Map<number, GameExpansion[]> {
    if (gameIds.length === 0) return new Map();
    
    const placeholders = gameIds.map(() => '?').join(',');
    const expansions = this.db.prepare(`
      SELECT * FROM game_expansions 
      WHERE game_id IN (${placeholders})
      ORDER BY game_id, name
    `).all(...gameIds) as (GameExpansion & { game_id: number })[];
    
    const expansionMap = new Map<number, GameExpansion[]>();
    
    // Initialize empty arrays for all game IDs
    gameIds.forEach(id => expansionMap.set(id, []));
    
    // Group expansions by game_id
    expansions.forEach(expansion => {
      const gameExpansions = expansionMap.get(expansion.game_id) || [];
      gameExpansions.push(expansion);
      expansionMap.set(expansion.game_id, gameExpansions);
    });
    
    return expansionMap;
  }

  /**
   * Batch load characters for multiple games to avoid N+1 queries
   * Only loads characters for games that have has_characters = true
   */
  private batchLoadCharacters(gameIds: number[]): Map<number, GameCharacter[]> {
    if (gameIds.length === 0) return new Map();
    
    const placeholders = gameIds.map(() => '?').join(',');
    const characters = this.db.prepare(`
      SELECT * FROM game_characters 
      WHERE game_id IN (${placeholders})
      ORDER BY game_id, character_key
    `).all(...gameIds) as (GameCharacter & { game_id: number })[];
    
    const characterMap = new Map<number, GameCharacter[]>();
    
    // Initialize empty arrays for all game IDs
    gameIds.forEach(id => characterMap.set(id, []));
    
    // Group characters by game_id and parse abilities JSON
    characters.forEach(character => {
      const gameCharacters = characterMap.get(character.game_id!) || [];
      gameCharacters.push({
        ...character,
        abilities: typeof character.abilities === 'string' 
          ? JSON.parse(character.abilities) 
          : character.abilities || []
      });
      characterMap.set(character.game_id!, gameCharacters);
    });
    
    return characterMap;
  }

  private getGameExpansions(gameId: number): GameExpansion[] {
    return this.db.prepare('SELECT * FROM game_expansions WHERE game_id = ?').all(gameId) as GameExpansion[];
  }

  private getGameCharacters(gameId: number): GameCharacter[] {
    const characters = this.db.prepare('SELECT * FROM game_characters WHERE game_id = ?').all(gameId) as any[];
    return characters.map((character: any) => ({
      ...character,
      abilities: character.abilities ? JSON.parse(character.abilities) : []
    }));
  }

  // Session operations
  createGameSession(sessionData: any) {
    const stmt = this.db.prepare(`
      INSERT INTO game_sessions (game_id, session_date, duration_minutes, winner_player_id, session_type, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      sessionData.game_id,
      sessionData.session_date || new Date().toISOString(),
      sessionData.duration_minutes || null,
      sessionData.winner_player_id || null,
      sessionData.session_type || 'competitive',
      sessionData.notes || null
    );
    return { session_id: result.lastInsertRowid, ...sessionData };
  }

  addSessionPlayer(sessionPlayerData: any) {
    const stmt = this.db.prepare(`
      INSERT INTO session_players (session_id, player_id, character_id, score, placement, is_winner, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      sessionPlayerData.session_id,
      sessionPlayerData.player_id,
      sessionPlayerData.character_id || null,
      sessionPlayerData.score || 0,
      sessionPlayerData.placement || null,
      sessionPlayerData.is_winner || false,
      sessionPlayerData.notes || null
    );
  }

  getGameSessions(gameId?: number): GameSession[] {
    const query = gameId 
      ? 'SELECT * FROM game_sessions WHERE game_id = ? ORDER BY session_date DESC'
      : 'SELECT * FROM game_sessions ORDER BY session_date DESC';
    
    const sessions = gameId 
      ? this.db.prepare(query).all(gameId) as any[]
      : this.db.prepare(query).all() as any[];
    
    return sessions.map((session: any) => ({
      ...session,
      players: this.getSessionPlayers(session.session_id)
    }));
  }

  private getSessionPlayers(sessionId: number): SessionPlayer[] {
    return this.db.prepare(`
      SELECT sp.*, p.player_name, gc.name as character_name
      FROM session_players sp
      JOIN players p ON sp.player_id = p.player_id
      LEFT JOIN game_characters gc ON sp.character_id = gc.character_id
      WHERE sp.session_id = ?
      ORDER BY sp.placement
    `).all(sessionId) as SessionPlayer[];
  }

  // Statistics
  getPlayerStats() {
    return this.db.prepare(`
      SELECT 
        COUNT(*) as total_players,
        SUM(games_played) as total_games_played,
        AVG(average_score) as overall_average_score
      FROM players
    `).get();
  }

  getGameStats() {
    return this.db.prepare(`
      SELECT 
        COUNT(*) as total_games,
        COUNT(*) FILTER (WHERE has_expansion = 1) as games_with_expansions,
        COUNT(*) FILTER (WHERE has_characters = 1) as games_with_characters,
        AVG(bgg_rating) as average_rating
      FROM games
    `).get();
  }

  // 🚀 OPTIMIZED METHODS USING SQL VIEWS
  
  /**
   * Get all players with calculated statistics from the player_statistics view
   * This replaces manual calculation with optimized SQL view
   */
  getAllPlayersOptimized() {
    return this.db.prepare(`
      SELECT 
        player_id,
        player_name,
        avatar,
        games_played,
        wins,
        total_score,
        average_score,
        win_percentage,
        favorite_game,
        created_at
      FROM player_statistics 
      ORDER BY player_name
    `).all();
  }

  /**
   * Get player by ID with calculated statistics from the player_statistics view
   */
  getPlayerByIdOptimized(playerId: number) {
    return this.db.prepare(`
      SELECT 
        player_id,
        player_name,
        avatar,
        games_played,
        wins,
        total_score,
        average_score,
        win_percentage,
        favorite_game,
        created_at
      FROM player_statistics 
      WHERE player_id = ?
    `).get(playerId);
  }

  /**
   * Get all games with statistics from game_statistics view - FULLY OPTIMIZED to avoid N+1
   * This replaces manual calculation with optimized SQL view AND eliminates N+1 queries
   */
  getAllGamesOptimized() {
    const games = this.db.prepare(`
      SELECT 
        g.game_id,
        g.name,
        g.image,
        g.min_players,
        g.max_players,
        g.difficulty,
        g.category,
        g.year_published,
        g.bgg_rating,
        g.has_expansion,
        g.has_characters,
        gs.times_played,
        gs.unique_players,
        gs.average_score,
        gs.average_duration,
        g.created_at
      FROM games g
      LEFT JOIN game_statistics gs ON g.game_id = gs.game_id
      ORDER BY g.name
    `).all() as (Game & { times_played: number, unique_players: number, average_score: number, average_duration: number })[];
    
    if (games.length === 0) return [];
    
    // 🚀 OPTIMIZED: Only load extensions/characters for games that actually have them
    const gamesWithExpansions = games.filter(game => game.has_expansion);
    const gamesWithCharacters = games.filter(game => game.has_characters);
    
    const expansionMap = gamesWithExpansions.length > 0 
      ? this.batchLoadExpansions(gamesWithExpansions.map(g => g.game_id))
      : new Map();
    
    const characterMap = gamesWithCharacters.length > 0
      ? this.batchLoadCharacters(gamesWithCharacters.map(g => g.game_id))
      : new Map();
    
    return games.map(game => ({
      ...game,
      expansions: game.has_expansion ? (expansionMap.get(game.game_id) || []) : [],
      characters: game.has_characters ? (characterMap.get(game.game_id) || []) : []
    }));
  }

  /**
   * Get game by ID with calculated statistics from the game_statistics view - FULLY OPTIMIZED
   */
  getGameByIdOptimized(gameId: number): Game | null {
    const game = this.db.prepare(`
      SELECT 
        g.game_id,
        g.name,
        g.image,
        g.min_players,
        g.max_players,
        g.difficulty,
        g.category,
        g.year_published,
        g.bgg_rating,
        g.has_expansion,
        g.has_characters,
        gs.times_played,
        gs.unique_players,
        gs.average_score,
        gs.average_duration,
        g.created_at
      FROM games g
      LEFT JOIN game_statistics gs ON g.game_id = gs.game_id
      WHERE g.game_id = ?
    `).get(gameId) as Game & { times_played: number, unique_players: number, average_score: number, average_duration: number };
    
    if (!game) return null;
    
    return {
      ...game,
      expansions: game.has_expansion ? this.getGameExpansions(gameId) : [],
      characters: game.has_characters ? this.getGameCharacters(gameId) : []
    };
  }

  /**
   * Get enhanced player statistics using the player_statistics view
   * This provides much richer data than the current getPlayerStats method
   */
  getPlayerStatsOptimized() {
    const totalStats = this.db.prepare(`
      SELECT 
        COUNT(*) as total_players,
        SUM(games_played) as total_games_played,
        AVG(average_score) as overall_average_score,
        AVG(win_percentage) as overall_win_percentage,
        MAX(games_played) as most_games_played,
        MIN(games_played) as least_games_played
      FROM player_statistics
    `).get() as any;

    const topPlayers = this.db.prepare(`
      SELECT 
        player_name,
        games_played,
        wins,
        win_percentage,
        average_score
      FROM player_statistics 
      WHERE games_played > 0
      ORDER BY win_percentage DESC, games_played DESC
      LIMIT 5
    `).all() as any[];

    return {
      ...totalStats,
      top_players: topPlayers
    };
  }

  /**
   * Get enhanced game statistics using the game_statistics view
   * This provides much richer data than the current getGameStats method
   */
  getGameStatsOptimized() {
    const totalStats = this.db.prepare(`
      SELECT 
        COUNT(*) as total_games,
        COUNT(CASE WHEN times_played > 0 THEN 1 END) as games_played,
        SUM(times_played) as total_sessions,
        AVG(average_score) as overall_average_score,
        AVG(bgg_rating) as average_bgg_rating,
        MAX(times_played) as most_played_count,
        AVG(average_duration) as average_session_duration
      FROM game_statistics
    `).get() as any;

    const popularGames = this.db.prepare(`
      SELECT 
        name,
        times_played,
        unique_players,
        average_score,
        bgg_rating
      FROM game_statistics 
      WHERE times_played > 0
      ORDER BY times_played DESC, unique_players DESC
      LIMIT 5
    `).all() as any[];

    const topRatedGames = this.db.prepare(`
      SELECT 
        name,
        bgg_rating,
        times_played,
        average_score
      FROM game_statistics 
      WHERE bgg_rating IS NOT NULL
      ORDER BY bgg_rating DESC
      LIMIT 5
    `).all() as any[];

    return {
      ...totalStats,
      popular_games: popularGames,
      top_rated_games: topRatedGames
    };
  }

  close() {
    this.db.close();
  }
}

export default DatabaseManager;