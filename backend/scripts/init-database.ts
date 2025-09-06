import DatabaseManager from '../database/DatabaseManager';

async function initializeDatabase() {
  console.log('Initializing database...');
  
  try {
    const db = new DatabaseManager();
    console.log('Database initialized successfully!');
    
    // Verify initialization by getting counts
    const playerStats = db.getPlayerStats();
    const gameStats = db.getGameStats();
    
    console.log('Database contents:');
    console.log(`- Players: ${playerStats.total_players}`);
    console.log(`- Games: ${gameStats.total_games}`);
    
    db.close();
    console.log('Database connection closed.');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  initializeDatabase();
}