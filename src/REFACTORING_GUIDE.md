# Guide de Refactoring Logique/Vue - Status et Instructions

## ✅ Composants Refactorisés (Terminés)

### 1. Dashboard
- **Hook**: `src/hooks/useDashboard.ts` ✅
- **Vue**: `src/views/DashboardView.tsx` ✅ 
- **Composant**: `src/components/Dashboard.tsx` ✅

### 2. PlayersPage (Structure créée)
- **Hook**: `src/hooks/usePlayersPage.ts` ✅
- **Vue**: `src/views/PlayersPageView.tsx` ❌ (à créer)
- **Composant**: `src/components/PlayersPage.tsx` ✅

### 3. SettingsPage (Structure créée)
- **Hook**: `src/hooks/useSettingsPage.ts` ✅
- **Vue**: `src/views/SettingsPageView.tsx` ❌ (à créer)
- **Composant**: `src/components/SettingsPage.tsx` ✅

### 4. GamesPage (Hook créé)
- **Hook**: `src/hooks/useGamesPage.ts` ✅
- **Vue**: `src/views/GamesPageView.tsx` ❌ (à créer)
- **Composant**: `src/components/GamesPage.tsx` ❌ (à refactoriser)

## 📋 Composants à Refactoriser

### 5. GameDetailPage
- **Fichier actuel**: `src/components/GameDetailPage.tsx`
- **Hook à créer**: `src/hooks/useGameDetailPage.ts`
- **Vue à créer**: `src/views/GameDetailPageView.tsx`

### 6. GameExpansionsPage
- **Fichier actuel**: `src/components/GameExpansionsPage.tsx`
- **Hook à créer**: `src/hooks/useGameExpansionsPage.ts`
- **Vue à créer**: `src/views/GameExpansionsPageView.tsx`

### 7. GameCharactersPage
- **Fichier actuel**: `src/components/GameCharactersPage.tsx`
- **Hook à créer**: `src/hooks/useGameCharactersPage.ts`
- **Vue à créer**: `src/views/GameCharactersPageView.tsx`

### 8. PlayerStatsPage
- **Fichier actuel**: `src/components/PlayerStatsPage.tsx`
- **Hook à créer**: `src/hooks/usePlayerStatsPage.ts`
- **Vue à créer**: `src/views/PlayerStatsPageView.tsx`

### 9. GameStatsPage
- **Fichier actuel**: `src/components/GameStatsPage.tsx`
- **Hook à créer**: `src/hooks/useGameStatsPage.ts`
- **Vue à créer**: `src/views/GameStatsPageView.tsx`

### 10. NewGamePage
- **Fichier actuel**: `src/components/NewGamePage.tsx`
- **Hook à créer**: `src/hooks/useNewGamePage.ts`
- **Vue à créer**: `src/views/NewGamePageView.tsx`

## 🛠️ Instructions pour Compléter le Refactoring

### Étape 1: Créer les Vues Manquantes

Pour chaque vue manquante, extraire le JSX du composant actuel et créer un fichier dans `src/views/`:

```typescript
// Exemple: src/views/PlayersPageView.tsx
import React from 'react';
import { /* imports nécessaires */ } from '@phosphor-icons/react';
import { /* imports UI */ } from '@/components/ui/*';

interface PlayersPageViewProps {
  // Props du hook usePlayersPage
}

export function PlayersPageView(props: PlayersPageViewProps) {
  return (
    // JSX extrait du composant original
  );
}
```

### Étape 2: Créer les Hooks Manquants

Pour chaque hook manquant, suivre le pattern établi:

```typescript
// Exemple: src/hooks/useGameDetailPage.ts
import { useState, useEffect } from 'react';
import { Game, NavigationHandler } from '@/types';

export interface GameDetailPageData {
  game: Game;
  onNavigation: NavigationHandler;
  // autres props...
}

export const useGameDetailPage = (data: GameDetailPageData) => {
  // État local
  const [state, setState] = useState();
  
  // Effets
  useEffect(() => {
    // logique d'initialisation
  }, []);
  
  // Handlers
  const handleAction = () => {
    // logique métier
  };
  
  // Valeurs calculées
  const computed = useMemo(() => {
    // calculs
  }, []);
  
  return {
    // Données
    // État
    // Handlers
    // Valeurs calculées
  };
};
```

### Étape 3: Refactoriser les Composants

Pour chaque composant, suivre le pattern:

```typescript
// Exemple: src/components/GameDetailPage.tsx
import React from 'react';
import { GameDetailPageView } from '@/views/GameDetailPageView';
import { useGameDetailPage, GameDetailPageData } from '@/hooks/useGameDetailPage';

interface GameDetailPageProps {
  // Props originales du composant
}

export default function GameDetailPage(props: GameDetailPageProps) {
  const data: GameDetailPageData = {
    // Mapping des props vers les données du hook
  };

  const logic = useGameDetailPage(data);

  return <GameDetailPageView {...logic} />;
}
```

## 📁 Structure Finale

```
src/
├── components/           # Composants orchestrateurs (logique minimale)
│   ├── Dashboard.tsx     ✅
│   ├── PlayersPage.tsx   ✅
│   ├── SettingsPage.tsx  ✅
│   ├── GamesPage.tsx     ❌
│   ├── GameDetailPage.tsx ❌
│   └── ...autres
├── hooks/               # Hooks de logique métier
│   ├── useDashboard.ts   ✅
│   ├── usePlayersPage.ts ✅
│   ├── useSettingsPage.ts ✅
│   ├── useGamesPage.ts   ✅
│   └── ...autres
├── views/               # Composants de présentation pure
│   ├── DashboardView.tsx ✅
│   ├── PlayersPageView.tsx ❌
│   ├── SettingsPageView.tsx ❌
│   └── ...autres
├── types/               # Types partagés
│   └── index.ts         ✅
└── services/            # Services API
    └── ...
```

## 🔧 Utilitaires Créés

- **Types centralisés**: `src/types/index.ts` - Tous les types partagés
- **Documentation**: `src/ARCHITECTURE.md` - Guide de l'architecture
- **Pattern établi**: Exemples complets pour Dashboard, structure pour les autres

## 🎯 Prochaines Étapes

1. **Créer les vues manquantes** (PlayersPageView, SettingsPageView, etc.)
2. **Créer les hooks manquants** (useGameDetailPage, etc.)
3. **Refactoriser les composants restants**
4. **Tester le bon fonctionnement**
5. **Nettoyer les imports inutilisés**

## 📝 Notes Importantes

- Utiliser systématiquement les types de `src/types/index.ts`
- Suivre les conventions de nommage établies
- Maintenir la cohérence dans la structure des hooks
- Préserver toutes les fonctionnalités existantes
- Tester chaque composant après refactoring

La séparation logique/vue est maintenant bien établie avec des exemples complets. Le pattern peut être répliqué pour tous les composants restants.