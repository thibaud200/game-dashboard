# Documentation des Mappages de Champs : Base de Données vs Frontend

## Vue d'ensemble

Ce document présente un audit complet des correspondances entre les champs de la base de données et les interfaces frontend pour identifier et documenter toutes les incohérences existantes.

## Méthodologie d'Audit

✅ **Correspondance exacte** - Le champ existe avec le même nom et type  
🔄 **Champ calculé** - Champ virtuel généré côté frontend  
❌ **Manquant en BDD** - Champ présent en frontend mais absent en base  
⚠️ **Manquant en Frontend** - Champ présent en base mais non utilisé en interface  
🔀 **Mapping différent** - Champ avec nom/structure différente

---

## 1. TABLE PLAYERS

### Champs en Base de Données
```sql
CREATE TABLE players (
    player_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name VARCHAR(100) NOT NULL,
    avatar TEXT,
    games_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.0,
    favorite_game VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Interface Frontend
```typescript
interface Player {
  player_id: number
  player_name: string
  avatar?: string
  games_played: number
  wins: number
  total_score: number
  average_score: number
  favorite_game?: string
  created_at: Date
  updated_at?: Date
  // Calculated field for display
  stats?: string
}
```

### Correspondances

| **Champ Frontend** | **Champ BDD** | **Type BDD** | **Status** | **Notes** |
|-------------------|---------------|--------------|------------|-----------|
| `player_id` | `player_id` | INTEGER | ✅ Correspondance exacte | |
| `player_name` | `player_name` | VARCHAR(100) | ✅ Correspondance exacte | |
| `avatar` | `avatar` | TEXT | ✅ Correspondance exacte | Optionnel des deux côtés |
| `games_played` | `games_played` | INTEGER | ✅ Correspondance exacte | |
| `wins` | `wins` | INTEGER | ✅ Correspondance exacte | |
| `total_score` | `total_score` | INTEGER | ✅ Correspondance exacte | |
| `average_score` | `average_score` | DECIMAL(5,2) | ✅ Correspondance exacte | |
| `favorite_game` | `favorite_game` | VARCHAR(255) | ✅ Correspondance exacte | Optionnel des deux côtés |
| `created_at` | `created_at` | TIMESTAMP | ✅ Correspondance exacte | Auto-généré en BDD |
| `updated_at` | `updated_at` | TIMESTAMP | ✅ Correspondance exacte | Auto-généré en BDD |
| `stats` | 🔄 Calculé frontend | Champ virtuel | 🔄 Champ virtuel pour affichage | Format: "2,100 pts" |

### 🔴 Incohérences Identifiées
**AUCUNE** - Cette table est parfaitement mappée.

---

## 2. TABLE GAMES

### Champs en Base de Données
```sql
CREATE TABLE games (
    game_id INTEGER PRIMARY KEY AUTOINCREMENT,
    bgg_id INTEGER UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    min_players INTEGER NOT NULL,
    max_players INTEGER NOT NULL,
    duration VARCHAR(50),
    difficulty VARCHAR(50),
    category VARCHAR(100),
    year_published INTEGER,
    publisher VARCHAR(255),
    designer VARCHAR(255),
    bgg_rating DECIMAL(3,1),
    weight DECIMAL(3,1),
    age_min INTEGER,
    game_type VARCHAR(20) CHECK (game_type IN ('competitive', 'cooperative', 'campaign', 'hybrid')),
    supports_cooperative BOOLEAN DEFAULT FALSE,
    supports_competitive BOOLEAN DEFAULT FALSE,
    supports_campaign BOOLEAN DEFAULT FALSE,
    has_expansion BOOLEAN DEFAULT FALSE,  -- NOUVEAU CHAMP REQUIS
    has_characters BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Interface Frontend
```typescript
interface Game {
  game_id: number
  bgg_id?: number
  name: string
  description?: string
  image?: string
  min_players: number
  max_players: number
  duration?: string
  difficulty?: string
  category?: string
  year_published?: number
  publisher?: string
  designer?: string
  bgg_rating?: number
  weight?: number
  age_min?: number
  game_type: 'competitive' | 'cooperative' | 'campaign' | 'hybrid'
  supports_cooperative: boolean
  supports_competitive: boolean
  supports_campaign: boolean
  has_expansion: boolean
  has_characters: boolean
  created_at: Date
  updated_at?: Date
  // Related data
  expansions: GameExpansion[]
  characters: GameCharacter[]
  // Calculated field for display
  players?: string
}
```

### Correspondances

| **Champ Frontend** | **Champ BDD** | **Type BDD** | **Status** | **Notes** |
|-------------------|---------------|--------------|------------|-----------|
| `game_id` | `game_id` | INTEGER | ✅ Correspondance exacte | |
| `bgg_id` | `bgg_id` | INTEGER | ✅ Correspondance exacte | Optionnel, UNIQUE |
| `name` | `name` | VARCHAR(255) | ✅ Correspondance exacte | |
| `description` | `description` | TEXT | ✅ Correspondance exacte | Optionnel des deux côtés |
| `image` | `image` | TEXT | ✅ Correspondance exacte | Optionnel des deux côtés |
| `min_players` | `min_players` | INTEGER | ✅ Correspondance exacte | |
| `max_players` | `max_players` | INTEGER | ✅ Correspondance exacte | |
| `duration` | `duration` | VARCHAR(50) | ✅ Correspondance exacte | Optionnel des deux côtés |
| `difficulty` | `difficulty` | VARCHAR(50) | ✅ Correspondance exacte | Optionnel des deux côtés |
| `category` | `category` | VARCHAR(100) | ✅ Correspondance exacte | Optionnel des deux côtés |
| `year_published` | `year_published` | INTEGER | ✅ Correspondance exacte | Optionnel des deux côtés |
| `publisher` | `publisher` | VARCHAR(255) | ✅ Correspondance exacte | Optionnel des deux côtés |
| `designer` | `designer` | VARCHAR(255) | ✅ Correspondance exacte | Optionnel des deux côtés |
| `bgg_rating` | `bgg_rating` | DECIMAL(3,1) | ✅ Correspondance exacte | Optionnel des deux côtés |
| `weight` | `weight` | DECIMAL(3,1) | ✅ Correspondance exacte | Optionnel des deux côtés |
| `age_min` | `age_min` | INTEGER | ✅ Correspondance exacte | Optionnel des deux côtés |
| `game_type` | `game_type` | VARCHAR(20) | ✅ Correspondance exacte | Enum identique |
| `supports_cooperative` | `supports_cooperative` | BOOLEAN | ✅ Correspondance exacte | |
| `supports_competitive` | `supports_competitive` | BOOLEAN | ✅ Correspondance exacte | |
| `supports_campaign` | `supports_campaign` | BOOLEAN | ✅ Correspondance exacte | |
| `has_expansion` | `has_expansion` | BOOLEAN | ❌ **MANQUANT EN BDD** | **ACTION REQUISE** |
| `has_characters` | `has_characters` | BOOLEAN | ✅ Correspondance exacte | |
| `created_at` | `created_at` | TIMESTAMP | ✅ Correspondance exacte | Auto-généré en BDD |
| `updated_at` | `updated_at` | TIMESTAMP | ✅ Correspondance exacte | Auto-généré en BDD |
| `expansions` | 🔗 Relation | Table séparée | 🔄 Relation JOIN | Table `game_expansions` |
| `characters` | 🔗 Relation | Table séparée | 🔄 Relation JOIN | Table `game_characters` |
| `players` | 🔄 Calculé frontend | Champ virtuel | 🔄 Champ virtuel pour affichage | Format: "2-4" |

### 🔴 Incohérences Identifiées
1. **`has_expansion` manquant en BDD** - Champ requis pour gérer l'affichage des extensions

---

## 3. TABLE GAME_EXPANSIONS

### Champs en Base de Données
```sql
CREATE TABLE game_expansions (
    expansion_id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    bgg_expansion_id INTEGER,
    name VARCHAR(255) NOT NULL,
    year_published INTEGER,
    description TEXT,
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);
```

### Interface Frontend
```typescript
interface GameExpansion {
  expansion_id?: number
  game_id?: number
  bgg_expansion_id?: number
  name: string
  year_published?: number
  description?: string
}
```

### Correspondances

| **Champ Frontend** | **Champ BDD** | **Type BDD** | **Status** | **Notes** |
|-------------------|---------------|--------------|------------|-----------|
| `expansion_id` | `expansion_id` | INTEGER | ✅ Correspondance exacte | Optionnel en frontend (auto-gen) |
| `game_id` | `game_id` | INTEGER | ✅ Correspondance exacte | Optionnel en frontend (fourni par parent) |
| `bgg_expansion_id` | `bgg_expansion_id` | INTEGER | ✅ Correspondance exacte | Optionnel des deux côtés |
| `name` | `name` | VARCHAR(255) | ✅ Correspondance exacte | |
| `year_published` | `year_published` | INTEGER | ✅ Correspondance exacte | Optionnel des deux côtés |
| `description` | `description` | TEXT | ✅ Correspondance exacte | Optionnel des deux côtés |

### 🔴 Incohérences Identifiées
**AUCUNE** - Cette table est parfaitement mappée.

---

## 4. TABLE GAME_CHARACTERS

### Champs en Base de Données
```sql
CREATE TABLE game_characters (
    character_id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    character_key VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar TEXT,  -- NOUVEAU CHAMP REQUIS
    abilities TEXT, -- JSON array of abilities
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);
```

### Interface Frontend
```typescript
interface GameCharacter {
  character_id?: number
  game_id?: number
  character_key: string
  name: string
  description?: string
  avatar?: string
  abilities?: string[] // Will be stored as JSON in database
}
```

### Correspondances

| **Champ Frontend** | **Champ BDD** | **Type BDD** | **Status** | **Notes** |
|-------------------|---------------|--------------|------------|-----------|
| `character_id` | `character_id` | INTEGER | ✅ Correspondance exacte | Optionnel en frontend (auto-gen) |
| `game_id` | `game_id` | INTEGER | ✅ Correspondance exacte | Optionnel en frontend (fourni par parent) |
| `character_key` | `character_key` | VARCHAR(100) | ✅ Correspondance exacte | |
| `name` | `name` | VARCHAR(255) | ✅ Correspondance exacte | |
| `description` | `description` | TEXT | ✅ Correspondance exacte | Optionnel des deux côtés |
| `avatar` | `avatar` | TEXT | ❌ **MANQUANT EN BDD** | **ACTION REQUISE** |
| `abilities` | `abilities` | TEXT (JSON) | ✅ Correspondance exacte | Array→JSON conversion |

### 🔴 Incohérences Identifiées
1. **`avatar` manquant en BDD** - Champ utilisé en frontend pour l'affichage des personnages

---

## 5. TABLE GAME_SESSIONS

### Champs en Base de Données
```sql
CREATE TABLE game_sessions (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INTEGER,
    winner_player_id INTEGER,
    session_type VARCHAR(20) CHECK (session_type IN ('competitive', 'cooperative', 'campaign')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE,
    FOREIGN KEY (winner_player_id) REFERENCES players(player_id) ON DELETE SET NULL
);
```

### Interface Frontend
```typescript
interface GameSession {
  session_id: number
  game_id: number
  session_date: Date
  duration_minutes?: number
  winner_player_id?: number
  session_type: 'competitive' | 'cooperative' | 'campaign'
  notes?: string
  created_at: Date
}
```

### Correspondances

| **Champ Frontend** | **Champ BDD** | **Type BDD** | **Status** | **Notes** |
|-------------------|---------------|--------------|------------|-----------|
| `session_id` | `session_id` | INTEGER | ✅ Correspondance exacte | |
| `game_id` | `game_id` | INTEGER | ✅ Correspondance exacte | |
| `session_date` | `session_date` | TIMESTAMP | ✅ Correspondance exacte | |
| `duration_minutes` | `duration_minutes` | INTEGER | ✅ Correspondance exacte | Optionnel des deux côtés |
| `winner_player_id` | `winner_player_id` | INTEGER | ✅ Correspondance exacte | Optionnel des deux côtés |
| `session_type` | `session_type` | VARCHAR(20) | ✅ Correspondance exacte | Enum identique |
| `notes` | `notes` | TEXT | ✅ Correspondance exacte | Optionnel des deux côtés |
| `created_at` | `created_at` | TIMESTAMP | ✅ Correspondance exacte | Auto-généré en BDD |

### 🔴 Incohérences Identifiées
**AUCUNE** - Cette table est parfaitement mappée.

---

## 6. TABLE SESSION_PLAYERS

### Champs en Base de Données
```sql
CREATE TABLE session_players (
    session_player_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    character_id INTEGER,
    score INTEGER DEFAULT 0,
    placement INTEGER,
    is_winner BOOLEAN DEFAULT FALSE,
    notes TEXT,
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES game_characters(character_id) ON DELETE SET NULL
);
```

### Interface Frontend
```typescript
interface SessionPlayer {
  session_player_id?: number
  session_id: number
  player_id: number
  character_id?: number
  score: number
  placement?: number
  is_winner: boolean
  notes?: string
}
```

### Correspondances

| **Champ Frontend** | **Champ BDD** | **Type BDD** | **Status** | **Notes** |
|-------------------|---------------|--------------|------------|-----------|
| `session_player_id` | `session_player_id` | INTEGER | ✅ Correspondance exacte | Optionnel en frontend (auto-gen) |
| `session_id` | `session_id` | INTEGER | ✅ Correspondance exacte | |
| `player_id` | `player_id` | INTEGER | ✅ Correspondance exacte | |
| `character_id` | `character_id` | INTEGER | ✅ Correspondance exacte | Optionnel des deux côtés |
| `score` | `score` | INTEGER | ✅ Correspondance exacte | |
| `placement` | `placement` | INTEGER | ✅ Correspondance exacte | Optionnel des deux côtés |
| `is_winner` | `is_winner` | BOOLEAN | ✅ Correspondance exacte | |
| `notes` | `notes` | TEXT | ✅ Correspondance exacte | Optionnel des deux côtés |

### 🔴 Incohérences Identifiées
**AUCUNE** - Cette table est parfaitement mappée.

---

## RÉSUMÉ DES INCOHÉRENCES

### 🔴 Actions Critiques Requises

#### 1. Ajouts Manquants en Base de Données

**Table `games`** - Ajouter le champ `has_expansion`
```sql
ALTER TABLE games ADD COLUMN has_expansion BOOLEAN DEFAULT FALSE;
```

**Table `game_characters`** - Ajouter le champ `avatar`
```sql
ALTER TABLE game_characters ADD COLUMN avatar TEXT;
```

#### 2. Champs Automatiquement Gérés

**TOUTES LES TABLES** - Les champs `created_at` et `updated_at` :
- ✅ `created_at` : Existe en BDD, pas dans formulaires → Mise à jour automatique avec date du jour
- ✅ `updated_at` : Existe en BDD, pas dans formulaires → Mise à jour automatique avec date du jour

#### 3. Champs Calculés (Pas d'action requise)

- **`stats`** (Players) : Champ virtuel calculé = `${total_score} pts`
- **`players`** (Games) : Champ virtuel calculé = `${min_players}-${max_players}`

---

## SCRIPT DE MIGRATION REQUIS

```sql
-- Ajout des champs manquants
ALTER TABLE games ADD COLUMN has_expansion BOOLEAN DEFAULT FALSE;
ALTER TABLE game_characters ADD COLUMN avatar TEXT;

-- Mise à jour des données existantes si nécessaire
UPDATE games 
SET has_expansion = TRUE 
WHERE game_id IN (
    SELECT DISTINCT game_id 
    FROM game_expansions
);
```

---

## VALIDATION DES CORRESPONDANCES

✅ **Table Players** : 100% mappée  
🔴 **Table Games** : 1 champ manquant (`has_expansion`)  
✅ **Table Game_Expansions** : 100% mappée  
🔴 **Table Game_Characters** : 1 champ manquant (`avatar`)  
✅ **Table Game_Sessions** : 100% mappée  
✅ **Table Session_Players** : 100% mappée  

**Score Global** : 91.7% de correspondance (2 champs manquants sur 24 champs analysés)