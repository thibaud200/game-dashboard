-- Database queries for common operations
-- Board Game Score Tracker

-- =====================================================
-- PLAYER QUERIES
-- =====================================================

-- Get all players with their current statistics
SELECT 
    player_id,
    player_name,
    games_played,
    wins,
    total_score,
    average_score,
    (wins * 100.0 / NULLIF(games_played, 0)) as win_percentage,
    favorite_game,
    created_at
FROM player_statistics
ORDER BY total_score DESC;

-- Get top players by win percentage (minimum 5 games)
SELECT 
    player_name,
    games_played,
    wins,
    (wins * 100.0 / games_played) as win_percentage
FROM player_statistics
WHERE games_played >= 5
ORDER BY win_percentage DESC, games_played DESC;

-- Get player game history
SELECT 
    gs.session_date,
    g.name as game_name,
    sp.score,
    sp.placement,
    sp.is_winner,
    gc.name as character_name,
    gs.duration_minutes,
    gs.notes
FROM game_sessions gs
JOIN games g ON gs.game_id = g.game_id
JOIN session_players sp ON gs.session_id = sp.session_id
LEFT JOIN game_characters gc ON sp.character_id = gc.character_id
WHERE sp.player_id = ? -- Replace with actual player_id
ORDER BY gs.session_date DESC;

-- =====================================================
-- GAME QUERIES
-- =====================================================

-- Get all games with their statistics
SELECT 
    g.name,
    g.min_players,
    g.max_players,
    g.difficulty,
    g.category,
    g.bgg_rating,
    gs.times_played,
    gs.unique_players,
    gs.average_score
FROM games g
LEFT JOIN game_statistics gs ON g.game_id = gs.game_id
ORDER BY gs.times_played DESC NULLS LAST;

-- Get game details with expansions and characters
SELECT 
    g.name,
    g.description,
    g.min_players,
    g.max_players,
    g.duration,
    g.difficulty,
    g.year_published,
    g.publisher,
    g.designer,
    g.bgg_rating,
    g.weight,
    g.game_type,
    GROUP_CONCAT(DISTINCT ge.name) as expansions,
    GROUP_CONCAT(DISTINCT gc.name) as characters
FROM games g
LEFT JOIN game_expansions ge ON g.game_id = ge.game_id
LEFT JOIN game_characters gc ON g.game_id = gc.game_id
WHERE g.game_id = ? -- Replace with actual game_id
GROUP BY g.game_id;

-- Get most popular games (by sessions played)
SELECT 
    g.name,
    COUNT(DISTINCT gs.session_id) as times_played,
    COUNT(DISTINCT sp.player_id) as unique_players,
    AVG(sp.score) as average_score,
    g.bgg_rating
FROM games g
JOIN game_sessions gs ON g.game_id = gs.game_id
JOIN session_players sp ON gs.session_id = sp.session_id
GROUP BY g.game_id, g.name, g.bgg_rating
ORDER BY times_played DESC;

-- =====================================================
-- SESSION QUERIES
-- =====================================================

-- Get recent game sessions
SELECT 
    gs.session_id,
    gs.session_date,
    g.name as game_name,
    gs.duration_minutes,
    p.player_name as winner,
    gs.session_type,
    COUNT(sp.player_id) as player_count
FROM game_sessions gs
JOIN games g ON gs.game_id = g.game_id
LEFT JOIN players p ON gs.winner_player_id = p.player_id
LEFT JOIN session_players sp ON gs.session_id = sp.session_id
GROUP BY gs.session_id, gs.session_date, g.name, gs.duration_minutes, p.player_name, gs.session_type
ORDER BY gs.session_date DESC
LIMIT 20;

-- Get session details with all participants
SELECT 
    gs.session_date,
    g.name as game_name,
    p.player_name,
    sp.score,
    sp.placement,
    sp.is_winner,
    gc.name as character_name,
    gs.duration_minutes,
    gs.session_type
FROM game_sessions gs
JOIN games g ON gs.game_id = g.game_id
JOIN session_players sp ON gs.session_id = sp.session_id
JOIN players p ON sp.player_id = p.player_id
LEFT JOIN game_characters gc ON sp.character_id = gc.character_id
WHERE gs.session_id = ? -- Replace with actual session_id
ORDER BY sp.placement ASC;

-- =====================================================
-- STATISTICS QUERIES
-- =====================================================

-- Get overall statistics dashboard
SELECT 
    'Total Players' as metric,
    COUNT(*) as value
FROM players
UNION ALL
SELECT 
    'Total Games' as metric,
    COUNT(*) as value
FROM games
UNION ALL
SELECT 
    'Total Sessions' as metric,
    COUNT(*) as value
FROM game_sessions
UNION ALL
SELECT 
    'Average Session Duration' as metric,
    ROUND(AVG(duration_minutes), 1) as value
FROM game_sessions
WHERE duration_minutes IS NOT NULL;

-- Get player vs player head-to-head records
SELECT 
    p1.player_name as player1,
    p2.player_name as player2,
    COUNT(*) as games_played,
    SUM(CASE WHEN sp1.placement < sp2.placement THEN 1 ELSE 0 END) as player1_wins,
    SUM(CASE WHEN sp2.placement < sp1.placement THEN 1 ELSE 0 END) as player2_wins,
    SUM(CASE WHEN sp1.placement = sp2.placement THEN 1 ELSE 0 END) as ties
FROM session_players sp1
JOIN session_players sp2 ON sp1.session_id = sp2.session_id AND sp1.player_id < sp2.player_id
JOIN players p1 ON sp1.player_id = p1.player_id
JOIN players p2 ON sp2.player_id = p2.player_id
GROUP BY sp1.player_id, sp2.player_id, p1.player_name, p2.player_name
HAVING games_played >= 3
ORDER BY games_played DESC;

-- Get character usage statistics
SELECT 
    gc.name as character_name,
    g.name as game_name,
    COUNT(*) as times_played,
    AVG(sp.score) as average_score,
    COUNT(CASE WHEN sp.is_winner = TRUE THEN 1 END) as wins,
    (COUNT(CASE WHEN sp.is_winner = TRUE THEN 1 END) * 100.0 / COUNT(*)) as win_rate
FROM game_characters gc
JOIN session_players sp ON gc.character_id = sp.character_id
JOIN games g ON gc.game_id = g.game_id
GROUP BY gc.character_id, gc.name, g.name
HAVING times_played >= 3
ORDER BY times_played DESC;

-- =====================================================
-- REPORTING QUERIES
-- =====================================================

-- Monthly activity report
SELECT 
    strftime('%Y-%m', gs.session_date) as month,
    COUNT(DISTINCT gs.session_id) as sessions_played,
    COUNT(DISTINCT sp.player_id) as active_players,
    COUNT(DISTINCT gs.game_id) as games_played,
    AVG(gs.duration_minutes) as avg_duration
FROM game_sessions gs
JOIN session_players sp ON gs.session_id = sp.session_id
GROUP BY strftime('%Y-%m', gs.session_date)
ORDER BY month DESC;

-- Game difficulty preference by player
SELECT 
    p.player_name,
    g.difficulty,
    COUNT(*) as games_played,
    AVG(sp.score) as average_score
FROM players p
JOIN session_players sp ON p.player_id = sp.player_id
JOIN game_sessions gs ON sp.session_id = gs.session_id
JOIN games g ON gs.game_id = g.game_id
GROUP BY p.player_id, p.player_name, g.difficulty
ORDER BY p.player_name, games_played DESC;