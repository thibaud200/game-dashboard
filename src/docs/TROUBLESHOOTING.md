# 🛠️ Guide de Dépannage (Troubleshooting)

## Overview
Ce document recense les problèmes courants rencontrés durant le développement et leurs solutions.

## ✅ Problèmes Résolus

### 1. Problèmes Réseau et API

#### Headers de réponse CORS
-   **Problème** : Les en-têtes de réponse CORS n'étaient pas correctement configurés sur le backend, bloquant les requêtes du frontend.
-   **Solution** : Mise à jour de `backend/server.ts` avec une configuration CORS spécifique :
    ```javascript
    app.use(cors({
      credentials: true,
      origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    ```

#### Intégration de l'API BGG
-   **Problème** : Les réponses XML de l'API BoardGameGeek nécessitaient un parsing complexe.
-   **Solution** : Implémentation d'un service BGG (`bggApi.ts`) complet qui gère :
    -   La recherche de jeux.
    -   La détection automatique de la difficulté, des modes de jeu (coopératif, etc.).
    -   Le parsing des extensions et des personnages.

### 2. Accessibilité et UI

#### Accessibilité des formulaires (Label/Input)
-   **Problème** : Utilisation incorrecte de `<label for="...">`, causant des problèmes d'accessibilité.
-   **Solution** : Tous les formulaires respectent désormais les bonnes pratiques :
    -   Attribut `htmlFor` sur les composants `<Label>`.
    -   Attributs `id` et `name` correspondants sur les composants `<Input>`.
    -   Exemple :
        ```jsx
        <Label htmlFor="player_name">Nom du Joueur *</Label>
        <Input id="player_name" name="player_name" ... />
        ```

#### Avertissements sur les Dialogues
-   **Problème** : Les composants `DialogContent` n'avaient pas de description accessible (`aria-describedby`).
-   **Solution** : Ajout systématique du composant `DialogDescription` dans toutes les modales pour améliorer l'accessibilité.

#### Tooltip Provider
-   **Problème** : Les composants `Tooltip` nécessitaient d'être enveloppés dans un `TooltipProvider`.
-   **Solution** : Ajout d'un `TooltipProvider` global dans `App.tsx` qui englobe toute l'application.

#### Props invalides sur React.Fragment
-   **Problème** : Des props non valides étaient passées à `React.Fragment`.
-   **Solution** : Nettoyage de tous les fragments pour n'inclure que des props valides (`key`).

### 3. Logique Applicative

#### Validation des formulaires
-   **Problème** : Aucune validation sur les champs de formulaire.
-   **Solution** : Ajout d'une validation complète sur tous les formulaires avec retour visuel en temps réel.

#### Responsive Design Mobile
-   **Problème** : L'interface n'était pas optimisée pour les appareils mobiles.
-   **Solution** : Implémentation d'un design adaptatif avec :
    -   Menus contextuels pour les actions sur mobile.
    -   Tooltips au survol pour le bureau.
    -   Layouts qui s'adaptent à la taille de l'écran.

## ✅ Améliorations de la Qualité du Code

### Organisation des Composants
-   Séparation claire de la logique et de la présentation (Pattern Container/Presenter).
-   Centralisation de la gestion des dialogues.
-   Extraction de la logique réutilisable dans des hooks personnalisés.

### Gestion des Erreurs
-   Mise en place de `Error Boundaries` pour capturer les erreurs de rendu.
-   Gestion centralisée des erreurs API dans les services.
-   Messages d'erreur clairs pour l'utilisateur.

## 🔧 Lignes Directrices pour la Maintenance

### Ajout de Nouvelles Fonctionnalités
1.  Suivre les patterns établis (Container/Presenter, Hooks).
2.  Ajouter les types TypeScript appropriés.
3.  Implémenter une validation complète des formulaires.
4.  Inclure une gestion des erreurs robuste.
5.  Tester l'expérience sur mobile et sur ordinateur.

### Tests
-   Tester tous les flux de navigation.
-   Vérifier la validation des formulaires.
-   Contrôler la conformité à l'accessibilité.
-   Valider le design responsive.