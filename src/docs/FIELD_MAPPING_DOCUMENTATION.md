# Documentation des Mappages de Champs : Frontend

## Vue d'ensemble

Ce document présente les correspondances entre les interfaces frontend et la base de données pour le projet Board Game Dashboard.

## Méthodologie d'Audit

✅ **Correspondance exacte** - Le champ existe avec le même nom et type  
🔄 **Champ calculé** - Champ virtuel généré côté frontend  
🔗 **Relation** - Champ relié à une autre table

---

## 1. INTERFACE PLAYER

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

### Correspondances Base de Données

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

---

## 2. INTERFACE GAME

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
  supports_cooperative: boolean
  supports_competitive: boolean
  supports_campaign: boolean
  supports_hybrid: boolean
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

### Correspondances Base de Données

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
| `supports_cooperative` | `supports_cooperative` | BOOLEAN | ✅ Correspondance exacte | |
| `supports_competitive` | `supports_competitive` | BOOLEAN | ✅ Correspondance exacte | |
| `supports_campaign` | `supports_campaign` | BOOLEAN | ✅ Correspondance exacte | |
| `supports_hybrid` | `supports_hybrid` | BOOLEAN | ✅ Correspondance exacte | |
| `has_expansion` | `has_expansion` | BOOLEAN | ✅ Correspondance exacte | |
| `has_characters` | `has_characters` | BOOLEAN | ✅ Correspondance exacte | |
| `created_at` | `created_at` | TIMESTAMP | ✅ Correspondance exacte | Auto-généré en BDD |
| `updated_at` | `updated_at` | TIMESTAMP | ✅ Correspondance exacte | Auto-généré en BDD |
| `expansions` | 🔗 Relation | Table séparée | 🔗 Relation JOIN | Table `game_expansions` |
| `characters` | 🔗 Relation | Table séparée | 🔗 Relation JOIN | Table `game_characters` |
| `players` | 🔄 Calculé frontend | Champ virtuel | 🔄 Champ virtuel pour affichage | Format: "2-4" |

---

## 3. INTERFACE GAMEEXPANSION

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

### Correspondances Base de Données

| **Champ Frontend** | **Champ BDD** | **Type BDD** | **Status** | **Notes** |
|-------------------|---------------|--------------|------------|-----------|
| `expansion_id` | `expansion_id` | INTEGER | ✅ Correspondance exacte | Optionnel en frontend (auto-gen) |
| `game_id` | `game_id` | INTEGER | ✅ Correspondance exacte | Optionnel en frontend (fourni par parent) |
| `bgg_expansion_id` | `bgg_expansion_id` | INTEGER | ✅ Correspondance exacte | Optionnel des deux côtés |
| `name` | `name` | VARCHAR(255) | ✅ Correspondance exacte | |
| `year_published` | `year_published` | INTEGER | ✅ Correspondance exacte | Optionnel des deux côtés |
| `description` | `description` | TEXT | ✅ Correspondance exacte | Optionnel des deux côtés |

---

## 4. INTERFACE GAMECHARACTER

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

### Correspondances Base de Données

| **Champ Frontend** | **Champ BDD** | **Type BDD** | **Status** | **Notes** |
|-------------------|---------------|--------------|------------|-----------|
| `character_id` | `character_id` | INTEGER | ✅ Correspondance exacte | Optionnel en frontend (auto-gen) |
| `game_id` | `game_id` | INTEGER | ✅ Correspondance exacte | Optionnel en frontend (fourni par parent) |
| `character_key` | `character_key` | VARCHAR(100) | ✅ Correspondance exacte | |
| `name` | `name` | VARCHAR(255) | ✅ Correspondance exacte | |
| `description` | `description` | TEXT | ✅ Correspondance exacte | Optionnel des deux côtés |
| `avatar` | `avatar` | TEXT | ✅ Correspondance exacte | Optionnel des deux côtés |
| `abilities` | `abilities` | TEXT (JSON) | ✅ Correspondance exacte | Array→JSON conversion |

---

## 5. INTERFACE GAMESESSION

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

### Correspondances Base de Données

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

---

## 6. INTERFACE SESSIONPLAYER

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

### Correspondances Base de Données

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

---

## RÉSUMÉ DES CORRESPONDANCES

### 🟢 Statut Global
✅ **Table Players** : 100% mappée  
✅ **Table Games** : 100% mappée  
✅ **Table Game_Expansions** : 100% mappée  
✅ **Table Game_Characters** : 100% mappée  
✅ **Table Game_Sessions** : 100% mappée  
✅ **Table Session_Players** : 100% mappée  

**Score Global** : 100% de correspondance - Toutes les tables sont parfaitement mappées

### 🔄 Champs Calculés (Frontend uniquement)
- **`stats`** (Players) : Calculé = `${total_score} pts`
- **`players`** (Games) : Calculé = `${min_players}-${max_players}`

### 🔄 Champs Automatiques (BDD uniquement)
- **`created_at`** : Auto-rempli à la création avec CURRENT_TIMESTAMP
- **`updated_at`** : Auto-rempli à la modification via triggers