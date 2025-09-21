import { 
  CreateCharacterSchema, 
  UpdateCharacterSchema, 
  BulkCreateCharactersSchema 
} from './validation/schemas';

console.log('🧪 Test de validation Zod pour les Characters\n');

// Test 1: Données valides pour créer un personnage
console.log('✅ Test 1: Création de personnage avec données valides');
try {
  const validCharacter = CreateCharacterSchema.parse({
    game_id: 1,
    character_key: 'wizard',
    name: 'Gandalf le Gris',
    description: 'Un puissant magicien',
    avatar: 'https://example.com/gandalf.jpg',
    abilities: ['Magic', 'Wisdom']
  });
  console.log('  ✓ Validation réussie:', validCharacter);
} catch (error) {
  console.log('  ❌ Validation échouée:', error);
}

// Test 2: Données invalides pour créer un personnage
console.log('\n❌ Test 2: Création de personnage avec données invalides');
try {
  CreateCharacterSchema.parse({
    game_id: -1, // Invalide
    character_key: '', // Vide
    name: '', // Vide
    avatar: 'not-a-url', // URL invalide
    abilities: 'not-an-array' // Pas un tableau
  });
  console.log('  ❌ La validation aurait dû échouer!');
} catch (error: any) {
  console.log('  ✓ Validation échouée comme attendu:');
  if (error.errors) {
    error.errors.forEach((err: any) => {
      console.log(`    - ${err.path.join('.')}: ${err.message}`);
    });
  }
}

// Test 3: Mise à jour avec données valides
console.log('\n✅ Test 3: Mise à jour de personnage avec données valides');
try {
  const validUpdate = UpdateCharacterSchema.parse({
    name: 'Gandalf le Blanc',
    description: 'Maintenant encore plus puissant'
  });
  console.log('  ✓ Validation réussie:', validUpdate);
} catch (error) {
  console.log('  ❌ Validation échouée:', error);
}

// Test 4: Mise à jour sans aucun champ
console.log('\n❌ Test 4: Mise à jour sans aucun champ');
try {
  UpdateCharacterSchema.parse({});
  console.log('  ❌ La validation aurait dû échouer!');
} catch (error: any) {
  console.log('  ✓ Validation échouée comme attendu:', error.message);
}

// Test 5: Création en lot valide
console.log('\n✅ Test 5: Création en lot avec données valides');
try {
  const validBulk = BulkCreateCharactersSchema.parse({
    gameId: 1,
    characters: [
      {
        character_key: 'frodo',
        name: 'Frodo Baggins',
        description: 'Un hobbit courageux'
      },
      {
        character_key: 'aragorn',
        name: 'Aragorn',
        description: 'Le roi du Gondor',
        abilities: ['Sword Fighting', 'Leadership']
      }
    ]
  });
  console.log('  ✓ Validation réussie:', validBulk);
} catch (error) {
  console.log('  ❌ Validation échouée:', error);
}

console.log('\n🎉 Tests de validation terminés!');