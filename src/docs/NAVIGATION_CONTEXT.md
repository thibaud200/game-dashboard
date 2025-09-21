# Navigation Context Implementation

## Overview

This document describes the navigation context system implemented to handle complex navigation flows between game-related pages.

## Context-Aware Navigation

### Purpose
- Provide contextual navigation that respects the user's journey
- Enable proper back navigation from detail views
- Support different behaviors for desktop vs mobile

### Implementation

#### Navigation Context Structure
```typescript
interface NavigationContext {
  id?: number;
  source?: string;
  initialTab?: 'players' | 'games';
}
```

#### Source Types
- `'games'` - Navigation from games list
- `'game-detail'` - Navigation from game detail view
- `'dashboard'` - Navigation from dashboard
- `'stats'` - Navigation from statistics pages

## Page-Specific Implementations

### 1. Game Detail Page
- Tracks navigation source to determine correct back destination
- Mobile: Context menu for accessing expansions/characters
- Desktop: Tab-based interface

### 2. Game Expansions Page
- Contextual back navigation:
  - From games list → Back to games list
  - From game detail → Back to game detail
- Header text reflects correct destination

### 3. Game Characters Page
- Same contextual navigation as expansions
- Consistent behavior across mobile/desktop

### 4. Statistics Pages
- Auto-selects appropriate tab based on navigation source
- Maintains context when switching between stats types

## Navigation Flows

### Desktop Behavior
```
Games List → Game Detail → [Tabs: General | Expansions | Characters]
```

### Mobile Behavior

#### Scenario 1: From Games List
```
Games List → Game Detail → (Context Menu) → Expansions → Back to Game Detail
```

#### Scenario 2: Direct Access
```
Games List → (Context Menu) → Expansions → Back to Games List
```

## Implementation Details

### App.tsx Navigation Handler
```typescript
const handleNavigation = (view: string, id?: number, source?: string) => {
  setCurrentView(view);
  
  if (view === 'stats') {
    let initialTab: 'players' | 'games' = 'players';
    if (source === 'games' || currentView === 'games') {
      initialTab = 'games';
    }
    setNavigationContext({ id, source, initialTab });
  } else {
    setNavigationContext({ id, source });
  }
};
```

### Component Navigation Props
```typescript
// Example: GameExpansionsPage
interface Props {
  game: Game;
  onNavigation: (view: string, id?: number, source?: string) => void;
  navigationSource?: string;
}
```

## Benefits

1. **Intuitive Navigation**: Users always know where the back button will take them
2. **Context Preservation**: Navigation respects the user's journey
3. **Platform Consistency**: Different behaviors for mobile vs desktop when appropriate
4. **Extensible**: Easy to add new navigation sources and contexts

## Usage Guidelines

### Adding New Pages
1. Accept `navigationSource` prop if the page can be accessed from multiple locations
2. Implement contextual back navigation based on source
3. Update header text to reflect correct back destination
4. Pass source when navigating to sub-pages

### Testing Navigation
- Test all navigation paths from different entry points
- Verify back button behavior in all contexts
- Ensure header text is correct for each context
- Test both mobile and desktop behaviors