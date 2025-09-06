# Board Game Score Tracker Database

This directory contains the database schema and related files for the Board Game Score Tracker application.

## Database Structure

The application uses SQLite as the primary database for storing board game data, player information, and game session records.

### Core Tables

1. **players** - Player information and calculated statistics
2. **games** - Board game details including BGG integration data  
3. **game_expansions** - Expansion packs for games
4. **game_characters** - Character/role information for games
5. **game_sessions** - Individual game session records
6. **session_players** - Player participation and scores in sessions

### Views

- **player_statistics** - Dynamic calculation of player performance metrics
- **game_statistics** - Dynamic calculation of game popularity and metrics

## Files

- `schema.sql` - Complete database schema with tables, indexes, triggers, and views
- `sample_data.sql` - Sample data for testing and development
- `migrations/` - Database migration scripts (future)

## Key Features

### Automatic Statistics Calculation
The database uses triggers to automatically update player statistics when game sessions are recorded:
- Games played count
- Win/loss record
- Total and average scores
- Win percentage

### BGG Integration Support
Tables are designed to store BoardGameGeek data:
- BGG IDs for games and expansions
- BGG ratings and complexity weights
- Publisher and designer information

### Flexible Game Types
Supports multiple game modes:
- Competitive (winner/loser)
- Cooperative (team victory/defeat)
- Campaign (ongoing storylines)
- Hybrid (mixed mechanics)

### Character/Role System
Games can define characters/roles that players can choose:
- Character abilities stored as JSON
- Session tracking includes character selection
- Supports games without characters

### Expansion Tracking
- Hierarchical relationship between base games and expansions
- BGG expansion ID integration
- Publication year tracking

## Usage

### Initialize Database
```bash
sqlite3 boardgame.db < schema.sql
```

### Load Sample Data
```bash
sqlite3 boardgame.db < sample_data.sql
```

### Query Examples

#### Get Player Statistics
```sql
SELECT * FROM player_statistics WHERE player_name = 'Jane';
```

#### Get Game Session History
```sql
SELECT 
    gs.session_date,
    g.name as game_name,
    sp.score,
    sp.placement,
    sp.is_winner,
    gc.name as character_name
FROM game_sessions gs
JOIN games g ON gs.game_id = g.game_id
JOIN session_players sp ON gs.session_id = sp.session_id
LEFT JOIN game_characters gc ON sp.character_id = gc.character_id
WHERE sp.player_id = 1
ORDER BY gs.session_date DESC;
```

#### Get Game Popularity
```sql
SELECT 
    name,
    times_played,
    unique_players,
    average_score
FROM game_statistics
ORDER BY times_played DESC;
```

## Data Integrity

The database enforces referential integrity through:
- Foreign key constraints
- Check constraints for enums
- Cascade deletes for dependent records
- Automatic timestamp updates

## Performance

Indexes are created on frequently queried columns:
- Player email (unique)
- Game BGG ID (unique)
- Session dates
- Foreign key relationships

## Migration Strategy

Future schema changes will be managed through versioned migration scripts in the `migrations/` directory, allowing for safe database updates without data loss.