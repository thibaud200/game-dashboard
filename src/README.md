# Frontend Board Game Dashboard

## 📁 Structure du Frontend

```
src/
├── components/              # Composants React principaux (logique métier)
│   ├── dialogs/            # Boîtes de dialogue réutilisables
│   │   ├── AddGameDialog.tsx
│   │   ├── EditGameDialog.tsx
│   │   ├── DeleteGameDialog.tsx
│   │   ├── AddPlayerDialog.tsx
│   │   ├── EditPlayerDialog.tsx
│   │   └── DeletePlayerDialog.tsx
│   ├── games/              # Composants spécifiques aux jeux
│   │   ├── AddGameDialog.tsx
│   │   ├── EditGameDialog.tsx
│   │   └── DeleteGameDialog.tsx
│   ├── players/            # Composants spécifiques aux joueurs
│   │   ├── AddPlayerDialog.tsx
│   │   ├── EditPlayerDialog.tsx
│   │   └── DeletePlayerDialog.tsx
│   ├── ui/                 # Composants UI de base (shadcn)
│   ├── Dashboard.tsx       # ✅ Refactorisé
│   ├── PlayersPage.tsx     # ✅ Refactorisé
│   ├── GamesPage.tsx       # 🔄 En cours
│   ├── StatsPage.tsx
│   ├── SettingsPage.tsx
│   ├── NewGamePage.tsx
│   ├── GameDetailPage.tsx
│   ├── GameExpansionsPage.tsx
│   ├── GameCharactersPage.tsx
│   └── BottomNavigation.tsx
├── hooks/                   # Hooks React personnalisés (logique réutilisable)
│   ├── games/              # Hooks spécifiques aux jeux
│   │   ├── useGameExpansions.ts
│   │   └── useGameCharacters.ts
│   ├── players/            # Hooks spécifiques aux joueurs
│   ├── useDashboard.ts     # ✅ Créé
│   ├── usePlayersPage.ts   # ✅ Créé
│   ├── useGamesPage.ts     # ✅ Créé
│   ├── useStatsPage.ts
│   ├── usePlayerStatsPage.ts
│   ├── useGameStatsPage.ts
│   ├── useNewGamePage.ts
│   └── useSettingsPage.ts  # ✅ Créé
├── views/                  # Composants de présentation pure (JSX/HTML)
│   ├── games/              # Vues spécifiques aux jeux
│   │   ├── GameExpansionsView.tsx
│   │   └── GameCharactersView.tsx
│   ├── players/            # Vues spécifiques aux joueurs
│   ├── DashboardView.tsx   # ✅ Créé
│   ├── PlayersPageView.tsx # 🔄 À créer
│   ├── GamesPageView.tsx   # ✅ Créé
│   ├── StatsPageView.tsx
│   ├── PlayerStatsView.tsx
│   ├── GameStatsView.tsx
│   ├── NewGameView.tsx     # ✅ Créé
│   └── SettingsPageView.tsx # 🔄 À créer
├── services/               # Services pour les appels API
│   ├── ApiService.ts       # Service principal backend
│   ├── bggApi.ts          # Service BoardGameGeek API
│   └── BGGService.ts      # ⚠️ Doublon à nettoyer
├── types/                  # Définitions TypeScript
│   └── index.ts           # ✅ Types centralisés
├── utils/                  # Utilitaires
│   ├── testBGG.ts
│   └── cn.ts
├── docs/                   # 📖 Documentation frontend
│   ├── ARCHITECTURE.md     # Architecture complète
│   ├── REFACTORING_GUIDE.md # Guide de refactoring
│   └── FIELD_MAPPING_DOCUMENTATION.md # Mapping BDD
├── styles/                 # Styles spécifiques
│   └── globals.css
├── lib/                    # Bibliothèques utilitaires
│   └── utils.ts
├── App.tsx                 # 🎯 Composant racine
├── index.css              # 🎨 Styles principaux
├── main.tsx               # 🚀 Point d'entrée (ne pas modifier)
└── main.css               # 🔒 Styles structurels (ne pas modifier)
```


## ✅ État du Refactoring

### 🟢 Terminés
- **Dashboard** : Hook + View + Component
- **Types** : Interfaces centralisées
- **Documentation** : Architecture et guides

### 🟡 En Cours
- **PlayersPage** : Hook ✅ | View ❌ | Component ✅
- **GamesPage** : Hook ✅ | View ✅ | Component ❌
- **SettingsPage** : Hook ✅ | View ❌ | Component ✅

### 🔴 À Faire
- **StatsPage** : Refactoring complet
- **NewGamePage** : Hook + View
- **GameDetailPage** : Refactoring complet
- **GameExpansionsPage** : Refactoring complet
- **GameCharactersPage** : Refactoring complet

## 🛠️ Technologies Utilisées

### Frontend Stack
- **React 18** : Framework principal
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utilitaire
- **shadcn/ui** : Bibliothèque de composants
- **Phosphor Icons** : Icônes
- **Framer Motion** : Animations (usage minimal)

### Services & APIs
- **BoardGameGeek API** : Données des jeux
- **Fetch API** : Requêtes HTTP
- **Spark KV** : Persistance locale

## 📋 Conventions de Code

### Naming
- **Components** : `PascalCase` (ex: `GameCard`)
- **Hooks** : `camelCase` avec `use` (ex: `useGameData`)
- **Views** : `PascalCase` avec `View` (ex: `GameCardView`)
- **Types** : `PascalCase` (ex: `Player`)

### Structure des Fichiers
- **Components** : Logique minimale, orchestration
- **Hooks** : Logique métier, état, effets
- **Views** : JSX pur, pas de logique
- **Types** : Interfaces centralisées dans `/types/index.ts`

## 🔄 Processus de Développement

### Ajout d'une Nouvelle Page

1. **Créer le hook** dans `/hooks/usePageName.ts`
2. **Créer la vue** dans `/views/PageNameView.tsx`
3. **Créer le container** dans `/components/PageName.tsx`
4. **Ajouter les types** dans `/types/index.ts`
5. **Intégrer** dans `App.tsx`

### Modification d'une Page Existante

1. **Identifier le composant** (Container, Hook, ou View)
2. **Modifier le fichier approprié**
3. **Mettre à jour les types** si nécessaire
4. **Tester** le bon fonctionnement

## 📖 Documentation

- **Architecture** : `/src/docs/ARCHITECTURE.md`
- **Refactoring** : `/src/docs/REFACTORING_GUIDE.md`
- **Mapping BDD** : `/src/docs/FIELD_MAPPING_DOCUMENTATION.md`

## 🚀 Prochaines Étapes

1. **Compléter le refactoring** des pages restantes
2. **Nettoyer les doublons** (BGGService)
3. **Ajouter les tests** unitaires
4. **Optimiser les performances** avec React.memo
5. **Documenter les composants** avec JSDoc

## 💡 Bonnes Pratiques

- **Séparer logique et présentation** systématiquement
- **Utiliser les types TypeScript** pour tout
- **Centraliser l'état** dans les hooks appropriés
- **Éviter la duplication** de code
- **Documenter** les fonctions complexes