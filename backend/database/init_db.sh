#!/bin/bash

# Database initialization script for Board Game Score Tracker
# This script sets up the SQLite database with schema and sample data

DATABASE_FILE="boardgame.db"
SCRIPT_DIR="$(dirname "$0")"

echo "Initializing Board Game Score Tracker Database..."

# Remove existing database if it exists
if [ -f "$DATABASE_FILE" ]; then
    echo "Removing existing database..."
    rm "$DATABASE_FILE"
fi

# Create new database with schema
echo "Creating database schema..."
sqlite3 "$DATABASE_FILE" < "$SCRIPT_DIR/schema.sql"

if [ $? -eq 0 ]; then
    echo "✅ Schema created successfully"
else
    echo "❌ Error creating schema"
    exit 1
fi

# Load sample data
echo "Loading sample data..."
sqlite3 "$DATABASE_FILE" < "$SCRIPT_DIR/sample_data.sql"

if [ $? -eq 0 ]; then
    echo "✅ Sample data loaded successfully"
else
    echo "❌ Error loading sample data"
    exit 1
fi

# Verify database creation
echo "Verifying database structure..."
TABLE_COUNT=$(sqlite3 "$DATABASE_FILE" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';")
VIEW_COUNT=$(sqlite3 "$DATABASE_FILE" "SELECT COUNT(*) FROM sqlite_master WHERE type='view';")
PLAYER_COUNT=$(sqlite3 "$DATABASE_FILE" "SELECT COUNT(*) FROM players;")
GAME_COUNT=$(sqlite3 "$DATABASE_FILE" "SELECT COUNT(*) FROM games;")
SESSION_COUNT=$(sqlite3 "$DATABASE_FILE" "SELECT COUNT(*) FROM game_sessions;")

echo "📊 Database Statistics:"
echo "   Tables: $TABLE_COUNT"
echo "   Views: $VIEW_COUNT"
echo "   Players: $PLAYER_COUNT"
echo "   Games: $GAME_COUNT"
echo "   Sessions: $SESSION_COUNT"

echo ""
echo "🎯 Database initialized successfully!"
echo "📁 Database file: $DATABASE_FILE"
echo ""
echo "💡 Usage examples:"
echo "   sqlite3 $DATABASE_FILE \"SELECT * FROM player_statistics;\""
echo "   sqlite3 $DATABASE_FILE \"SELECT * FROM game_statistics;\""