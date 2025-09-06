-- Migration 001: Remove email field from players and add avatar field to game_characters
-- Date: 2024-03-15
-- Description: 
--   - Remove email field from players table (not needed)
--   - Add avatar field to game_characters table
--   - Update indexes accordingly

-- Start transaction for safe migration
BEGIN TRANSACTION;

-- Create backup of current players table
CREATE TABLE players_backup AS SELECT * FROM players;

-- Create new players table without email field
CREATE TABLE players_new (
    player_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    avatar TEXT,
    games_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    average_score REAL DEFAULT 0.0,
    favorite_game TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Copy data from old table to new table (excluding email)
INSERT INTO players_new (
    player_id, player_name, avatar, games_played, wins, total_score, 
    average_score, favorite_game, created_at, updated_at
)
SELECT 
    player_id, player_name, avatar, games_played, wins, total_score, 
    average_score, favorite_game, created_at, updated_at
FROM players;

-- Drop old players table and rename new one
DROP TABLE players;
ALTER TABLE players_new RENAME TO players;

-- Add avatar field to game_characters table if it doesn't exist
ALTER TABLE game_characters ADD COLUMN avatar TEXT;

-- Recreate triggers for players table
CREATE TRIGGER update_players_timestamp 
    AFTER UPDATE ON players
    BEGIN
        UPDATE players SET updated_at = CURRENT_TIMESTAMP WHERE player_id = NEW.player_id;
    END;

-- Update any existing characters with default avatars based on their role
UPDATE game_characters 
SET avatar = CASE 
    WHEN name LIKE '%Commander%' THEN 'https://images.unsplash.com/photo-1578632292335-fac9311c1dd4?w=100&h=100&fit=crop&crop=face'
    WHEN name LIKE '%Warrior%' THEN 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    WHEN name LIKE '%Archer%' THEN 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    WHEN name LIKE '%Mage%' OR name LIKE '%Wizard%' THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    WHEN name LIKE '%Rogue%' THEN 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    ELSE 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
END
WHERE avatar IS NULL;

-- Commit the transaction
COMMIT;

-- Verification queries (commented out for production)
-- SELECT COUNT(*) FROM players; -- Should match original count
-- SELECT COUNT(*) FROM game_characters WHERE avatar IS NOT NULL; -- Should show all characters have avatars