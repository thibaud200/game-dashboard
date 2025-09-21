# ⚠️ Fichier Migré vers src/docs/

Ce fichier a été déplacé vers : `/src/docs/NAVIGATION_CONTEXT.md`

Pour accéder à la documentation de navigation, consultez :
`src/docs/NAVIGATION_CONTEXT.md`

Voir également :
- `/src/docs/ARCHITECTURE.md` pour l'architecture complète
- `/src/docs/REFACTORING_GUIDE.md` pour les patterns de développement




- Added logic 

- Updated mobi

- Added `navigationSource` prop
- Added logic to automatically set navigation source based on current view and destination

### 2. GameDetailPage.tsx
- Added `navigationSource` prop to track navigation origin
- Updated mobile context menu to pass `'game-detail'` as source when navigating to expansions/characters
- Updated desktop manage buttons to pass correct source

### 3. GameExpansionsPage.tsx & GameCharactersPage.tsx
- Added `navigationSource` prop
- Updated back button logic to navigate contextually:
## Navigation Flow Examples
  - If source is `'games'`: Navigate back to games list
- Updated header text to reflect correct back destination


- Updated navigation calls to pass `'games'` as source when navigating to:
2. Game Detail → Ext
  - Game expansions management
#### Scenario 2: Direct Access



### Desktop Behavior (unchanged)
1. Games List → Game Detail → (Tabs for Extensions/Characters)

### Mobile Behavior

#### Scenario 1: From Games List
    } else {
2. Game Detail → Extensions (via context menu) → **Back to Game Detail**




































