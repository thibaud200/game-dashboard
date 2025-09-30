# Revue du code : tâches proposées

## 1. Corriger une coquille typographique
- **Fichier** : `src/docs/ARCHITECTURE.md`
- **Problème** : le document contient plusieurs mentions de « joueurs(nexiste pas pour le moment) » sans espace ni apostrophe, ce qui nuit à la lisibilité.
- **Action proposée** : insérer l'espace et l'apostrophe manquants pour obtenir « joueurs (n'existe pas pour le moment) » aux lignes concernées.

## 2. Corriger un bug fonctionnel
- **Fichier** : `src/components/GamesPage.tsx`
- **Problème** : la propriété `games` utilisée par `GamesPageView` provient toujours de `gamesProp`. Les résultats filtrés et triés calculés par le hook `useGamesPage` (valeur `games`) ne sont jamais transmis à la vue, ce qui rend la barre de recherche et les filtres inopérants.
- **Action proposée** : récupérer la valeur `games` renvoyée par `useGamesPage` et la passer à `GamesPageView` à la place de `gamesProp`.

## 3. Corriger un commentaire / anomalie de documentation
- **Fichier** : `src/views/DashboardView.tsx`
- **Problème** : la ligne de commentaire « Annulation de l'import Button » (ligne 2) est obsolète et ne décrit aucune logique actuelle, ce qui ajoute de la confusion.
- **Action proposée** : supprimer ou réécrire ce commentaire pour refléter l'état réel du fichier.

## 4. Améliorer un test
- **Fichier** : `src/__tests__/hooks/useGamesPage.test.ts`
- **Problème** : les tests vérifient la mise à jour de `searchQuery` mais n'assertent pas que la liste `games` renvoyée par le hook est réellement filtrée en fonction de cette recherche, laissant le bug décrit ci-dessus passer inaperçu.
- **Action proposée** : ajouter un test qui vérifie que `result.current.games` ne contient que les jeux correspondant au terme de recherche, afin de détecter la régression actuelle et d'empêcher son retour.
