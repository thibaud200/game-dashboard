# Navigation Context Implementation

## Overview
Implemented contextual navigation for mobile view that remembers the user's navigation source to provide the correct back navigation behavior.

## Key Changes

### 1. App.tsx
- Added `navigationSource` state to track where the user came from
- Updated `handleNavigation` function to accept optional `source` parameter
- Added logic to automatically set navigation source based on current view and destination

### 2. GameDetailPage.tsx
- Added `navigationSource` prop to track navigation origin
- Updated mobile context menu to pass `'game-detail'` as source when navigating to expansions/characters
- Updated desktop manage buttons to pass correct source

### 3. GameExpansionsPage.tsx & GameCharactersPage.tsx
- Added `navigationSource` prop
- Updated back button logic to navigate contextually:
  - If source is `'game-detail'`: Navigate back to game detail page
  - If source is `'games'`: Navigate back to games list
- Updated header text to reflect correct back destination

### 4. GamesPage.tsx
- Updated navigation calls to pass `'games'` as source when navigating to:
  - Game detail view
  - Game expansions management
  - Game characters management

## Navigation Flow Examples

### Desktop Behavior (unchanged)
1. Games List → Game Detail → (Tabs for Extensions/Characters)

### Mobile Behavior

#### Scenario 1: From Games List
1. Games List → Game Detail (via context menu)
2. Game Detail → Extensions (via context menu) → **Back to Game Detail**
3. Game Detail → Characters (via context menu) → **Back to Game Detail**

#### Scenario 2: Direct Access
1. Games List → Extensions (via card context menu) → **Back to Games List**
2. Games List → Characters (via card context menu) → **Back to Games List**

## Technical Implementation

### Navigation Source Tracking
```typescript
const [navigationSource, setNavigationSource] = useState<string>('games')

const handleNavigation = (view: string, gameId?: number, source?: string) => {
  // Automatic source detection
  if (view === 'game-expansions' || view === 'game-characters') {
    if (currentView === 'game-detail') {
      setNavigationSource('game-detail')
    } else {
      setNavigationSource('games')
    }
  }
}
```

### Contextual Back Navigation
```typescript
// In GameExpansionsPage & GameCharactersPage
onClick={() => {
  if (navigationSource === 'game-detail') {
    onNavigation('game-detail', game.game_id)
  } else {
    onNavigation('games')
  }
}}
```

This ensures users always get the expected navigation behavior regardless of how they accessed the current page.