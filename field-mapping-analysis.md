# Correspondance Champs Frontend ↔ Base de Données

## 1. Table PLAYERS

### ✅ Champs Frontend mappés avec la BDD

| Frontend (Interface Player) | Base de Données | Type | Notes |
|----------------------------|-----------------|------|-------|
| `player_id` | `player_id` | INTEGER | ✅ Correspondance exacte |
| `player_name` | `player_name` | VARCHAR(100) | ✅ Correspondance exacte |
| `email` | `email` | VARCHAR(255) | ✅ Correspondance exacte |
| `avatar` | `avatar` | TEXT | ✅ Correspondance exacte |
| `games_played` | `games_played` | INTEGER | ✅ Correspondance exacte |
| `wins` | `wins` | INTEGER | ✅ Correspondance exacte |
| `total_score` | `total_score` | INTEGER | ✅ Correspondance exacte |
| `average_score` | `average_score` | DECIMAL(5,2) | ✅ Correspondance exacte |
| `favorite_game` | `favorite_game` | VARCHAR(255) | ✅ Correspondance exacte |
| `created_at` | `created_at` | TIMESTAMP | ✅ Correspondance exacte |
| `updated_at` | `updated_at` | TIMESTAMP | ⚠️ Présent en BDD, optionnel en frontend |

### ❌ Champs manquants ou problématiques

| Champ | Statut | Action requise |
|-------|--------|----------------|
| `stats` | 🔄 Calculé frontend | Champ virtuel pour affichage (ex: "2,100 pts") |

---

## 2. Table GAMES

### ✅ Champs Frontend mappés avec la BDD

| Frontend (Interface Game) | Base de Données | Type | Notes |
|--------------------------|-----------------|------|-------|
| `game_id` | `game_id` | INTEGER | ✅ Correspondance exacte |
| `bgg_id` | `bgg_id` | INTEGER | ✅ Correspondance exacte |
| `name` | `name` | VARCHAR(255) | ✅ Correspondance exacte |
| `description` | `description` | TEXT | ✅ Correspondance exacte |
| `image` | `image` | TEXT | ✅ Correspondance exacte |
| `min_players` | `min_players` | INTEGER | ✅ Correspondance exacte |
| `max_players` | `max_players` | INTEGER | ✅ Correspondance exacte |
| `duration` | `duration` | VARCHAR(50) | ✅ Correspondance exacte |
| `difficulty` | `difficulty` | VARCHAR(50) | ✅ Correspondance exacte |
| `category` | `category` | VARCHAR(100) | ✅ Correspondance exacte |
| `year_published` | `year_published` | INTEGER | ✅ Correspondance exacte |
| `publisher` | `publisher` | VARCHAR(255) | ✅ Correspondance exacte |
| `designer` | `designer` | VARCHAR(255) | ✅ Correspondance exacte |
| `bgg_rating` | `bgg_rating` | DECIMAL(3,1) | ✅ Correspondance exacte |
| `weight` | `weight` | DECIMAL(3,1) | ✅ Correspondance exacte |
| `age_min` | `age_min` | INTEGER | ✅ Correspondance exacte |
| `game_type` | `game_type` | VARCHAR(20) | ✅ Correspondance exacte |
| `supports_cooperative` | `supports_cooperative` | BOOLEAN | ✅ Correspondance exacte |
| `supports_competitive` | `supports_competitive` | BOOLEAN | ✅ Correspondance exacte |
| `supports_campaign` | `supports_campaign` | BOOLEAN | ✅ Correspondance exacte |
| `has_expansion` | `has_expansion` | BOOLEAN | ✅ Correspondance exacte |
| `has_characters` | `has_characters` | BOOLEAN | ✅ Correspondance exacte |
| `created_at` | `created_at` | TIMESTAMP | ✅ Correspondance exacte |
| `updated_at` | `updated_at` | TIMESTAMP | ⚠️ Présent en BDD, optionnel en frontend |

### ❌ Champs manquants ou problématiques

| Champ | Statut | Action requise |
|-------|--------|----------------|
| `players` | 🔄 Calculé frontend | Champ virtuel pour affichage (ex: "2-4") |
| `expansions` | 🔗 Relation | Array d'objets GameExpansion (table séparée) |
| `characters` | 🔗 Relation | Array d'objets GameCharacter (table séparée) |

---

## 3. Table GAME_EXPANSIONS

### ✅ Champs Frontend mappés avec la BDD

| Frontend (Interface GameExpansion) | Base de Données | Type | Notes |
|-----------------------------------|-----------------|------|-------|
| `expansion_id` | `expansion_id` | INTEGER | ✅ Correspondance exacte |
| `game_id` | `game_id` | INTEGER | ✅ Correspondance exacte (FK) |
| `bgg_expansion_id` | `bgg_expansion_id` | INTEGER | ✅ Correspondance exacte |
| `name` | `name` | VARCHAR(255) | ✅ Correspondance exacte |
| `year_published` | `year_published` | INTEGER | ✅ Correspondance exacte |
| `description` | `description` | TEXT | ✅ Correspondance exacte |

---

## 4. Table GAME_CHARACTERS

### ✅ Champs Frontend mappés avec la BDD

| Frontend (Interface GameCharacter) | Base de Données | Type | Notes |
|-----------------------------------|-----------------|------|-------|
| `character_id` | `character_id` | INTEGER | ✅ Correspondance exacte |
| `game_id` | `game_id` | INTEGER | ✅ Correspondance exacte (FK) |
| `character_key` | `character_key` | VARCHAR(100) | ✅ Correspondance exacte |
| `name` | `name` | VARCHAR(255) | ✅ Correspondance exacte |
| `description` | `description` | TEXT | ✅ Correspondance exacte |
| `abilities` | `abilities` | TEXT (JSON) | ✅ Frontend: string[], BDD: JSON |

### ❌ Champs manquants ou problématiques

| Champ | Statut | Action requise |
|-------|--------|----------------|
| `avatar` | ❌ Frontend seulement | Ajouter en BDD ou supprimer du frontend |

---

## 5. Table GAME_SESSIONS (Pas encore implémentée en frontend)

### ❌ Champs manquants en frontend

| Base de Données | Type | Action requise |
|-----------------|------|----------------|
| `session_id` | INTEGER | Créer interface GameSession |
| `game_id` | INTEGER | Créer interface GameSession |
| `session_date` | TIMESTAMP | Créer interface GameSession |
| `duration_minutes` | INTEGER | Créer interface GameSession |
| `winner_player_id` | INTEGER | Créer interface GameSession |
| `session_type` | VARCHAR(20) | Créer interface GameSession |
| `notes` | TEXT | Créer interface GameSession |
| `created_at` | TIMESTAMP | Créer interface GameSession |

---

## 6. Table SESSION_PLAYERS (Pas encore implémentée en frontend)

### ❌ Champs manquants en frontend

| Base de Données | Type | Action requise |
|-----------------|------|----------------|
| `session_player_id` | INTEGER | Créer interface SessionPlayer |
| `session_id` | INTEGER | Créer interface SessionPlayer |
| `player_id` | INTEGER | Créer interface SessionPlayer |
| `character_id` | INTEGER | Créer interface SessionPlayer |
| `score` | INTEGER | Créer interface SessionPlayer |
| `placement` | INTEGER | Créer interface SessionPlayer |
| `is_winner` | BOOLEAN | Créer interface SessionPlayer |
| `notes` | TEXT | Créer interface SessionPlayer |

---

## RÉSUMÉ DES ACTIONS REQUISES

### 🔧 Ajustements mineurs

1. **GameCharacter.avatar**: Ajouter en BDD ou supprimer du frontend
2. **updated_at**: Gérer de manière cohérente (optionnel partout)

### ✅ Bien mappé

- **Players**: 10/11 champs mappés (91%)
- **Games**: 21/21 champs de base mappés (100%)
- **GameExpansions**: 6/6 champs mappés (100%)
- **GameCharacters**: 5/6 champs mappés (83%)

### ❌ Manquant complètement

- **GameSession** interface: À créer
- **SessionPlayer** interface: À créer
- Formulaires pour créer/éditer des sessions de jeu
- Historique des parties jouées

### 🔄 Champs calculés (normaux)

- `Player.stats`: Calculé à partir de total_score
- `Game.players`: Calculé à partir de min_players et max_players

Le mapping est globalement très bon ! Les principales lacunes sont les sessions de jeu qui ne sont pas encore implémentées en frontend.