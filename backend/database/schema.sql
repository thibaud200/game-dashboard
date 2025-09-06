-- Board Game Score Database Schema
-- Based on database-structure.md from the repository

-- Players table
CREATE TABLE players (
    player_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    email TEXT UNIQUE,
    avatar TEXT,
    games_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    average_score REAL DEFAULT 0.0,
    favorite_game TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Games table
CREATE TABLE games (
    game_id INTEGER PRIMARY KEY AUTOINCREMENT,
    bgg_id INTEGER UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    min_players INTEGER NOT NULL,
    max_players INTEGER NOT NULL,
    duration TEXT,
    difficulty TEXT,
    category TEXT,
    year_published INTEGER,
    publisher TEXT,
    designer TEXT,
    bgg_rating REAL,
    weight REAL,
    age_min INTEGER,
    game_type TEXT CHECK(game_type IN ('competitive', 'cooperative', 'campaign', 'hybrid')) DEFAULT 'competitive',
    supports_cooperative BOOLEAN DEFAULT FALSE,
    supports_competitive BOOLEAN DEFAULT FALSE,
    supports_campaign BOOLEAN DEFAULT FALSE,
    has_expansion BOOLEAN DEFAULT FALSE,
    has_characters BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Game expansions table
CREATE TABLE game_expansions (
    expansion_id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    bgg_expansion_id INTEGER,
    name TEXT NOT NULL,
    year_published INTEGER,
    description TEXT,
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);

-- Game characters/roles table
CREATE TABLE game_characters (
    character_id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    character_key TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    abilities TEXT, -- JSON string of abilities array
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);

-- Game sessions table
CREATE TABLE game_sessions (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    session_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INTEGER,
    winner_player_id INTEGER,
    session_type TEXT CHECK(session_type IN ('competitive', 'cooperative', 'campaign')) DEFAULT 'competitive',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE,
    FOREIGN KEY (winner_player_id) REFERENCES players(player_id)
);

-- Session players (who played in each session)
CREATE TABLE session_players (
    session_player_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    character_id INTEGER,
    score INTEGER DEFAULT 0,
    placement INTEGER,
    is_winner BOOLEAN DEFAULT FALSE,
    notes TEXT,
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES game_characters(character_id)
);

-- Indexes for better performance
CREATE INDEX idx_players_email ON players(email);
CREATE INDEX idx_games_bgg_id ON games(bgg_id);
CREATE INDEX idx_game_expansions_game_id ON game_expansions(game_id);
CREATE INDEX idx_game_characters_game_id ON game_characters(game_id);
CREATE INDEX idx_game_sessions_game_id ON game_sessions(game_id);
CREATE INDEX idx_game_sessions_date ON game_sessions(session_date);
CREATE INDEX idx_session_players_session_id ON session_players(session_id);
CREATE INDEX idx_session_players_player_id ON session_players(player_id);

-- Triggers to update timestamps
CREATE TRIGGER update_players_timestamp 
    AFTER UPDATE ON players
    BEGIN
        UPDATE players SET updated_at = CURRENT_TIMESTAMP WHERE player_id = NEW.player_id;
    END;

CREATE TRIGGER update_games_timestamp 
    AFTER UPDATE ON games
    BEGIN
        UPDATE games SET updated_at = CURRENT_TIMESTAMP WHERE game_id = NEW.game_id;
    END;

-- Sample data insertion
INSERT INTO players (player_name, email, avatar, games_played, wins, total_score, average_score, favorite_game) VALUES
('Jane', 'jane@example.com', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', 45, 28, 2100, 46.7, 'Strategy Pro'),
('Nexus', 'nexus@example.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', 38, 19, 1850, 48.7, 'Battle Arena'),
('Maya', 'maya@example.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', 32, 15, 1620, 50.6, 'Mind Games'),
('Alex', 'alex@example.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', 28, 12, 1420, 50.7, 'Strategy Pro');

INSERT INTO games (bgg_id, name, description, image, min_players, max_players, duration, difficulty, category, year_published, publisher, designer, bgg_rating, weight, age_min, game_type, supports_cooperative, supports_competitive, supports_campaign, has_expansion, has_characters) VALUES
(12345, 'Strategy Pro', 'A complex strategy game that challenges your tactical thinking.', 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop', 2, 4, '60-90 min', 'Expert', 'Strategy', 2022, 'Strategy Games Inc.', 'John Designer', 7.8, 3.5, 14, 'competitive', FALSE, TRUE, TRUE, FALSE, TRUE),
(23456, 'Battle Arena', 'Fast-paced combat game with multiple character classes.', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop', 3, 6, '45-60 min', 'Intermediate', 'Combat', 2023, 'Combat Games Ltd.', 'Sarah Designer', 7.2, 2.8, 12, 'competitive', FALSE, TRUE, TRUE, TRUE, TRUE),
(34567, 'Mind Games', 'Psychological warfare meets board game mechanics.', 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop', 2, 8, '30-45 min', 'Beginner', 'Party', 2021, 'Mind Works', 'Alex Mindmaker', 6.9, 1.5, 10, 'competitive', FALSE, TRUE, FALSE, FALSE, FALSE),
(45678, 'Cosmic Empire', 'Build your galactic empire across the stars.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop', 2, 5, '90-120 min', 'Expert', 'Strategy', 2020, 'Cosmic Games', 'Maria Cosmos', 8.1, 4.2, 16, 'competitive', FALSE, TRUE, TRUE, TRUE, TRUE);

-- Insert game expansions
INSERT INTO game_expansions (game_id, bgg_expansion_id, name, year_published) VALUES
(2, 67890, 'Battle Arena: New Warriors', 2024),
(4, 45678, 'Cosmic Empire: Alien Worlds', 2021),
(4, 45679, 'Cosmic Empire: Deep Space', 2022);

-- Insert game characters
INSERT INTO game_characters (game_id, character_key, name, description, abilities) VALUES
(1, 'commander', 'Commander', 'Strategic military leader', '["Battle Tactics", "Resource Management", "Unit Command"]'),
(2, 'warrior', 'Warrior', 'Fierce melee fighter', '["Heavy Attack", "Shield Block", "Intimidate"]'),
(2, 'archer', 'Archer', 'Precise ranged combatant', '["Long Shot", "Multi-Shot", "Eagle Eye"]'),
(4, 'explorer', 'Explorer', 'Galactic scout and pioneer', '["System Discovery", "Resource Scanning", "Jump Drive"]'),
(4, 'diplomat', 'Diplomat', 'Inter-species negotiator', '["Trade Agreements", "Alliance Formation", "Cultural Exchange"]');