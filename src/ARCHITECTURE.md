# Architecture de séparation logique/vue

Cette refactorisation sépare la logique métier (TypeScript) de la présentation (JSX/HTML) pour toutes les pages de l'application.

## Structure proposée

```
src/
├── components/          # Composants orchestrateurs (logique minimale)
├── hooks/              # Hooks personnalisés (logique métier)
├── views/              # Composants de présentation pure (JSX/HTML)
├── services/           # Services API et utilitaires
└── types/              # Types TypeScript partagés
```

## Pattern implémenté

### 1. Composant orchestrateur (components/)
```typescript
// components/Dashboard.tsx
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardView } from '@/views/DashboardView';

export default function Dashboard(props: DashboardProps) {
  const logic = useDashboard(props);
  return <DashboardView {...logic} />;
}
```

### 2. Hook logique métier (hooks/)
```typescript
// hooks/useDashboard.ts
export const useDashboard = (data: DashboardData) => {
  // État local
  const [state, setState] = useState();
  
  // Logique métier
  const handleAction = () => { /* ... */ };
  
  // Valeurs calculées
  const computed = useMemo(() => { /* ... */ }, []);
  
  return {
    // Données
    data,
    state,
    
    // Handlers
    handleAction,
    
    // Valeurs calculées
    computed
  };
};
```

### 3. Vue pure (views/)
```typescript
// views/DashboardView.tsx
export function DashboardView({
  data,
  state,
  handleAction,
  computed
}: DashboardViewProps) {
  return (
    <div>
      {/* JSX pur sans logique */}
    </div>
  );
}
```

## Composants refactorisés

### ✅ Implémentés
- **Dashboard**: `useDashboard` + `DashboardView`
- **PlayersPage**: `usePlayersPage` + `PlayersPageView` (structure créée)

### 📋 À implémenter
- **GamesPage**: `useGamesPage` + `GamesPageView`
- **GameDetailPage**: `useGameDetailPage` + `GameDetailPageView`
- **GameExpansionsPage**: `useGameExpansionsPage` + `GameExpansionsPageView`
- **GameCharactersPage**: `useGameCharactersPage` + `GameCharactersPageView`
- **PlayerStatsPage**: `usePlayerStatsPage` + `PlayerStatsPageView`
- **GameStatsPage**: `useGameStatsPage` + `GameStatsPageView`
- **NewGamePage**: `useNewGamePage` + `NewGamePageView`
- **SettingsPage**: `useSettingsPage` + `SettingsPageView`

## Avantages de cette architecture

### 🔧 Maintenabilité
- Logique métier centralisée dans les hooks
- Composants de vue réutilisables
- Tests unitaires simplifiés

### 🎨 Séparation des responsabilités
- **Hooks**: État, effets, logique métier
- **Views**: Présentation pure, pas de logique
- **Components**: Orchestration simple

### 🔄 Réutilisabilité
- Hooks réutilisables dans différents contextes
- Vues interchangeables
- Logique découplée de la présentation

### 🧪 Testabilité
- Hooks testables indépendamment
- Vues testables avec des props mockées
- Logique métier isolée

## Types partagés

Créer un fichier `src/types/index.ts` pour centraliser les interfaces :

```typescript
export interface Player {
  player_id: number;
  player_name: string;
  // ...
}

export interface Game {
  game_id: number;
  name: string;
  // ...
}

export interface NavigationHandler {
  (view: string, id?: number, source?: string): void;
}
```

## Convention de nommage

- **Hook**: `use[PageName]` (ex: `useDashboard`, `usePlayersPage`)
- **View**: `[PageName]View` (ex: `DashboardView`, `PlayersPageView`)
- **Component**: `[PageName]` (ex: `Dashboard`, `PlayersPage`)

Cette architecture permet une meilleure organisation du code et facilite la maintenance à long terme.