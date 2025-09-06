# Analyse des Incohérences entre Frontend et Base de Données

## État après corrections demandées

### Table PLAYERS

#### ✅ Correspondances exactes
| Frontend | Base de Données | Type BDD | Statut |
|----------|----------------|----------|--------|
| `player_id` | `player_id` | INTEGER PK | ✅ Parfait |
| `player_name` | `player_name` | VARCHAR(100) | ✅ Parfait |
| `avatar` | `avatar` | TEXT | ✅ Parfait |
| `games_played` | `games_played` | INTEGER | ✅ Parfait |
| `wins` | `wins` | INTEGER | ✅ Parfait |
| `total_score` | `total_score` | INTEGER | ✅ Parfait |
| `average_score` | `average_score` | DECIMAL(5,2) | ✅ Parfait |
| `favorite_game` | `favorite_game` | VARCHAR(255) | ✅ Parfait |

#### ✅ Champs BDD automatiques (pas dans formulaires)
| Frontend | Base de Données | Type BDD | Statut |
|----------|----------------|----------|--------|
| `created_at` | `created_at` | TIMESTAMP | ✅ Auto-géré |
| `updated_at` | `updated_at` | TIMESTAMP | ✅ Auto-géré |

#### ✅ Champs calculés frontend
| Frontend | Base de Données | Type BDD | Statut |
|----------|----------------|----------|--------|
| `stats` | 🔄 Calculé | Virtuel | ✅ Basé sur total_score |

#### ❌ SUPPRIMÉ (selon instructions)
| Frontend | Base de Données | Type BDD | Statut |
|----------|----------------|----------|--------|
| ~~`email`~~ | ~~`email`~~ | ~~VARCHAR(255)~~ | ❌ À supprimer complètement |

---

### Table GAMES

#### ✅ Correspondances exactes
| Frontend | Base de Données | Type BDD | Statut |
|----------|----------------|----------|--------|
| `game_id` | `game_id` | INTEGER PK | ✅ Parfait |
| `bgg_id` | `bgg_id` | INTEGER | ✅ Parfait |
| `name` | `name` | VARCHAR(255) | ✅ Parfait |
| `description` | `description` | TEXT | ✅ Parfait |
| `image` | `image` | TEXT | ✅ Parfait |
| `min_players` | `min_players` | INTEGER | ✅ Parfait |
| `max_players` | `max_players` | INTEGER | ✅ Parfait |
| `duration` | `duration` | VARCHAR(50) | ✅ Parfait |
| `difficulty` | `difficulty` | VARCHAR(50) | ✅ Parfait |
| `category` | `category` | VARCHAR(100) | ✅ Parfait |
| `year_published` | `year_published` | INTEGER | ✅ Parfait |
| `publisher` | `publisher` | VARCHAR(255) | ✅ Parfait |
| `designer` | `designer` | VARCHAR(255) | ✅ Parfait |
| `bgg_rating` | `bgg_rating` | DECIMAL(3,1) | ✅ Parfait |
| `weight` | `weight` | DECIMAL(3,1) | ✅ Parfait |
| `age_min` | `age_min` | INTEGER | ✅ Parfait |
| `game_type` | `game_type` | VARCHAR(20) | ✅ Parfait |
| `supports_cooperative` | `supports_cooperative` | BOOLEAN | ✅ Parfait |
| `supports_competitive` | `supports_competitive` | BOOLEAN | ✅ Parfait |
| `supports_campaign` | `supports_campaign` | BOOLEAN | ✅ Parfait |
| `has_characters` | `has_characters` | BOOLEAN | ✅ Parfait |

#### ⚠️ MANQUANT EN BDD (à ajouter)
| Frontend | Base de Données | Type BDD | Action requise |
|----------|----------------|----------|----------------|
| `has_expansion` | ❌ MANQUANT | BOOLEAN | ⚠️ **À AJOUTER EN BDD** |

#### ✅ Champs BDD automatiques (pas dans formulaires)
| Frontend | Base de Données | Type BDD | Statut |
|----------|----------------|----------|--------|
| `created_at` | `created_at` | TIMESTAMP | ✅ Auto-géré |
| `updated_at` | `updated_at` | TIMESTAMP | ✅ Auto-géré |

#### ✅ Champs calculés/relations
| Frontend | Base de Données | Type BDD | Statut |
|----------|----------------|----------|--------|
| `players` | 🔄 Calculé | Virtuel | ✅ Basé sur min_players/max_players |
| `expansions` | 🔗 Relation | Table séparée | ✅ Via game_expansions |
| `characters` | 🔗 Relation | Table séparée | ✅ Via game_characters |

---

### Table GAME_EXPANSIONS

#### ✅ Correspondances exactes
| Frontend | Base de Données | Type BDD | Statut |
|----------|----------------|----------|--------|
| `expansion_id` | `expansion_id` | INTEGER PK | ✅ Parfait |
| `game_id` | `game_id` | INTEGER FK | ✅ Parfait |
| `bgg_expansion_id` | `bgg_expansion_id` | INTEGER | ✅ Parfait |
| `name` | `name` | VARCHAR(255) | ✅ Parfait |
| `year_published` | `year_published` | INTEGER | ✅ Parfait |
| `description` | `description` | TEXT | ✅ Parfait |

#### 🔄 Frontend uniquement (stockage dans textarea)
| Frontend | Base de Données | Type BDD | Statut |
|----------|----------------|----------|--------|
| `rank` | ❌ Non utilisé | - | ✅ Frontend temporaire |

---

### Table GAME_CHARACTERS

#### ✅ Correspondances exactes
| Frontend | Base de Données | Type BDD | Statut |
|----------|----------------|----------|--------|
| `character_id` | `character_id` | INTEGER PK | ✅ Parfait |
| `game_id` | `game_id` | INTEGER FK | ✅ Parfait |
| `character_key` | `character_key` | VARCHAR(100) | ✅ Parfait |
| `name` | `name` | VARCHAR(255) | ✅ Parfait |
| `description` | `description` | TEXT | ✅ Parfait |
| `abilities` | `abilities` | TEXT (JSON) | ✅ Parfait |

#### ⚠️ MANQUANT EN BDD (selon vos instructions)
| Frontend | Base de Données | Type BDD | Action requise |
|----------|----------------|----------|----------------|
| `avatar` | ❌ MANQUANT | TEXT | ⚠️ **À AJOUTER EN BDD** |

---

## 📋 RÉSUMÉ DES ACTIONS REQUISES

### 🔴 Suppressions à effectuer
1. **Supprimer `email` partout** :
   - ❌ Table `players` en BDD
   - ❌ Tous les formulaires frontend
   - ❌ Interfaces TypeScript

### 🟡 Ajouts en BDD requis
1. **Table `games`** : Ajouter `has_expansion BOOLEAN DEFAULT FALSE`
2. **Table `game_characters`** : Ajouter `avatar TEXT`

### ✅ Champs conformes
- **Players** : 8/8 champs métier alignés
- **Games** : 20/21 champs alignés (manque `has_expansion`)
- **Game_expansions** : 6/6 champs alignés
- **Game_characters** : 5/6 champs alignés (manque `avatar`)

### 🔄 Champs auto-gérés (OK)
- `created_at` et `updated_at` dans toutes les tables
- Champs calculés (`stats`, `players`) 
- Relations (`expansions`, `characters`)

## 📊 Taux de conformité actuel
- **Players** : 100% (après suppression email)
- **Games** : 95% (manque has_expansion)
- **Game_expansions** : 100%
- **Game_characters** : 83% (manque avatar)

**Conformité globale** : 94.5% ✅