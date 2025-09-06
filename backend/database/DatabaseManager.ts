import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

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
        console.log('Initializing database with schema...');
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
        this.db.exec(schema);
        console.log('Database initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
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
      INSERT INTO players (player_name, email, avatar, favorite_game)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(
      playerData.player_name,
      playerData.email || null,
      playerData.avatar || null,
      playerData.favorite_game || null
    );
    return { player_id: result.lastInsertRowid, ...playerData };
  }

  updatePlayer(playerId: number, playerData: any) {
    const stmt = this.db.prepare(`
      UPDATE players 
      SET player_name = ?, email = ?, avatar = ?, favorite_game = ?, 
          games_played = ?, wins = ?, total_score = ?, average_score = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE player_id = ?
    `);
    stmt.run(
      playerData.player_name,
      playerData.email || null,
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

  // Game operations
  getAllGames() {
    const games = this.db.prepare('SELECT * FROM games ORDER BY name').all();
    
    // Get expansions and characters for each game
    return games.map(game => ({
      ...game,
      expansions: this.getGameExpansions(game.game_id),
      characters: this.getGameCharacters(game.game_id)
    }));
  }

  getGameById(gameId: number) {
    const game = this.db.prepare('SELECT * FROM games WHERE game_id = ?').get(gameId);
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
          INSERT INTO game_characters (game_id, character_key, name, description, abilities)
          VALUES (?, ?, ?, ?, ?)
        `);
        
        gameData.characters.forEach((character: any) => {
          characterStmt.run(
            gameId,
            character.character_key,
            character.name,
            character.description || null,
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
          INSERT INTO game_characters (game_id, character_key, name, description, abilities)
          VALUES (?, ?, ?, ?, ?)
        `);
        
        gameData.characters.forEach((character: any) => {
          characterStmt.run(
            gameId,
            character.character_key,
            character.name,
            character.description || null,
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

  private getGameExpansions(gameId: number) {
    return this.db.prepare('SELECT * FROM game_expansions WHERE game_id = ?').all(gameId);
  }

  private getGameCharacters(gameId: number) {
    const characters = this.db.prepare('SELECT * FROM game_characters WHERE game_id = ?').all(gameId);
    return characters.map(character => ({
      ...character,
      abilities: JSON.parse(character.abilities || '[]')
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

  getGameSessions(gameId?: number) {
    const query = gameId 
      ? 'SELECT * FROM game_sessions WHERE game_id = ? ORDER BY session_date DESC'
      : 'SELECT * FROM game_sessions ORDER BY session_date DESC';
    
    const sessions = gameId 
      ? this.db.prepare(query).all(gameId)
      : this.db.prepare(query).all();
    
    return sessions.map(session => ({
      ...session,
      players: this.getSessionPlayers(session.session_id)
    }));
  }

  private getSessionPlayers(sessionId: number) {
    return this.db.prepare(`
      SELECT sp.*, p.player_name, gc.name as character_name
      FROM session_players sp
      JOIN players p ON sp.player_id = p.player_id
      LEFT JOIN game_characters gc ON sp.character_id = gc.character_id
      WHERE sp.session_id = ?
      ORDER BY sp.placement
    `).all(sessionId);
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

  close() {
    this.db.close();
  }
}

export default DatabaseManager;