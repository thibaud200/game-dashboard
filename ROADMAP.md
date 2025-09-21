# 🗺️ Roadmap du Projet

Ce document présente les axes de développement futurs pour l'application Board Game Dashboard. La roadmap est organisée par priorité pour guider les prochaines étapes de manière logique et efficace.

## ✅ Réalisé Récemment

Un effort majeur de refactoring et d'organisation a été accompli, posant des bases solides pour la suite du développement.

-   **Architecture Frontend** : Mise en place et documentation du pattern **Container/Presenter**, séparant la logique de la présentation.
-   **Documentation Centralisée** : Toute la documentation du frontend a été réorganisée, nettoyée et centralisée dans le répertoire `/src/docs/`.
-   **Composants Modulaires** : Les boîtes de dialogue ont été extraites dans des composants réutilisables et la validation des formulaires a été intégrée.
-   **Conventions de Code** : Définition de guides de développement clairs pour garantir la cohérence et la qualité du code.

## 🎯 Priorité Haute : Prochaines Étapes

Cette section regroupe les tâches ayant le plus fort impact sur la qualité, la performance et la maintenabilité de l'application.

### 🚀 Backend
-   [ ] **Utiliser les Vues SQL** : Mettre à jour `DatabaseManager.ts` pour utiliser les vues `player_statistics` et `game_statistics` au lieu de calculer les statistiques manuellement. Cela simplifiera le code et centralisera la logique dans la BDD.
-   [ ] **Résoudre le problème N+1** : Optimiser la méthode `getAllGames` pour récupérer les jeux, leurs extensions et leurs personnages en une seule requête (via des `JOIN`s) afin d'éviter les requêtes multiples et d'améliorer drastiquement les performances.
-   [ ] **Validation avec Zod** : Remplacer la validation manuelle dans `server.ts` par une bibliothèque comme **Zod**. Cela rendra l'API plus robuste, sécurisée et le code plus déclaratif.

### ⚛️ Frontend
-   [ ] **Migration vers React Query** : Remplacer la gestion manuelle de l'état serveur (`useState`/`useEffect` pour les appels API) par **React Query**. C'est la priorité n°1 pour le frontend afin de simplifier le code et de gérer automatiquement le cache, la synchronisation et le re-fetching des données.

## 🏗️ Améliorations d'Architecture (Moyen Terme)

### 🚀 Backend
-   [ ] **Système de Migration BDD** : Mettre en place un outil de migration (ex: `knex.js`) pour gérer les évolutions du schéma de manière versionnée, sécurisée et reproductible.
-   [ ] **Pagination de l'API** : Ajouter la pagination sur les endpoints qui retournent des listes (`/api/games`, `/api/players`) pour garantir l'évolutivité de l'application.

### ⚛️ Frontend
-   [ ] **Tests End-to-End (E2E)** : Mettre en place des tests automatisés avec **Cypress** ou **Playwright** pour valider les parcours utilisateurs critiques et prévenir les régressions.
-   [ ] **Refactoring des Types** : Simplifier les types de requêtes API dans `src/types/index.ts` en utilisant les utilitaires TypeScript (`Omit`, `Pick`) pour réduire la duplication de code.
-   [ ] **Progressive Web App (PWA)** : Rendre l'application installable et permettre une utilisation basique hors ligne.

## ✨ Fonctionnalités Futures (Long Terme)

### Statistiques et Gamification
-   [ ] **Graphiques de Performance** : Intégrer une bibliothèque de graphiques (ex: `recharts`) pour visualiser l'évolution des scores et des victoires.
-   [ ] **Analyse des Tendances** : Développer des vues pour identifier les jeux les plus joués, les adversaires les plus fréquents, etc.
-   [ ] **Comparaison entre Joueurs** : Afficher des statistiques comparatives (head-to-head).
-   [ ] **Système de Succès (Achievements)** : Mettre en place des trophées pour des accomplissements spécifiques (ex: "Première victoire", "Maître de Catan").

### Sessions de Jeu
-   [ ] **Gestion des Campagnes** : Suivi amélioré des parties en mode campagne avec un état persistant entre les sessions.
-   [ ] **Photos de Session** : Permettre d'ajouter des photos à une session de jeu pour immortaliser les moments forts.