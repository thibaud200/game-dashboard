-- Board Game Score Tracker Database Schema
-- SQLite Database Schema

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- =====================================================
-- TABLES
-- =====================================================

-- 1. Players Table
-- Stores information about individual players in the system
CREATE TABLE players (
    player_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    avatar TEXT, -- URL to avatar image
    games_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.0,
    favorite_game VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Games Table
-- Stores comprehensive information about board games
CREATE TABLE games (
    game_id INTEGER PRIMARY KEY AUTOINCREMENT,
    bgg_id INTEGER UNIQUE, -- BoardGameGeek ID
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT, -- URL to game image
    min_players INTEGER NOT NULL,
    max_players INTEGER NOT NULL,
    duration VARCHAR(50), -- e.g., "60-90 min"
    difficulty VARCHAR(50), -- Beginner, Intermediate, Expert
    category VARCHAR(100),
    year_published INTEGER,
    publisher VARCHAR(255),
    designer VARCHAR(255),
    bgg_rating DECIMAL(3,1), -- BGG rating (0.0-10.0)
    weight DECIMAL(3,1), -- BGG complexity weight (1.0-5.0)
    age_min INTEGER,
    game_type VARCHAR(20) CHECK (game_type IN ('competitive', 'cooperative', 'campaign', 'hybrid')),
    supports_cooperative BOOLEAN DEFAULT FALSE,
    supports_competitive BOOLEAN DEFAULT FALSE,
    supports_campaign BOOLEAN DEFAULT FALSE,
    has_expansion BOOLEAN DEFAULT FALSE,
    has_characters BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Game Expansions Table
-- Stores information about game expansions
CREATE TABLE game_expansions (
    expansion_id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    bgg_expansion_id INTEGER,
    name VARCHAR(255) NOT NULL,
    year_published INTEGER,
    description TEXT,
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);

-- 4. Game Characters Table
-- Stores information about character roles/classes available in games
CREATE TABLE game_characters (
    character_id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    character_key VARCHAR(100) NOT NULL, -- unique identifier for the character
    name VARCHAR(255) NOT NULL,
    description TEXT,
    abilities TEXT, -- JSON array of abilities
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);

-- 5. Game Sessions Table
-- Stores information about individual game sessions/matches
CREATE TABLE game_sessions (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INTEGER,
    winner_player_id INTEGER,
    session_type VARCHAR(20) CHECK (session_type IN ('competitive', 'cooperative', 'campaign')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE,
    FOREIGN KEY (winner_player_id) REFERENCES players(player_id) ON DELETE SET NULL
);

-- 6. Session Players Table
-- Links players to game sessions with their scores and performance
CREATE TABLE session_players (
    session_player_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    character_id INTEGER, -- Character/role played (if applicable)
    score INTEGER DEFAULT 0,
    placement INTEGER, -- Final ranking/placement in the game
    is_winner BOOLEAN DEFAULT FALSE,
    notes TEXT,
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES game_characters(character_id) ON DELETE SET NULL
);

-- =====================================================
-- VIEWS
-- =====================================================

-- 7. Player Statistics View
-- A view that calculates player statistics dynamically
CREATE VIEW player_statistics AS
SELECT 
    p.player_id,
    p.player_name,
    p.email,
    p.avatar,
    COUNT(DISTINCT sp.session_id) as games_played,
    COUNT(CASE WHEN sp.is_winner = TRUE THEN 1 END) as wins,
    COALESCE(SUM(sp.score), 0) as total_score,
    COALESCE(AVG(sp.score), 0) as average_score,
    (COUNT(CASE WHEN sp.is_winner = TRUE THEN 1 END) * 100.0 / 
     NULLIF(COUNT(DISTINCT sp.session_id), 0)) as win_percentage,
    p.favorite_game,
    p.created_at
FROM players p
LEFT JOIN session_players sp ON p.player_id = sp.player_id
GROUP BY p.player_id, p.player_name, p.email, p.avatar, p.favorite_game, p.created_at;

-- 8. Game Statistics View
-- A view that calculates game statistics dynamically
CREATE VIEW game_statistics AS
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
    COUNT(DISTINCT gs.session_id) as times_played,
    COUNT(DISTINCT sp.player_id) as unique_players,
    AVG(sp.score) as average_score,
    AVG(gs.duration_minutes) as average_duration,
    g.created_at
FROM games g
LEFT JOIN game_sessions gs ON g.game_id = gs.game_id
LEFT JOIN session_players sp ON gs.session_id = sp.session_id
GROUP BY g.game_id, g.name, g.image, g.min_players, g.max_players, 
         g.difficulty, g.category, g.year_published, g.bgg_rating, g.created_at;

-- =====================================================
-- INDEXES
-- =====================================================

-- Performance indexes
CREATE INDEX idx_players_email ON players(email);
CREATE INDEX idx_games_bgg_id ON games(bgg_id);
CREATE INDEX idx_sessions_date ON game_sessions(session_date);
CREATE INDEX idx_sessions_game ON game_sessions(game_id);
CREATE INDEX idx_session_players_session ON session_players(session_id);
CREATE INDEX idx_session_players_player ON session_players(player_id);
CREATE INDEX idx_expansions_game ON game_expansions(game_id);
CREATE INDEX idx_characters_game ON game_characters(game_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update player statistics when sessions are added/modified
CREATE TRIGGER update_player_stats_after_session_insert
AFTER INSERT ON session_players
BEGIN
    UPDATE players 
    SET 
        games_played = (
            SELECT COUNT(DISTINCT session_id) 
            FROM session_players 
            WHERE player_id = NEW.player_id
        ),
        wins = (
            SELECT COUNT(*) 
            FROM session_players 
            WHERE player_id = NEW.player_id AND is_winner = TRUE
        ),
        total_score = (
            SELECT COALESCE(SUM(score), 0) 
            FROM session_players 
            WHERE player_id = NEW.player_id
        ),
        average_score = (
            SELECT COALESCE(AVG(score), 0) 
            FROM session_players 
            WHERE player_id = NEW.player_id
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE player_id = NEW.player_id;
END;

-- Update player statistics when sessions are updated
CREATE TRIGGER update_player_stats_after_session_update
AFTER UPDATE ON session_players
BEGIN
    UPDATE players 
    SET 
        games_played = (
            SELECT COUNT(DISTINCT session_id) 
            FROM session_players 
            WHERE player_id = NEW.player_id
        ),
        wins = (
            SELECT COUNT(*) 
            FROM session_players 
            WHERE player_id = NEW.player_id AND is_winner = TRUE
        ),
        total_score = (
            SELECT COALESCE(SUM(score), 0) 
            FROM session_players 
            WHERE player_id = NEW.player_id
        ),
        average_score = (
            SELECT COALESCE(AVG(score), 0) 
            FROM session_players 
            WHERE player_id = NEW.player_id
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE player_id = NEW.player_id;
END;

-- Update player statistics when sessions are deleted
CREATE TRIGGER update_player_stats_after_session_delete
AFTER DELETE ON session_players
BEGIN
    UPDATE players 
    SET 
        games_played = (
            SELECT COUNT(DISTINCT session_id) 
            FROM session_players 
            WHERE player_id = OLD.player_id
        ),
        wins = (
            SELECT COUNT(*) 
            FROM session_players 
            WHERE player_id = OLD.player_id AND is_winner = TRUE
        ),
        total_score = (
            SELECT COALESCE(SUM(score), 0) 
            FROM session_players 
            WHERE player_id = OLD.player_id
        ),
        average_score = (
            SELECT COALESCE(AVG(score), 0) 
            FROM session_players 
            WHERE player_id = OLD.player_id
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE player_id = OLD.player_id;
END;

-- Update games updated_at timestamp
CREATE TRIGGER update_games_timestamp
AFTER UPDATE ON games
FOR EACH ROW
BEGIN
    UPDATE games SET updated_at = CURRENT_TIMESTAMP WHERE game_id = NEW.game_id;
END;

-- Update players updated_at timestamp
CREATE TRIGGER update_players_timestamp
AFTER UPDATE ON players
FOR EACH ROW
BEGIN
    UPDATE players SET updated_at = CURRENT_TIMESTAMP WHERE player_id = NEW.player_id;
END;