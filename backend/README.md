# Board Game Score Tracker - Backend

This directory contains all backend-related files for the Board Game Score Tracker application.

## Directory Structure

```
backend/
├── database/           # Database schema and scripts
│   ├── schema.sql      # Complete database schema
│   ├── sample_data.sql # Sample data for testing
│   ├── queries.sql     # Common SQL queries
│   └── init_db.sh      # Database initialization script
├── api/               # API endpoints and routes
├── config/            # Configuration files
├── models/            # Data models and ORM definitions
├── services/          # Business logic services
└── utils/             # Utility functions and helpers
```

## Database

The application uses SQLite as the primary database. The database structure is designed to handle:

- **Players** - User profiles and statistics
- **Games** - Board game information with BGG integration
- **Sessions** - Game session records and scoring
- **Characters** - Game character/role definitions
- **Expansions** - Game expansion tracking

### Quick Start

To initialize the database:

```bash
cd backend/database
./init_db.sh
```

This will create `boardgame.db` with the complete schema and sample data.

## Key Features

### Data Persistence
- SQLite database for reliable data storage
- Automatic statistics calculation via triggers
- Referential integrity with foreign keys

### BGG Integration
- BoardGameGeek API integration support
- Automatic game data population
- Expansion and character data from BGG

### Statistics Tracking
- Player performance metrics
- Game popularity analytics
- Session history and trends

### Character System
- Support for games with character/role selection
- Character abilities stored as JSON
- Session tracking includes character usage

## Current Status

✅ Database schema complete
✅ Sample data available
✅ Common queries documented
🔄 API endpoints (planned)
🔄 Service layer (planned)
🔄 BGG integration (planned)