# 📖 Guide de Développement Frontend

## Vue d'ensemble

Ce document est le guide central pour le développement frontend. Il détaille les patterns d'architecture, les conventions de code et les meilleures pratiques à suivre pour maintenir un code propre, maintenable et cohérent.

## 1. Patterns d'Architecture Fondamentaux

### 1.1. Container/Presenter Pattern

Nous utilisons une séparation stricte entre la logique (containers) et la présentation (presenters/views).

-   **Containers (`/components`)**: Gèrent l'état, la logique métier, les appels aux hooks et la gestion des événements.
-   **Presenters (`/views`)**: Composants d'interface utilisateur purs. Ils reçoivent des données via les `props` et émettent des événements, mais ne contiennent aucune logique métier.

```typescript
// Container (components/PlayersPage.tsx)
export default function PlayersPage(props) {
  const logic = usePlayersPage(props);
  return <PlayersPageView {...logic} />;
}

// View (views/PlayersPageView.tsx)
export function PlayersPageView(props) {
  // JSX pur qui utilise les props fournies par le container
  return <div>{/* ... */}</div>;
}
```

### 1.2. Custom Hooks Pattern

La logique métier et la gestion de l'état local d'une page ou d'un composant complexe sont extraites dans des hooks personnalisés.

-   **Hooks (`/hooks`)**: Centralisent la logique réutilisable, facilitent les tests et allègent les composants.

```typescript
// Hook (hooks/usePlayersPage.ts)
export const usePlayersPage = (initialPlayers) => {
  const [searchTerm, setSearchTerm] = useState('');
  // ... autre logique d'état et de filtrage

  const handleAddPlayer = useCallback(() => {
    // ... logique pour ajouter un joueur
  }, []);

  return {
    // État
    searchTerm,
    // Actions
    setSearchTerm,
    handleAddPlayer,
  };
};
```

### 1.3. Service Layer Pattern

Toutes les communications avec les APIs externes (backend, BGG) sont abstraites dans des services.

-   **Services (`/services`)**: Centralisent les appels API, la gestion des erreurs et la transformation des données.

## 2. Gestion de l'État (State Management)

-   **État Global (`App.tsx`)**: Données partagées entre plusieurs pages (liste des joueurs, jeux, contexte de navigation).
-   **État Local (Hooks)**: État spécifique à une vue ou un composant (termes de recherche, état d'un formulaire, ouverture d'une modale).

Le pattern de "remontée d'état" (lifting state up) est utilisé pour que les composants enfants puissent notifier les parents de changements.

```typescript
// App.tsx - État global
const [players, setPlayers] = useState<Player[]>([]);

const handleAddPlayer = (playerData: PlayerData) => {
  // Logique pour ajouter un joueur à l'état global
};

// PlayersPage.tsx -> usePlayersPage.ts -> PlayersPageView.tsx
// Le callback onAddPlayer est passé jusqu'à la vue, qui le remonte à App.tsx
<PlayersPageView onAddPlayer={handleAddPlayer} />
```

## 3. Implémentation des Composants

### 3.1. Dialogues Modulaires

Les boîtes de dialogue (modales) sont des composants indépendants et réutilisables situés dans `/src/components/dialogs/`.

**Caractéristiques :**
-   Chaque dialogue gère son propre état de formulaire interne.
-   La validation des formulaires est intégrée directement dans les dialogues.
-   Ils communiquent avec leur parent via des props (`open`, `onOpenChange`, `onSubmit`).

```typescript
// components/dialogs/AddPlayerDialog.tsx
interface AddPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPlayer: (player: PlayerData) => void;
}

export function AddPlayerDialog({ open, onOpenChange, onAddPlayer }: AddPlayerDialogProps) {
  // Logique du formulaire avec validation (ex: Zod + React Hook Form)
  const handleSubmit = (data) => {
    onAddPlayer(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* UI du formulaire de dialogue */}
    </Dialog>
  );
}
```

### 3.2. Validation des Formulaires

La validation est effectuée en temps réel côté client pour une meilleure expérience utilisateur.

-   **Indicateurs visuels** : Les champs invalides sont mis en évidence.
-   **Messages d'erreur clairs** : Des messages explicites guident l'utilisateur.
-   **Validation à la soumission** : Empêche l'envoi de données incorrectes.

**Exemple de règles de validation (AddPlayerDialog) :**
-   **Nom du joueur** : Requis, 2-50 caractères.
-   **URL de l'avatar** : Optionnel, mais doit être une URL d'image valide si fournie.

## 4. Navigation

Le système de navigation est contextuel pour gérer les parcours utilisateurs complexes, notamment sur mobile.

### Contexte de Navigation

Un objet `navigationContext` dans l'état global (`App.tsx`) conserve la source de la navigation.

```typescript
interface NavigationContext {
  id?: number;      // ID de l'entité (ex: game_id)
  source?: string;  // D'où vient l'utilisateur ('games', 'game-detail', etc.)
}
```

### Flux de Navigation

Ce contexte permet de déterminer où le bouton "Retour" doit ramener l'utilisateur.

-   **Exemple** : `Games List` → `Game Detail` → `Expansions`. Le retour depuis `Expansions` doit ramener à `Game Detail`, et non à `Games List`.

La fonction `handleNavigation` dans `App.tsx` centralise la logique de mise à jour de la vue et du contexte.

```typescript
// App.tsx
const handleNavigation = (view: string, id?: number, source?: string) => {
  setCurrentView(view);
  setNavigationContext({ id, source });
};
```

## 5. Conventions de Code

### 5.1. Nommage (Naming)

-   **Composants** : `PascalCase` (ex: `GameCard.tsx`)
-   **Vues** : `PascalCase` avec suffixe `View` (ex: `PlayersPageView.tsx`)
-   **Hooks** : `camelCase` avec préfixe `use` (ex: `useGameData.ts`)
-   **Types** : `PascalCase` (ex: `Player`)
-   **Variables** : `camelCase` (ex: `gameList`)

### 5.2. Organisation des Imports

Suivez cet ordre pour une meilleure lisibilité :

```typescript
// 1. Imports de React
import React, { useState, useEffect } from 'react';

// 2. Bibliothèques externes
import { Button } from '@/components/ui/button';

// 3. Imports internes (absolus via @/)
import { Player } from '@/types';
import { usePlayersPage } from '@/hooks';

// 4. Imports relatifs (composants frères, styles)
import './ComponentName.css';
```

## 6. Tests

L'architecture facilite les tests à différents niveaux.

### Structure des Tests

```
src/
├── __tests__/           # Tests unitaires globaux
├── components/
│   └── __tests__/       # Tests de composants
├── hooks/
│   └── __tests__/       # Tests de hooks
└── services/
    └── __tests__/       # Tests de services
```

### Types de Tests

-   **Tests Unitaires** : Logique pure dans les hooks et les utilitaires.
-   **Tests de Composants** : Rendu et interactions des composants de vue (`/views`).
-   **Tests d'Intégration** : Flux complets impliquant containers, hooks et services.

## 7. Évolutions Futures

### Améliorations Prévues
-   Migration vers **React Query** ou **SWR** pour la gestion de l'état serveur.
-   Implémentation d'une **Progressive Web App (PWA)**.
-   Ajout de tests automatisés de bout en bout (E2E) avec Cypress ou Playwright.

