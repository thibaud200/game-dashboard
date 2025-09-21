# Guide de Refactoring : Séparation Vue/Logique

## Vue d'ensemble

Ce document détaille le processus de refactoring appliqué pour séparer la logique métier de la présentation dans l'application Board Game Dashboard.

## Principes de Séparation

### 1. Container/Presenter Pattern

**Containers (Components)**
- Gestion de l'état local
- Logique métier
- Appels aux hooks personnalisés
- Gestion des événements

**Presenters (Views)**
- Interface utilisateur pure
- Props en entrée uniquement
- Aucune logique métier
- Composants réutilisables

### 2. Structure des Fichiers

#### Avant Refactoring
```
src/components/
├── PlayersPage.tsx          # 500+ lignes : UI + logique
├── GamesPage.tsx            # 600+ lignes : UI + logique
└── Dashboard.tsx            # 400+ lignes : UI + logique
```

#### Après Refactoring
```
src/
├── components/              # Logique métier
│   ├── PlayersPage.tsx      # 100 lignes : logique seule
│   ├── GamesPage.tsx        # 120 lignes : logique seule
│   └── Dashboard.tsx        # 80 lignes : logique seule
├── views/                   # Présentation pure
│   ├── PlayersPageView.tsx  # 400 lignes : UI seule
│   ├── GamesPageView.tsx    # 480 lignes : UI seule
│   └── DashboardView.tsx    # 320 lignes : UI seule
└── hooks/                   # Logique réutilisable
    ├── usePlayersPage.ts    # État et actions
    ├── useGamesPage.ts      # État et actions
    └── useDashboard.ts      # État et actions
```

## Extraction des Hooks

### Pattern de Hook Personnalisé

```typescript
// hooks/usePlayersPage.ts
export function usePlayersPage(
  initialPlayers: Player[],
  onAddPlayer: (player: PlayerData) => void,
  onUpdatePlayer: (id: number, data: Partial<Player>) => void,
  onDeletePlayer: (id: number) => void
) {
  // État local
  const [players, setPlayers] = useState(initialPlayers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Logique métier
  const filteredPlayers = useMemo(() => {
    return players.filter(player => 
      player.player_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [players, searchTerm]);
  
  // Gestionnaires d'événements
  const handleAddPlayer = useCallback((playerData: PlayerData) => {
    onAddPlayer(playerData);
    setShowAddDialog(false);
  }, [onAddPlayer]);
  
  return {
    // État
    players: filteredPlayers,
    searchTerm,
    showAddDialog,
    
    // Actions
    setSearchTerm,
    setShowAddDialog,
    handleAddPlayer,
    // ... autres actions
  };
}
```

### Utilisation dans le Container

```typescript
// components/PlayersPage.tsx
export default function PlayersPage({ 
  players: initialPlayers, 
  onAddPlayer, 
  onUpdatePlayer, 
  onDeletePlayer 
}) {
  const {
    players,
    searchTerm,
    showAddDialog,
    setSearchTerm,
    setShowAddDialog,
    handleAddPlayer,
    // ... autres propriétés
  } = usePlayersPage(initialPlayers, onAddPlayer, onUpdatePlayer, onDeletePlayer);
  
  return (
    <PlayersPageView
      players={players}
      searchTerm={searchTerm}
      showAddDialog={showAddDialog}
      onSearchChange={setSearchTerm}
      onShowAddDialog={setShowAddDialog}
      onAddPlayer={handleAddPlayer}
      // ... autres props
    />
  );
}
```

## Séparation des Dialogs

### Avant : Dialogs Intégrés
Les dialogs étaient directement inclus dans les composants de page, créant des fichiers monolithiques.

### Après : Dialogs Modulaires

```
src/components/
├── dialogs/                 # Dialogs génériques
│   ├── AddPlayerDialog.tsx
│   ├── EditPlayerDialog.tsx
│   ├── DeletePlayerDialog.tsx
│   ├── AddGameDialog.tsx
│   ├── EditGameDialog.tsx
│   └── DeleteGameDialog.tsx
├── games/                   # Dialogs spécifiques aux jeux
│   ├── AddGameDialog.tsx
│   ├── EditGameDialog.tsx
│   └── DeleteGameDialog.tsx
└── players/                 # Dialogs spécifiques aux joueurs
    ├── AddPlayerDialog.tsx
    ├── EditPlayerDialog.tsx
    └── DeletePlayerDialog.tsx
```

### Pattern de Dialog

```typescript
// components/dialogs/AddPlayerDialog.tsx
interface AddPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPlayer: (player: PlayerData) => void;
}

export function AddPlayerDialog({ 
  open, 
  onOpenChange, 
  onAddPlayer 
}: AddPlayerDialogProps) {
  const [formData, setFormData] = useState<PlayerData>({
    player_name: '',
    avatar: ''
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPlayer(formData);
    onOpenChange(false);
    setFormData({ player_name: '', avatar: '' });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* UI du dialog */}
    </Dialog>
  );
}
```

## Gestion de l'État

### État Local vs Global

**État Global (App.tsx)**
- Données partagées entre composants
- Données persistantes
- Navigation et contexte

**État Local (Hooks)**
- État de l'interface utilisateur
- Données temporaires
- État des formulaires

### Pattern de Remontée d'État

```typescript
// App.tsx - État global
const [players, setPlayers] = useState<Player[]>([]);

const handleAddPlayer = (playerData: PlayerData) => {
  const newPlayer = {
    ...playerData,
    player_id: generateId(),
    created_at: new Date()
  };
  setPlayers(prev => [...prev, newPlayer]);
};

// PlayersPage.tsx - Container
<PlayersPageView 
  onAddPlayer={handleAddPlayer}
  // ... autres props
/>

// usePlayersPage.ts - Hook
const handleAddPlayer = useCallback((playerData: PlayerData) => {
  onAddPlayer(playerData); // Remonte vers App.tsx
  setShowAddDialog(false); // État local
}, [onAddPlayer]);
```

## Avantages du Refactoring

### 1. Maintenabilité
- Fichiers plus petits et focalisés
- Responsabilités clairement séparées
- Modifications plus faciles

### 2. Réutilisabilité
- Hooks réutilisables dans d'autres contextes
- Dialogs modulaires
- Vues découplées de la logique

### 3. Testabilité
- Tests unitaires des hooks
- Tests de composants UI séparés
- Mocking facilité

### 4. Lisibilité
- Code plus facile à comprendre
- Navigation dans le code améliorée
- Documentation naturelle par la structure

## Conventions Adoptées

### 1. Naming
- **Hooks** : `use[Feature]Page` (ex: `usePlayersPage`)
- **Views** : `[Feature]View` (ex: `PlayersPageView`)
- **Dialogs** : `[Action][Entity]Dialog` (ex: `AddPlayerDialog`)

### 2. Structure des Props
- **Container → View** : Données et callbacks
- **Parent → Dialog** : État d'ouverture et callbacks
- **Hook → Container** : État et actions

### 3. Gestion des Erreurs
- Errors catched dans les hooks
- UI errors display dans les views
- Global error handling dans App.tsx

## Migration Progressive

### Étapes de Migration
1. **Audit** : Identifier les composants à refactorer
2. **Extraction** : Créer les hooks correspondants
3. **Séparation** : Diviser container/presenter
4. **Dialogs** : Extraire les dialogs en composants séparés
5. **Tests** : Ajouter les tests pour les nouveaux composants
6. **Validation** : Vérifier le bon fonctionnement

### Composants Migrés
- ✅ PlayersPage → PlayersPageView + usePlayersPage
- ✅ GamesPage → GamesPageView + useGamesPage  
- ✅ Dashboard → DashboardView + useDashboard
- ✅ StatsPage → StatsPageView + useStatsPage
- ✅ NewGamePage → NewGameView + useNewGamePage

### Prochaines Étapes
- Migration des composants de détail
- Optimisation des performances
- Ajout de tests automatisés
- Documentation des patterns