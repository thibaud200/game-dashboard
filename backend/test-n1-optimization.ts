// Test script to compare N+1 optimizations performance
import DatabaseManager from './database/DatabaseManager';

console.log('🚀 Test des optimisations N+1\n');

const db = new DatabaseManager();

// Utility function to measure execution time
function measureTime<T>(fn: () => T, label: string): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${label}: ${(end - start).toFixed(3)}ms`);
  return result;
}

async function testN1Optimizations() {
  console.log('📊 Test 1: Comparaison getAllGames vs getAllGamesOptimized vs getAllGamesFullyOptimized');
  
  // Test original method (with N+1)
  const originalGames = measureTime(
    () => db.getAllGames(),
    'getAllGames (original avec N+1)'
  );
  
  // Test optimized method (still has N+1)
  const optimizedGames = measureTime(
    () => db.getAllGamesOptimized(),
    'getAllGamesOptimized (avec vue SQL mais encore N+1)'
  );
  
  // Test fully optimized method (no N+1)
  const fullyOptimizedGames = measureTime(
    () => db.getAllGamesFullyOptimized(),
    'getAllGamesFullyOptimized (SANS N+1)'
  );
  
  console.log(`Résultats originaux: ${originalGames.length} jeux`);
  console.log(`Résultats optimisés: ${optimizedGames.length} jeux`);
  console.log(`Résultats fully optimisés: ${fullyOptimizedGames.length} jeux`);
  
  // Check if a game has expansions/characters to show the optimization effect
  const gameWithExpansions = originalGames.find(g => g.expansions && g.expansions.length > 0);
  const gameWithCharacters = originalGames.find(g => g.characters && g.characters.length > 0);
  
  if (gameWithExpansions) {
    console.log(`\nJeu avec extensions trouvé: "${gameWithExpansions.name}" (${gameWithExpansions.expansions?.length} extensions)`);
  }
  
  if (gameWithCharacters) {
    console.log(`Jeu avec personnages trouvé: "${gameWithCharacters.name}" (${gameWithCharacters.characters?.length} personnages)`);
  }
  
  console.log('\n📊 Test 2: Comparaison getGameById vs getGameByIdOptimized vs getGameByIdFullyOptimized');
  
  const testGameId = originalGames[0]?.game_id;
  if (testGameId) {
    const originalGame = measureTime(
      () => db.getGameById(testGameId),
      'getGameById (original avec N+1)'
    );
    
    const optimizedGame = measureTime(
      () => db.getGameByIdOptimized(testGameId),
      'getGameByIdOptimized (avec vue SQL mais encore N+1)'
    );
    
    const fullyOptimizedGame = measureTime(
      () => db.getGameByIdFullyOptimized(testGameId),
      'getGameByIdFullyOptimized (SANS N+1)'
    );
    
    console.log(`Original: ${originalGame?.name} (${originalGame?.expansions?.length || 0} ext, ${originalGame?.characters?.length || 0} char)`);
    console.log(`Optimisé: ${optimizedGame?.name} (${optimizedGame?.expansions?.length || 0} ext, ${optimizedGame?.characters?.length || 0} char)`);
    console.log(`Fully optimisé: ${fullyOptimizedGame?.name} (${fullyOptimizedGame?.expansions?.length || 0} ext, ${fullyOptimizedGame?.characters?.length || 0} char)`);
  }
  
  console.log('\n📊 Test 3: Analyse de l\'utilisation des booleans has_expansion/has_characters');
  
  const gamesWithFlags = db.getAllGames();
  const totalGames = gamesWithFlags.length;
  const gamesWithExpansions = gamesWithFlags.filter(g => g.has_expansion).length;
  const gamesWithCharacters = gamesWithFlags.filter(g => g.has_characters).length;
  
  console.log(`Total des jeux: ${totalGames}`);
  console.log(`Jeux avec extensions (has_expansion=true): ${gamesWithExpansions}`);
  console.log(`Jeux avec personnages (has_characters=true): ${gamesWithCharacters}`);
  console.log(`Économie potentielle d'extensions: ${totalGames - gamesWithExpansions} requêtes évitées`);
  console.log(`Économie potentielle de personnages: ${totalGames - gamesWithCharacters} requêtes évitées`);
  
  // Calculate total query reduction
  const originalQueries = totalGames * 2; // 1 for extensions + 1 for characters per game
  const optimizedQueries = gamesWithExpansions + gamesWithCharacters; // only for games that have them
  const querySavings = originalQueries - optimizedQueries;
  const percentageSaved = ((querySavings / originalQueries) * 100).toFixed(1);
  
  console.log(`\n🎯 RÉSUMÉ DES OPTIMISATIONS:`);
  console.log(`Requêtes originales (N+1): ${originalQueries} requêtes`);
  console.log(`Requêtes optimisées: ${optimizedQueries} requêtes`);
  console.log(`Requêtes économisées: ${querySavings} (${percentageSaved}% de réduction)`);
}

testN1Optimizations().catch(console.error);

console.log('\n🎉 Tests terminés!');