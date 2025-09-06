# Board Game Score Backend

This is the backend API for the Board Game Score tracking application.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Initialize the database:
```bash
npm run init-db
```

3. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get player by ID
- `POST /api/players` - Create new player
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player

### Games
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get game by ID
- `POST /api/games` - Create new game
- `PUT /api/games/:id` - Update game
- `DELETE /api/games/:id` - Delete game

### Sessions
- `GET /api/sessions` - Get all sessions (optional ?game_id filter)
- `POST /api/sessions` - Create new game session

### Statistics
- `GET /api/stats/players` - Get player statistics
- `GET /api/stats/games` - Get game statistics

### Health
- `GET /api/health` - Health check endpoint

## Database

The backend uses SQLite with the `better-sqlite3` library. The database file is created automatically when the server starts.

### Schema

The database includes tables for:
- `players` - Player information
- `games` - Game information
- `game_expansions` - Game expansions
- `game_characters` - Game characters/roles
- `game_sessions` - Game session records
- `session_players` - Players in each session

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## Development

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server