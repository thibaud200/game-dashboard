# Corrections des Correspondances Champs Frontend/BDD

## Actions Requises

### TOUTES LES TABLES
- ✅ `created_at` : Existe en BDD, pas dans formulaires → Mise à jour automatique avec date du jour
- ✅ `updated_at` : Existe en BDD, pas dans formulaires → Mise à jour automatique avec date du jour

### Table PLAYERS

#### À Supprimer du Frontend :
- ❌ `email` : Inutile selon spécifications → **SUPPRIMER PARTOUT**

#### À Modifier :
- 🔄 `stats` : Champ virtuel frontend → **REMPLACER par données de `player_statistics` view**

### Table GAMES

#### Champs Corrects :
- ✅ `min_players` et `max_players` : Correspondent exactement
- 🔄 `players` : Champ virtuel calculé depuis `min_players-max_players`

#### À Vérifier/Ajouter en BDD :
- ⚠️ `has_expansion` : **VÉRIFIER si existe en BDD, sinon AJOUTER**

#### Relations Correctes :
- ✅ `expansions` : Array basé sur `has_expansion` → Table `game_expansions`
- ✅ `characters` : Array basé sur `has_characters` → Table `game_characters`

### Table GAME_CHARACTERS

#### À Ajouter en BDD :
- ❌ `avatar` : Présent en frontend seulement → **AJOUTER en BDD**

## Structure BDD à Modifier

### 1. Vérifier/Ajouter `has_expansion` dans table `games`
```sql
-- Si manquant, ajouter :
ALTER TABLE games ADD COLUMN has_expansion BOOLEAN DEFAULT FALSE;
```

### 2. Ajouter `avatar` dans table `game_characters`  
```sql
ALTER TABLE game_characters ADD COLUMN avatar TEXT; -- URL to character image
```

### 3. Supprimer `email` de table `players`
```sql
-- Optionnel selon besoins futurs
ALTER TABLE players DROP COLUMN email;
```

## Modifications Frontend Requises

### 1. Supprimer tous les champs `email` des :
- Formulaires joueurs
- Interfaces TypeScript 
- Composants d'affichage
- Données mock

### 2. Remplacer `stats` par données calculées depuis `player_statistics` view

### 3. Ajouter champ `avatar` pour les personnages de jeu

### 4. S'assurer que `created_at` et `updated_at` sont gérés automatiquement (pas dans formulaires)

## Validation BGG API
- `min_players` et `max_players` peuvent être renvoyés séparément ou combinés par BGG
- À vérifier lors de l'intégration API

## Résumé Actions Prioritaires
1. **SUPPRIMER** : Tous les champs `email` du frontend
2. **AJOUTER** : Colonne `avatar` à `game_characters` en BDD  
3. **VÉRIFIER** : Colonne `has_expansion` existe en BDD
4. **MODIFIER** : Calcul dynamique des `stats` joueurs depuis view BDD
5. **AUTOMATISER** : Gestion `created_at`/`updated_at` côté serveur