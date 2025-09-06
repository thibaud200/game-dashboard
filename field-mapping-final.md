# Correspondance des champs Frontend/Backend - Board Game Score Tracker

## Résumé des Modifications Effectuées

✅ **Suppression du champ `email`** de la table `players` partout
✅ **Ajout du champ `avatar`** à la table `game_characters`
✅ **Confirmation que `has_expansion`** existe déjà en BDD
✅ **Mise à jour des triggers et indexes**

## 1. Table PLAYERS

| **Frontend** | **Backend/BDD** | **Type BDD** | **Status** |
|---|---|---|---|
| `player_id` | `player_id` | INTEGER PK | ✅ Correspondance exacte |
| `player_name` | `player_name` | TEXT | ✅ Correspondance exacte |
| `avatar` | `avatar` | TEXT | ✅ Correspondance exacte |
| `games_played` | `games_played` | INTEGER | ✅ Correspondance exacte |
| `wins` | `wins` | INTEGER | ✅ Correspondance exacte |
| `total_score` | `total_score` | INTEGER | ✅ Correspondance exacte |
| `average_score` | `average_score` | REAL | ✅ Correspondance exacte |
| `favorite_game` | `favorite_game` | TEXT | ✅ Correspondance exacte |
| `stats` | 🔄 Calculé frontend | Champ virtuel pour affichage (ex: "2,100 pts") | ✅ OK - Non stocké en BDD |
| ❌ SUPPRIMÉ | ~~`email`~~ | ~~VARCHAR(255)~~ | ✅ Supprimé partout |
| - | `created_at` | TIMESTAMP | ✅ Auto-géré par BDD |
| - | `updated_at` | TIMESTAMP | ✅ Auto-géré par BDD |

## 2. Table GAMES

| **Frontend** | **Backend/BDD** | **Type BDD** | **Status** |
|---|---|---|---|
| `game_id` | `game_id` | INTEGER PK | ✅ Correspondance exacte |
| `bgg_id` | `bgg_id` | INTEGER | ✅ Correspondance exacte |
| `name` | `name` | TEXT | ✅ Correspondance exacte |
| `description` | `description` | TEXT | ✅ Correspondance exacte |
| `image` | `image` | TEXT | ✅ Correspondance exacte |
| `min_players` | `min_players` | INTEGER | ✅ Correspondance exacte |
| `max_players` | `max_players` | INTEGER | ✅ Correspondance exacte |
| `duration` | `duration` | TEXT | ✅ Correspondance exacte |
| `difficulty` | `difficulty` | TEXT | ✅ Correspondance exacte |
| `category` | `category` | TEXT | ✅ Correspondance exacte |
| `year_published` | `year_published` | INTEGER | ✅ Correspondance exacte |
| `publisher` | `publisher` | TEXT | ✅ Correspondance exacte |
| `designer` | `designer` | TEXT | ✅ Correspondance exacte |
| `bgg_rating` | `bgg_rating` | REAL | ✅ Correspondance exacte |
| `weight` | `weight` | REAL | ✅ Correspondance exacte |
| `age_min` | `age_min` | INTEGER | ✅ Correspondance exacte |
| `game_type` | `game_type` | TEXT | ✅ Correspondance exacte |
| `supports_cooperative` | `supports_cooperative` | BOOLEAN | ✅ Correspondance exacte |
| `supports_competitive` | `supports_competitive` | BOOLEAN | ✅ Correspondance exacte |
| `supports_campaign` | `supports_campaign` | BOOLEAN | ✅ Correspondance exacte |
| `has_expansion` | `has_expansion` | BOOLEAN | ✅ Correspondance exacte |
| `has_characters` | `has_characters` | BOOLEAN | ✅ Correspondance exacte |
| `players` | 🔄 Calculé frontend | Champ virtuel pour affichage (ex: "2-4") | ✅ OK - Calculé depuis min/max |
| `expansions` | 🔗 Relation | Array d'objets GameExpansion (table séparée) | ✅ OK - Relation via game_expansions |
| `characters` | 🔗 Relation | Array d'objets GameCharacter (table séparée) | ✅ OK - Relation via game_characters |
| - | `created_at` | TIMESTAMP | ✅ Auto-géré par BDD |
| - | `updated_at` | TIMESTAMP | ✅ Auto-géré par BDD |

## 3. Table GAME_EXPANSIONS

| **Frontend** | **Backend/BDD** | **Type BDD** | **Status** |
|---|---|---|---|
| `expansion_id` | `expansion_id` | INTEGER PK | ✅ Correspondance exacte |
| `game_id` | `game_id` | INTEGER FK | ✅ Correspondance exacte |
| `bgg_expansion_id` | `bgg_expansion_id` | INTEGER | ✅ Correspondance exacte |
| `name` | `name` | TEXT | ✅ Correspondance exacte |
| `year_published` | `year_published` | INTEGER | ✅ Correspondance exacte |
| `description` | `description` | TEXT | ✅ Correspondance exacte |

## 4. Table GAME_CHARACTERS

| **Frontend** | **Backend/BDD** | **Type BDD** | **Status** |
|---|---|---|---|
| `character_id` | `character_id` | INTEGER PK | ✅ Correspondance exacte |
| `game_id` | `game_id` | INTEGER FK | ✅ Correspondance exacte |
| `character_key` | `character_key` | TEXT | ✅ Correspondance exacte |
| `name` | `name` | TEXT | ✅ Correspondance exacte |
| `description` | `description` | TEXT | ✅ Correspondance exacte |
| `avatar` | `avatar` | TEXT | ✅ Ajouté en BDD |
| `abilities` | `abilities` | TEXT (JSON) | ✅ Correspondance exacte |

## 5. Tables SESSION (GAME_SESSIONS & SESSION_PLAYERS)

Toutes les correspondances sont exactes selon le schéma de base.

## Règles de Gestion

### TOUTES LES TABLES
- ✅ `created_at` : Existe en BDD, pas dans formulaires → Mise à jour automatique avec date du jour
- ✅ `updated_at` : Existe en BDD, pas dans formulaires → Mise à jour automatique avec date du jour

### Table PLAYERS
- ✅ `stats` : Calculé frontend pour affichage → Non stocké en BDD
- ✅ `email` : **SUPPRIMÉ** de partout (inutile)

### Table GAMES
- ✅ `players` : Calculé frontend → Basé sur `min_players` et `max_players`
- ✅ `has_expansion` : **EXISTE** en BDD → Détermine si on charge les expansions
- ✅ `expansions` : Relation → Chargé depuis table `game_expansions` si `has_expansion = TRUE`
- ✅ `characters` : Relation → Chargé depuis table `game_characters` si `has_characters = TRUE`

### Table GAME_CHARACTERS
- ✅ `avatar` : **AJOUTÉ** en BDD → Stocké et affiché

## Scripts de Migration

Le fichier `backend/database/migrations/001_remove_email_add_character_avatar.sql` contient toutes les modifications nécessaires pour :
1. Supprimer le champ `email` de la table `players`
2. Ajouter le champ `avatar` à la table `game_characters`
3. Mettre à jour les triggers et index
4. Migrer les données existantes en sécurité

## Statut Final

🎯 **TOUTES LES CORRESPONDANCES SONT MAINTENANT ALIGNÉES** entre le frontend et la base de données.

🔄 **Actions automatiques** :
- `created_at` et `updated_at` sont gérés automatiquement par les triggers
- `stats` et `players` sont calculés côté frontend
- Relations `expansions` et `characters` sont chargées selon les flags `has_expansion` et `has_characters`

✅ **Base de données prête** pour la persistance des données avec toutes les informations nécessaires.