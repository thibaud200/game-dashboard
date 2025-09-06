import express from 'express';
import cors from 'cors';
import DatabaseManager from './database/DatabaseManager';

const app = express();
const db = new DatabaseManager();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Error handler middleware
const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Player routes
app.get('/api/players', asyncHandler(async (req: express.Request, res: express.Response) => {
  const players = db.getAllPlayers();
  res.json(players);
}));

app.get('/api/players/:id', asyncHandler(async (req: express.Request, res: express.Response) => {
  const playerId = parseInt(req.params.id);
  const player = db.getPlayerById(playerId);
  
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  
  res.json(player);
}));

app.post('/api/players', asyncHandler(async (req: express.Request, res: express.Response) => {
  const playerData = req.body;
  
  // Validation
  if (!playerData.player_name) {
    return res.status(400).json({ error: 'Player name is required' });
  }
  
  try {
    const newPlayer = db.createPlayer(playerData);
    res.status(201).json(newPlayer);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    throw error;
  }
}));

app.put('/api/players/:id', asyncHandler(async (req: express.Request, res: express.Response) => {
  const playerId = parseInt(req.params.id);
  const playerData = req.body;
  
  if (!playerData.player_name) {
    return res.status(400).json({ error: 'Player name is required' });
  }
  
  try {
    const updatedPlayer = db.updatePlayer(playerId, playerData);
    if (!updatedPlayer) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(updatedPlayer);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    throw error;
  }
}));

app.delete('/api/players/:id', asyncHandler(async (req: express.Request, res: express.Response) => {
  const playerId = parseInt(req.params.id);
  const result = db.deletePlayer(playerId);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Player not found' });
  }
  
  res.status(204).send();
}));

// Game routes
app.get('/api/games', asyncHandler(async (req: express.Request, res: express.Response) => {
  const games = db.getAllGames();
  res.json(games);
}));

app.get('/api/games/:id', asyncHandler(async (req: express.Request, res: express.Response) => {
  const gameId = parseInt(req.params.id);
  const game = db.getGameById(gameId);
  
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  res.json(game);
}));

app.post('/api/games', asyncHandler(async (req: express.Request, res: express.Response) => {
  const gameData = req.body;
  
  // Validation
  if (!gameData.name || !gameData.min_players || !gameData.max_players) {
    return res.status(400).json({ 
      error: 'Game name, min_players, and max_players are required' 
    });
  }
  
  if (gameData.min_players < 1 || gameData.max_players < gameData.min_players) {
    return res.status(400).json({ 
      error: 'Invalid player count configuration' 
    });
  }
  
  const newGame = db.createGame(gameData);
  res.status(201).json(newGame);
}));

app.put('/api/games/:id', asyncHandler(async (req: express.Request, res: express.Response) => {
  const gameId = parseInt(req.params.id);
  const gameData = req.body;
  
  // Validation
  if (!gameData.name || !gameData.min_players || !gameData.max_players) {
    return res.status(400).json({ 
      error: 'Game name, min_players, and max_players are required' 
    });
  }
  
  if (gameData.min_players < 1 || gameData.max_players < gameData.min_players) {
    return res.status(400).json({ 
      error: 'Invalid player count configuration' 
    });
  }
  
  const updatedGame = db.updateGame(gameId, gameData);
  if (!updatedGame) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  res.json(updatedGame);
}));

app.delete('/api/games/:id', asyncHandler(async (req: express.Request, res: express.Response) => {
  const gameId = parseInt(req.params.id);
  const result = db.deleteGame(gameId);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  res.status(204).send();
}));

// Session routes
app.get('/api/sessions', asyncHandler(async (req: express.Request, res: express.Response) => {
  const gameId = req.query.game_id ? parseInt(req.query.game_id as string) : undefined;
  const sessions = db.getGameSessions(gameId);
  res.json(sessions);
}));

app.post('/api/sessions', asyncHandler(async (req: express.Request, res: express.Response) => {
  const sessionData = req.body;
  
  // Validation
  if (!sessionData.game_id) {
    return res.status(400).json({ error: 'Game ID is required' });
  }
  
  const newSession = db.createGameSession(sessionData);
  
  // Add players to session if provided
  if (sessionData.players && Array.isArray(sessionData.players)) {
    for (const playerData of sessionData.players) {
      db.addSessionPlayer({
        session_id: newSession.session_id,
        ...playerData
      });
    }
  }
  
  res.status(201).json(newSession);
}));

// Statistics routes
app.get('/api/stats/players', asyncHandler(async (req: express.Request, res: express.Response) => {
  const stats = db.getPlayerStats();
  res.json(stats);
}));

app.get('/api/stats/games', asyncHandler(async (req: express.Request, res: express.Response) => {
  const stats = db.getGameStats();
  res.json(stats);
}));

// Health check
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', error);
  
  if (error.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({ 
      error: 'Database constraint violation',
      details: error.message 
    });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  db.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;