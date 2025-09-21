import DatabaseManager from './database/DatabaseManager';

console.log('🚀 Test des optimisations SQL avec les vues\n');

const db = new DatabaseManager();

// Test 1: Comparaison des méthodes getAllPlayers
console.log('📊 Test 1: Comparaison getAllPlayers vs getAllPlayersOptimized');
try {
  console.time('getAllPlayers (original)');
  const playersOriginal = db.getAllPlayers();
  console.timeEnd('getAllPlayers (original)');

  console.time('getAllPlayersOptimized (avec vue)');
  const playersOptimized = db.getAllPlayersOptimized();
  console.timeEnd('getAllPlayersOptimized (avec vue)');

  console.log(`Résultats originaux: ${playersOriginal.length} joueurs`);
  console.log(`Résultats optimisés: ${playersOptimized.length} joueurs`);
  
  if (playersOptimized.length > 0) {
    console.log('Premier joueur optimisé:', playersOptimized[0]);
  }
} catch (error: any) {
  console.error('Erreur Test 1:', error.message);
}

// Test 2: Comparaison des méthodes getAllGames
console.log('\n📊 Test 2: Comparaison getAllGames vs getAllGamesOptimized');
try {
  console.time('getAllGames (original)');
  const gamesOriginal = db.getAllGames();
  console.timeEnd('getAllGames (original)');

  console.time('getAllGamesOptimized (avec vue)');
  const gamesOptimized = db.getAllGamesOptimized();
  console.timeEnd('getAllGamesOptimized (avec vue)');

  console.log(`Résultats originaux: ${gamesOriginal.length} jeux`);
  console.log(`Résultats optimisés: ${gamesOptimized.length} jeux`);
  
  if (gamesOptimized.length > 0) {
    console.log('Premier jeu optimisé:', gamesOptimized[0]);
  }
} catch (error: any) {
  console.error('Erreur Test 2:', error.message);
}

// Test 3: Comparaison des statistiques joueurs
console.log('\n📊 Test 3: Comparaison getPlayerStats vs getPlayerStatsOptimized');
try {
  console.time('getPlayerStats (original)');
  const playerStatsOriginal = db.getPlayerStats();
  console.timeEnd('getPlayerStats (original)');

  console.time('getPlayerStatsOptimized (avec vue)');
  const playerStatsOptimized = db.getPlayerStatsOptimized();
  console.timeEnd('getPlayerStatsOptimized (avec vue)');

  console.log('Stats originales:', playerStatsOriginal);
  console.log('Stats optimisées:', playerStatsOptimized);
} catch (error: any) {
  console.error('Erreur Test 3:', error.message);
}

// Test 4: Comparaison des statistiques jeux
console.log('\n📊 Test 4: Comparaison getGameStats vs getGameStatsOptimized');
try {
  console.time('getGameStats (original)');
  const gameStatsOriginal = db.getGameStats();
  console.timeEnd('getGameStats (original)');

  console.time('getGameStatsOptimized (avec vue)');
  const gameStatsOptimized = db.getGameStatsOptimized();
  console.timeEnd('getGameStatsOptimized (avec vue)');

  console.log('Stats originales:', gameStatsOriginal);
  console.log('Stats optimisées:', gameStatsOptimized);
} catch (error: any) {
  console.error('Erreur Test 4:', error.message);
}

// Test 5: Test d'un joueur spécifique
console.log('\n📊 Test 5: Comparaison getPlayerById vs getPlayerByIdOptimized');
try {
  const playerId = 1;
  
  console.time('getPlayerById (original)');
  const playerOriginal = db.getPlayerById(playerId);
  console.timeEnd('getPlayerById (original)');

  console.time('getPlayerByIdOptimized (avec vue)');
  const playerOptimized = db.getPlayerByIdOptimized(playerId);
  console.timeEnd('getPlayerByIdOptimized (avec vue)');

  console.log('Joueur original:', playerOriginal);
  console.log('Joueur optimisé:', playerOptimized);
} catch (error: any) {
  console.error('Erreur Test 5:', error.message);
}

db.close();
console.log('\n🎉 Tests terminés!');