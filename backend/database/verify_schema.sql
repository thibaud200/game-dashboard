-- Database verification script
-- This script checks that all tables have the expected structure

-- Check PLAYERS table structure
PRAGMA table_info(players);

-- Check GAMES table structure  
PRAGMA table_info(games);

-- Check GAME_EXPANSIONS table structure
PRAGMA table_info(game_expansions);

-- Check GAME_CHARACTERS table structure
PRAGMA table_info(game_characters);

-- Check GAME_SESSIONS table structure
PRAGMA table_info(game_sessions);

-- Check SESSION_PLAYERS table structure
PRAGMA table_info(session_players);

-- Verify all required fields are present
SELECT 'PLAYERS table verification:' as check_type;
SELECT 
    CASE 
        WHEN COUNT(*) = 10 THEN '✅ All required columns present'
        ELSE '❌ Missing columns: ' || (10 - COUNT(*)) || ' missing'
    END as result
FROM pragma_table_info('players')
WHERE name IN ('player_id', 'player_name', 'avatar', 'games_played', 'wins', 'total_score', 'average_score', 'favorite_game', 'created_at', 'updated_at');

SELECT 'GAMES table verification:' as check_type;
SELECT 
    CASE 
        WHEN COUNT(*) = 25 THEN '✅ All required columns present'
        ELSE '❌ Missing columns: ' || (25 - COUNT(*)) || ' missing'
    END as result
FROM pragma_table_info('games')
WHERE name IN ('game_id', 'bgg_id', 'name', 'description', 'image', 'min_players', 'max_players', 'duration', 
               'difficulty', 'category', 'year_published', 'publisher', 'designer', 'bgg_rating', 'weight', 
               'age_min', 'game_type', 'supports_cooperative', 'supports_competitive', 'supports_campaign', 'supports_hybrid',
               'has_expansion', 'has_characters', 'created_at', 'updated_at');

SELECT 'GAME_EXPANSIONS table verification:' as check_type;
SELECT 
    CASE 
        WHEN COUNT(*) = 6 THEN '✅ All required columns present'
        ELSE '❌ Missing columns: ' || (6 - COUNT(*)) || ' missing'
    END as result
FROM pragma_table_info('game_expansions')
WHERE name IN ('expansion_id', 'game_id', 'bgg_expansion_id', 'name', 'year_published', 'description');

SELECT 'GAME_CHARACTERS table verification:' as check_type;
SELECT 
    CASE 
        WHEN COUNT(*) = 7 THEN '✅ All required columns present (including avatar)'
        ELSE '❌ Missing columns: ' || (7 - COUNT(*)) || ' missing'
    END as result
FROM pragma_table_info('game_characters')
WHERE name IN ('character_id', 'game_id', 'character_key', 'name', 'description', 'avatar', 'abilities');

SELECT 'GAME_SESSIONS table verification:' as check_type;
SELECT 
    CASE 
        WHEN COUNT(*) = 8 THEN '✅ All required columns present'
        ELSE '❌ Missing columns: ' || (8 - COUNT(*)) || ' missing'
    END as result
FROM pragma_table_info('game_sessions')
WHERE name IN ('session_id', 'game_id', 'session_date', 'duration_minutes', 'winner_player_id', 'session_type', 'notes', 'created_at');

SELECT 'SESSION_PLAYERS table verification:' as check_type;
SELECT 
    CASE 
        WHEN COUNT(*) = 8 THEN '✅ All required columns present'
        ELSE '❌ Missing columns: ' || (8 - COUNT(*)) || ' missing'
    END as result
FROM pragma_table_info('session_players')
WHERE name IN ('session_player_id', 'session_id', 'player_id', 'character_id', 'score', 'placement', 'is_winner', 'notes');

-- Check for missing avatar field specifically
SELECT 'Avatar field check:' as check_type;
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM pragma_table_info('game_characters') WHERE name = 'avatar') 
        THEN '✅ Avatar field exists in game_characters table'
        ELSE '❌ Avatar field missing in game_characters table - run migration script'
    END as result;

-- Sample data verification
SELECT 'Sample data check:' as check_type;
SELECT 
    COUNT(*) as total_players,
    COUNT(CASE WHEN avatar IS NOT NULL THEN 1 END) as players_with_avatars
FROM players;

SELECT 
    COUNT(*) as total_games,
    COUNT(CASE WHEN has_characters = TRUE THEN 1 END) as games_with_characters
FROM games;

SELECT 
    COUNT(*) as total_characters,
    COUNT(CASE WHEN avatar IS NOT NULL THEN 1 END) as characters_with_avatars
FROM game_characters;

-- Check for any data inconsistencies
SELECT 'Data consistency check:' as check_type;

-- Games that have has_characters=TRUE but no actual characters
SELECT 
    'Games marked as having characters but no characters defined:' as issue,
    COUNT(*) as count
FROM games g
WHERE g.has_characters = TRUE 
AND NOT EXISTS (SELECT 1 FROM game_characters gc WHERE gc.game_id = g.game_id);

-- Games that have characters but has_characters=FALSE
SELECT 
    'Games with characters but not marked as having characters:' as issue,
    COUNT(*) as count
FROM games g
WHERE g.has_characters = FALSE 
AND EXISTS (SELECT 1 FROM game_characters gc WHERE gc.game_id = g.game_id);

-- Characters without avatars
SELECT 
    'Characters without avatars:' as issue,
    COUNT(*) as count
FROM game_characters
WHERE avatar IS NULL;