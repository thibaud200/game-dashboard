# Audit des Correspondances Champs Frontend ↔ Base de Données

## 📊 Vue d'ensemble

Cet audit identifie les incohérences entre les champs utilisés dans le frontend et ceux définis dans la structure de base de données.

## 🔍 Analyse par Table

### Table PLAYERS

| Champ Frontend | Champ BDD | Type BDD | Statut | Notes |
|---------------|-----------|----------|--------|-------|
| `player_id` | `player_id` | SERIAL PRIMARY KEY | ✅ Correspondance exacte | |
| `player_name` | `player_name` | VARCHAR(255) NOT NULL | ✅ Correspondance exacte | |
| `avatar` | `avatar` | TEXT | ✅ Correspondance exacte | |
| `games_played` | `games_played` | INTEGER DEFAULT 0 | ✅ Correspondance exacte | |
| `wins` | `wins` | INTEGER DEFAULT 0 | ✅ Correspondance exacte | |
| `total_score` | `total_score` | INTEGER DEFAULT 0 | ✅ Correspondance exacte | |
| `average_score` | `average_score` | DECIMAL(5,2) DEFAULT 0 | ✅ Correspondance exacte | |
| `favorite_game` | `favorite_game` | VARCHAR(255) | ✅ Correspondance exacte | |
| `created_at` | `created_at` | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | ✅ Correspondance exacte | Auto-géré |
| `updated_at` | `updated_at` | TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | ✅ Correspondance exacte | Auto-géré |
| `stats` | 🔄 Calculé frontend | Champ virtuel pour affichage | ✅ Correct | Format: "X,XXX pts" |

### Table GAMES

| Champ Frontend | Champ BDD | Type BDD | Statut | Notes |
|---------------|-----------|----------|--------|-------|
| `game_id` | `game_id` | SERIAL PRIMARY KEY | ✅ Correspondance exacte | |
| `bgg_id` | `bgg_id` | INTEGER | ✅ Correspondance exacte | |
| `name` | `name` | VARCHAR(255) NOT NULL | ✅ Correspondance exacte | |
| `description` | `description` | TEXT | ✅ Correspondance exacte | |
| `image` | `image` | TEXT | ✅ Correspondance exacte | |
| `min_players` | `min_players` | INTEGER | ✅ Correspondance exacte | |
| `max_players` | `max_players` | INTEGER | ✅ Correspondance exacte | |
| `duration` | `duration` | VARCHAR(50) | ✅ Correspondance exacte | |
| `difficulty` | `difficulty` | VARCHAR(50) | ✅ Correspondance exacte | |
| `category` | `category` | VARCHAR(100) | ✅ Correspondance exacte | |
| `year_published` | `year_published` | INTEGER | ✅ Correspondance exacte | |
| `publisher` | `publisher` | VARCHAR(255) | ✅ Correspondance exacte | |
| `designer` | `designer` | VARCHAR(255) | ✅ Correspondance exacte | |
| `bgg_rating` | `bgg_rating` | DECIMAL(3,1) | ✅ Correspondance exacte | |
| `weight` | `weight` | DECIMAL(3,1) | ✅ Correspondance exacte | |
| `age_min` | `age_min` | INTEGER | ✅ Correspondance exacte | |
| `game_type` | `game_type` | ENUM | ✅ Correspondance exacte | |
| `supports_cooperative` | `supports_cooperative` | BOOLEAN DEFAULT FALSE | ✅ Correspondance exacte | |
| `supports_competitive` | `supports_competitive` | BOOLEAN DEFAULT FALSE | ✅ Correspondance exacte | |
| `supports_campaign` | `supports_campaign` | BOOLEAN DEFAULT FALSE | ✅ Correspondance exacte | |
| `has_expansion` | ❌ **MANQUE EN BDD** | **BOOLEAN DEFAULT FALSE** | 🔴 **À AJOUTER** | Utilisé dans le frontend |
| `has_characters` | `has_characters` | BOOLEAN DEFAULT FALSE | ✅ Correspondance exacte | |
| `created_at` | `created_at` | TIMESTAMP | ✅ Correspondance exacte | Auto-géré |
| `updated_at` | `updated_at` | TIMESTAMP | ✅ Correspondance exacte | Auto-géré |
| `players` | 🔄 Calculé frontend | Champ virtuel | ✅ Correct | Format: "X-Y" |
| `expansions` | 🔗 Relation | Array GameExpansion | ✅ Correct | Relation vers table séparée |
| `characters` | 🔗 Relation | Array GameCharacter | ✅ Correct | Relation vers table séparée |

### Table GAME_EXPANSIONS

| Champ Frontend | Champ BDD | Type BDD | Statut | Notes |
|---------------|-----------|----------|--------|-------|
| `expansion_id` | `expansion_id` | SERIAL PRIMARY KEY | ✅ Correspondance exacte | |
| `game_id` | `game_id` | INTEGER REFERENCES games(game_id) | ✅ Correspondance exacte | |
| `bgg_expansion_id` | `bgg_expansion_id` | INTEGER | ✅ Correspondance exacte | |
| `name` | `name` | VARCHAR(255) NOT NULL | ✅ Correspondance exacte | |
| `year_published` | `year_published` | INTEGER | ✅ Correspondance exacte | |
| `description` | `description` | TEXT | ✅ Correspondance exacte | |

### Table GAME_CHARACTERS

| Champ Frontend | Champ BDD | Type BDD | Statut | Notes |
|---------------|-----------|----------|--------|-------|
| `character_id` | `character_id` | SERIAL PRIMARY KEY | ✅ Correspondance exacte | |
| `game_id` | `game_id` | INTEGER REFERENCES games(game_id) | ✅ Correspondance exacte | |
| `character_key` | `character_key` | VARCHAR(100) NOT NULL | ✅ Correspondance exacte | |
| `name` | `name` | VARCHAR(255) NOT NULL | ✅ Correspondance exacte | |
| `description` | `description` | TEXT | ✅ Correspondance exacte | |
| `avatar` | ❌ **MANQUE EN BDD** | **TEXT** | 🔴 **À AJOUTER** | Utilisé dans le frontend |
| `abilities` | `abilities` | JSON | ✅ Correspondance exacte | Stocké comme JSON |

## 🚨 Incohérences Identifiées

### 🔴 Champs manquants en BDD (À AJOUTER)

1. **Table `games`** : `has_expansion BOOLEAN DEFAULT FALSE`
   - Utilisé dans le frontend pour déterminer si un jeu a des extensions
   - Nécessaire pour la logique d'affichage des extensions

2. **Table `game_characters`** : `avatar TEXT`
   - Utilisé dans le frontend pour afficher l'avatar des personnages
   - Référence vers une image/URL

### 🟡 Champs auto-gérés (Pas d'action requise)

1. **Toutes les tables** : `created_at` et `updated_at`
   - Gérés automatiquement par la base de données
   - Pas d'affichage dans les formulaires
   - Mise à jour automatique avec la date du jour

### ✅ Champs virtuels (Fonctionnement correct)

1. **Table `players`** : `stats`
   - Calculé côté frontend : `"${total_score} pts"`
   - Pas stocké en base, généré dynamiquement

2. **Table `games`** : `players`
   - Calculé côté frontend : `"${min_players}-${max_players}"`
   - Pas stocké en base, généré dynamiquement

3. **Relations** : `expansions` et `characters`
   - Chargées depuis tables séparées
   - Gérées par les relations de clés étrangères

## 📋 Actions Requises

### 1. Modifications Base de Données

```sql
-- Ajouter has_expansion à la table games
ALTER TABLE games ADD COLUMN has_expansion BOOLEAN DEFAULT FALSE;

-- Ajouter avatar à la table game_characters  
ALTER TABLE game_characters ADD COLUMN avatar TEXT;
```

### 2. Synchronisation Frontend

Aucune modification requise côté frontend - les champs sont déjà utilisés correctement.

## ✅ État Final Attendu

Après les modifications :
- ✅ **100% de correspondance** entre frontend et BDD
- ✅ **Champs auto-gérés** fonctionnels (`created_at`, `updated_at`)
- ✅ **Champs virtuels** calculés dynamiquement
- ✅ **Relations** gérées par clés étrangères