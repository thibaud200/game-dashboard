import DatabaseManager from '../database/DatabaseManager';

//pour le logging
const winston = require('winston');
// Logger setup
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'backend/app-backend.log' })
  ]
});

async function initializeDatabase() {
  logger.info('Initializing database...');

  try {
    const db = new DatabaseManager();
    logger.info('Database initialized successfully!');

    // Verify initialization by getting counts
    const playerStats = db.getPlayerStats();
    const gameStats = db.getGameStats();

    logger.info('Database contents:');
    logger.info(`- Players: ${playerStats.total_players}`);
    logger.info(`- Games: ${gameStats.total_games}`);

    db.close();
    logger.info('Database connection closed.');

  } catch (error) {
    logger.error('Error initializing database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  initializeDatabase();
}