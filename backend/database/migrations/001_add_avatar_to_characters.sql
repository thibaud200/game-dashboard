-- Migration script to add avatar field to game_characters table
-- Run this if the database was created before the avatar field was added

-- Check if avatar column already exists
-- SQLite doesn't have a direct way to check column existence, so we'll use a workaround

-- Create a temporary table with the new structure
CREATE TABLE game_characters_new (
    character_id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    character_key TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    avatar TEXT,
    abilities TEXT, -- JSON string of abilities array
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);

-- Copy data from old table to new table
INSERT INTO game_characters_new (character_id, game_id, character_key, name, description, abilities)
SELECT character_id, game_id, character_key, name, description, abilities
FROM game_characters;

-- Drop the old table
DROP TABLE game_characters;

-- Rename the new table
ALTER TABLE game_characters_new RENAME TO game_characters;

-- Recreate indexes
CREATE INDEX idx_game_characters_game_id ON game_characters(game_id);

-- Update existing characters with default avatars
UPDATE game_characters 
SET avatar = 'https://images.unsplash.com/photo-1578632292335-fac9311c1dd4?w=100&h=100&fit=crop&crop=face'
WHERE avatar IS NULL;

-- Add some variations for different character types
UPDATE game_characters 
SET avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
WHERE character_key IN ('warrior', 'general', 'king', 'captain') AND avatar = 'https://images.unsplash.com/photo-1578632292335-fac9311c1dd4?w=100&h=100&fit=crop&crop=face';

UPDATE game_characters 
SET avatar = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
WHERE character_key IN ('archer', 'diplomat', 'cleric', 'scientist') AND avatar = 'https://images.unsplash.com/photo-1578632292335-fac9311c1dd4?w=100&h=100&fit=crop&crop=face';

UPDATE game_characters 
SET avatar = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
WHERE character_key IN ('mage', 'rogue', 'wizard', 'pilot') AND avatar = 'https://images.unsplash.com/photo-1578632292335-fac9311c1dd4?w=100&h=100&fit=crop&crop=face';

UPDATE game_characters 
SET avatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
WHERE character_key IN ('ranger', 'explorer', 'merchant', 'engineer') AND avatar = 'https://images.unsplash.com/photo-1578632292335-fac9311c1dd4?w=100&h=100&fit=crop&crop=face';

-- Verify the migration
SELECT 'Migration completed successfully. Characters with avatars:' as status;
SELECT COUNT(*) as total_characters, COUNT(avatar) as characters_with_avatars 
FROM game_characters;