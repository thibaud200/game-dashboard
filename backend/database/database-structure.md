# Database Structure for Board Game Score Tracker

## Overview
This document outlines the database schema for the Board Game Score Tracker application, designed to store comprehensive information about players, games, game sessions, and scoring data.

## Tables

### 1. Players Table
Stores information about individual players in the system.

```sql
CREATE TABLE players (
    player_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    avatar TEXT, -- URL to avatar image
    games_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    average_score REAL DEFAULT 0.0,
    favorite_game TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Games Table
Stores comprehensive information about board games.

```sql
CREATE TABLE games (
    game_id INTEGER PRIMARY KEY AUTOINCREMENT,
    bgg_id INTEGER UNIQUE, -- BoardGameGeek ID
    name TEXT NOT NULL,
    description TEXT,
    image TEXT, -- URL to game image
    min_players INTEGER NOT NULL,
    max_players INTEGER NOT NULL,
    duration TEXT, -- e.g., "60-90 min"
    difficulty TEXT, -- Beginner, Intermediate, Expert
    category TEXT,
    year_published INTEGER,
    publisher TEXT,
    designer TEXT,
    bgg_rating REAL, -- BGG rating (0.0-10.0)
    weight REAL, -- BGG complexity weight (1.0-5.0)
    age_min INTEGER,
    game_type TEXT CHECK (game_type IN ('competitive', 'cooperative', 'campaign', 'hybrid')),
    supports_cooperative BOOLEAN DEFAULT FALSE,
    supports_competitive BOOLEAN DEFAULT FALSE,
    supports_campaign BOOLEAN DEFAULT FALSE,
    supports_hybrid BOOLEAN DEFAULT FALSE,
    has_expansion BOOLEAN DEFAULT FALSE,
    has_characters BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Game Expansions Table
Stores information about game expansions.

```sql
CREATE TABLE game_expansions (
    expansion_id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    bgg_expansion_id INTEGER,
    name TEXT NOT NULL,
    year_published INTEGER,
    description TEXT,
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);
```

### 4. Game Characters Table
Stores information about character roles/classes available in games.

```sql
CREATE TABLE game_characters (
    character_id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    character_key TEXT NOT NULL, -- unique identifier for the character
    name TEXT NOT NULL,
    description TEXT,
    avatar TEXT, -- URL to character avatar image
    abilities TEXT, -- JSON array of abilities
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);
```

### 5. Game Sessions Table
Stores information about individual game sessions/matches.

```sql
CREATE TABLE game_sessions (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INTEGER,
    winner_player_id INTEGER,
    session_type TEXT CHECK (session_type IN ('competitive', 'cooperative', 'campaign')) DEFAULT 'competitive',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE,
    FOREIGN KEY (winner_player_id) REFERENCES players(player_id) ON DELETE SET NULL
);
```

### 6. Session Players Table
Links players to game sessions with their scores and performance.

```sql
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
```

### 7. Player Statistics View
A view that calculates player statistics dynamically.

```sql
CREATE VIEW player_statistics AS
SELECT 
    p.player_id,
    p.player_name,
    p.avatar,
    COUNT(DISTINCT sp.session_id) as games_played,
    COUNT(CASE WHEN sp.is_winner = 1 THEN 1 END) as wins,
    COALESCE(SUM(sp.score), 0) as total_score,
    COALESCE(AVG(sp.score), 0) as average_score,
    (COUNT(CASE WHEN sp.is_winner = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(DISTINCT sp.session_id), 0)) as win_percentage,
    p.favorite_game,
    p.created_at
FROM players p
LEFT JOIN session_players sp ON p.player_id = sp.player_id
GROUP BY p.player_id, p.player_name, p.avatar, p.favorite_game, p.created_at;
```

### 8. Game Statistics View
A view that calculates game statistics dynamically.

```sql
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
    (SELECT COUNT(DISTINCT sp.player_id) FROM session_players sp WHERE sp.session_id IN (SELECT session_id FROM game_sessions WHERE game_id = g.game_id)) as unique_players,
    (SELECT AVG(sp.score) FROM session_players sp WHERE sp.session_id IN (SELECT session_id FROM game_sessions WHERE game_id = g.game_id)) as average_score,
    (SELECT AVG(gs_inner.duration_minutes) FROM game_sessions gs_inner WHERE gs_inner.game_id = g.game_id) as average_duration,
    g.created_at
FROM games g
LEFT JOIN game_sessions gs ON g.game_id = gs.game_id
GROUP BY g.game_id, g.name, g.image, g.min_players, g.max_players, 
         g.difficulty, g.category, g.year_published, g.bgg_rating, g.created_at;
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_games_bgg_id ON games(bgg_id);
CREATE INDEX idx_game_sessions_date ON game_sessions(session_date);
CREATE INDEX idx_game_sessions_game_id ON game_sessions(game_id);
CREATE INDEX idx_session_players_session_id ON session_players(session_id);
CREATE INDEX idx_session_players_player_id ON session_players(player_id);
CREATE INDEX idx_game_expansions_game_id ON game_expansions(game_id);
CREATE INDEX idx_game_characters_game_id ON game_characters(game_id);
```

## Sample Data Relationships

### Example Player Record
```json
{
  "player_id": 1,
  "player_name": "Jane",
  "avatar": "https://example.com/avatar.jpg",
  "games_played": 45,
  "wins": 28,
  "total_score": 2100,
  "average_score": 46.7,
  "favorite_game": "Strategy Pro"
}
```

### Example Game Record
```json
{
  "game_id": 1,
  "bgg_id": 12345,
  "name": "Strategy Pro",
  "min_players": 2,
  "max_players": 4,
  "game_type": "competitive",
  "has_characters": true,
  "has_expansion": false
}
```

### Example Session Record
```json
{
  "session_id": 1,
  "game_id": 1,
  "session_date": "2024-03-15 19:30:00",
  "duration_minutes": 75,
  "winner_player_id": 1,
  "session_type": "competitive"
}
```

## Migration Notes

- The current in-memory data structure can be migrated to this database schema
- Player statistics should be calculated dynamically using views rather than stored
- Game expansions and characters are normalized into separate tables for better data integrity
- Session tracking allows for comprehensive game history and analytics